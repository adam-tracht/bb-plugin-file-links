// bb-plugin-file-links: backend entry.
//
// The frontend content script finds file paths in timeline tool rows
// ("Read file <path>", "Viewed image: <path>") but has no thread or
// environment context. This backend turns (threadId, itemId, path) into an
// absolute path on the thread's machine, serves image bytes for thumbnails,
// and reveals files in Finder when the machine is this Mac.
//
// Relative paths are tried against, in order: the folder the producing
// command cd'd into, the command's recorded cwd, then the environment folder.
// The first candidate that exists wins.
import { execFile } from "node:child_process";
import { stat } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { defineRpcContract, type BbPluginApi } from "@get-bb/plugin-sdk";
import { z } from "zod";
import { effectiveCommandDir } from "./shell-cwd";

const THREAD_ID = z.string().regex(/^thr_[A-Za-z0-9_]{1,120}$/);
const FILE_PATH = z.string().min(1).max(4096);
// Timeline item ids such as "dacbc882ef-i28" (from data-timeline-row-id).
const ITEM_ID = z.string().regex(/^[A-Za-z0-9_-]{1,120}$/);

const IMAGE_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".bmp": "image/bmp",
};
const MAX_IMAGE_BYTES = 20 * 1024 * 1024;
const CONTEXT_TTL_MS = 60_000;
const RESOLUTION_TTL_MS = 30_000;
const ITEM_REFRESH_MS = 2_000;
// The events API caps a page at 100.
const EVENTS_PAGE = 100;
const MAX_THREAD_INDEXES = 20;
const MAX_RESOLUTIONS = 2_000;

const targetSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("workspace"), environmentId: z.string(), path: z.string() }),
  z.object({ kind: z.literal("host"), hostId: z.string(), path: z.string() }),
]);

export const rpcContract = defineRpcContract({
  resolve: {
    input: z.object({ threadId: THREAD_ID, path: FILE_PATH, itemId: ITEM_ID.optional() }).strict(),
    output: z.object({
      absolutePath: z.string(),
      target: targetSchema,
      isImage: z.boolean(),
      /** False when no candidate exists; the UI must not open it. */
      exists: z.boolean(),
      canReveal: z.boolean(),
    }),
  },
  reveal: {
    input: z.object({ threadId: THREAD_ID, path: FILE_PATH, itemId: ITEM_ID.optional() }).strict(),
    output: z.object({ revealed: z.boolean() }),
  },
});

export type ResolvedFile = z.infer<(typeof rpcContract)["resolve"]["output"]>;

interface ThreadContext {
  environmentId: string;
  hostId: string;
  root: string;
}

interface Resolved {
  absolutePath: string;
  hostId: string;
  environmentId: string;
  /** Workspace-relative path when the file sits inside the environment. */
  relativePath: string | null;
  exists: boolean;
}

interface CommandItem {
  command: string | null;
  cwd: string | null;
}

/** Command items seen in one thread's event log, filled incrementally. */
interface ItemIndex {
  items: Map<string, CommandItem>;
  lastSeq: string | undefined;
  refreshedAt: number;
  refreshing: Promise<void> | null;
}

export default async function plugin(bb: BbPluginApi) {
  const contexts = new Map<string, { value: ThreadContext; expiresAt: number }>();

  async function threadContext(threadId: string): Promise<ThreadContext> {
    const cached = contexts.get(threadId);
    if (cached && cached.expiresAt > Date.now()) return cached.value;
    const thread = await bb.sdk.threads.get({ threadId });
    if (!thread.environmentId) throw new Error("thread has no environment");
    const environment = await bb.sdk.environments.get({ environmentId: thread.environmentId });
    if (!environment.hostId || !environment.path) throw new Error("environment has no machine path");
    const value = {
      environmentId: environment.id,
      hostId: environment.hostId,
      root: path.posix.normalize(environment.path),
    };
    contexts.set(threadId, { value, expiresAt: Date.now() + CONTEXT_TTL_MS });
    return value;
  }

  async function primaryHostId(): Promise<string | null> {
    const config = await bb.sdk.system.config().catch(() => null);
    return config?.primaryHostId ?? null;
  }

  async function isLocalMac(hostId: string): Promise<boolean> {
    return process.platform === "darwin" && (await primaryHostId()) === hostId;
  }

  const itemIndexes = new Map<string, ItemIndex>();

  async function refreshItems(threadId: string, index: ItemIndex) {
    for (;;) {
      const page = await bb.sdk.threads.events.list({
        threadId,
        types: ["item/started"],
        order: "asc",
        limit: String(EVENTS_PAGE),
        ...(index.lastSeq ? { afterSeq: index.lastSeq } : {}),
      });
      for (const event of page) {
        const item = (event.data as { item?: { id?: unknown; command?: unknown; cwd?: unknown } }).item;
        if (item && typeof item.id === "string") {
          index.items.set(item.id, {
            command: typeof item.command === "string" ? item.command.slice(0, 8192) : null,
            cwd: typeof item.cwd === "string" ? item.cwd : null,
          });
        }
        index.lastSeq = String(event.seq);
      }
      if (page.length < EVENTS_PAGE) break;
    }
    index.refreshedAt = Date.now();
  }

  async function commandItem(threadId: string, itemId: string): Promise<CommandItem | null> {
    let index = itemIndexes.get(threadId);
    if (!index) {
      index = { items: new Map(), lastSeq: undefined, refreshedAt: 0, refreshing: null };
      itemIndexes.set(threadId, index);
      if (itemIndexes.size > MAX_THREAD_INDEXES) itemIndexes.delete(itemIndexes.keys().next().value!);
    }
    const known = index.items.get(itemId);
    if (known) return known;
    // Unknown item: read new events, at most once per refresh window.
    if (!index.refreshing && Date.now() - index.refreshedAt > ITEM_REFRESH_MS) {
      const current = index;
      current.refreshing = refreshItems(threadId, current)
        .catch((error: unknown) => bb.log.warn(`file-links: reading events for ${threadId} failed: ${String(error)}`))
        .finally(() => {
          current.refreshing = null;
        });
    }
    await index.refreshing;
    return index.items.get(itemId) ?? null;
  }

  async function fileExists(hostId: string, filePath: string, local: boolean): Promise<boolean> {
    if (local) {
      const info = await stat(filePath).catch(() => null);
      return info?.isFile() === true;
    }
    try {
      await bb.sdk.files.read({ hostId, path: filePath });
      return true;
    } catch {
      return false;
    }
  }

  const resolutions = new Map<string, { value: Promise<Resolved>; expiresAt: number }>();

  // Paths come from page DOM, so treat them as untrusted: no NUL bytes, no
  // URLs, and always normalize before use.
  function resolvePath(threadId: string, rawPath: string, itemId?: string): Promise<Resolved> {
    const key = `${threadId}\n${itemId ?? ""}\n${rawPath}`;
    const cached = resolutions.get(key);
    if (cached && cached.expiresAt > Date.now()) return cached.value;
    const value = resolveUncached(threadId, rawPath, itemId);
    resolutions.set(key, { value, expiresAt: Date.now() + RESOLUTION_TTL_MS });
    if (resolutions.size > MAX_RESOLUTIONS) resolutions.delete(resolutions.keys().next().value!);
    value.catch(() => resolutions.delete(key));
    return value;
  }

  async function resolveUncached(threadId: string, rawPath: string, itemId?: string): Promise<Resolved> {
    const trimmed = rawPath.trim();
    if (trimmed.includes("\0") || /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed)) {
      throw new Error("unsupported path");
    }
    const context = await threadContext(threadId);
    const local = (await primaryHostId()) === context.hostId;

    const bases: string[] = [];
    if (!path.posix.isAbsolute(trimmed)) {
      const item = itemId ? await commandItem(threadId, itemId) : null;
      if (item?.cwd && path.posix.isAbsolute(item.cwd)) {
        const home = local ? os.homedir() : null;
        const cdDir = item.command ? effectiveCommandDir(item.command, item.cwd, home) : null;
        if (cdDir) bases.push(cdDir);
        bases.push(path.posix.normalize(item.cwd));
      }
      bases.push(context.root);
    }
    const candidates = path.posix.isAbsolute(trimmed)
      ? [path.posix.normalize(trimmed)]
      : [...new Set(bases.map((base) => path.posix.join(base, trimmed)))];

    let absolutePath = candidates[0];
    let exists = false;
    for (const candidate of candidates) {
      if (await fileExists(context.hostId, candidate, local)) {
        absolutePath = candidate;
        exists = true;
        break;
      }
    }

    const relative = path.posix.relative(context.root, absolutePath);
    const inside = relative !== "" && !relative.startsWith("..") && !path.posix.isAbsolute(relative);
    return {
      absolutePath,
      hostId: context.hostId,
      environmentId: context.environmentId,
      relativePath: inside ? relative : null,
      exists,
    };
  }

  function imageType(filePath: string): string | null {
    return IMAGE_TYPES[path.posix.extname(filePath).toLowerCase()] ?? null;
  }

  bb.rpc.register(rpcContract, {
    async resolve({ threadId, path: rawPath, itemId }) {
      const resolved = await resolvePath(threadId, rawPath, itemId);
      return {
        absolutePath: resolved.absolutePath,
        target: resolved.relativePath
          ? { kind: "workspace" as const, environmentId: resolved.environmentId, path: resolved.relativePath }
          : { kind: "host" as const, hostId: resolved.hostId, path: resolved.absolutePath },
        isImage: imageType(resolved.absolutePath) !== null,
        exists: resolved.exists,
        canReveal: resolved.exists && (await isLocalMac(resolved.hostId)),
      };
    },
    async reveal({ threadId, path: rawPath, itemId }) {
      const resolved = await resolvePath(threadId, rawPath, itemId);
      if (!resolved.exists || !(await isLocalMac(resolved.hostId))) return { revealed: false };
      // execFile passes the path as one argv entry; no shell is involved.
      const revealed = await new Promise<boolean>((resolve) => {
        execFile("/usr/bin/open", ["-R", "--", resolved.absolutePath], (error) => resolve(!error));
      });
      return { revealed };
    },
  });

  // GET /api/v1/plugins/file-links/http/image?threadId=...&path=...[&itemId=...]
  // Default "local" auth: only the BB app (or a local client) can call it.
  bb.http.route("GET", "/image", async (c) => {
    const threadId = THREAD_ID.safeParse(c.req.query("threadId"));
    const rawPath = FILE_PATH.safeParse(c.req.query("path"));
    const rawItemId = c.req.query("itemId");
    const itemId = rawItemId === undefined ? undefined : ITEM_ID.safeParse(rawItemId);
    if (!threadId.success || !rawPath.success || (itemId && !itemId.success)) return c.text("bad request", 400);
    let resolved: Resolved;
    try {
      resolved = await resolvePath(threadId.data, rawPath.data, itemId?.data);
    } catch {
      return c.text("not found", 404);
    }
    const mimeType = imageType(resolved.absolutePath);
    if (!mimeType) return c.text("not an image", 415);
    if (!resolved.exists) return c.text("not found", 404);
    let file;
    try {
      file = await bb.sdk.files.read({ hostId: resolved.hostId, path: resolved.absolutePath });
    } catch {
      return c.text("not found", 404);
    }
    if (file.sizeBytes > MAX_IMAGE_BYTES) return c.text("too large", 413);
    const bytes =
      file.contentEncoding === "base64"
        ? Buffer.from(file.content, "base64")
        : Buffer.from(file.content, "utf8");
    return new Response(bytes, {
      headers: {
        "content-type": mimeType,
        "cache-control": "private, max-age=60",
        "x-content-type-options": "nosniff",
        // SVGs render through <img>, which never runs scripts; this also
        // blocks scripts if someone opens the URL directly.
        "content-security-policy": "default-src 'none'; style-src 'unsafe-inline'; sandbox",
      },
    });
  });
}
