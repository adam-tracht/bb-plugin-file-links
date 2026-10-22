// bb-plugin-file-links: backend entry.
//
// The frontend content script finds file paths in timeline tool rows
// ("Read file <path>", "Viewed image: <path>") but has no thread or
// environment context. This backend turns (threadId, path) into an absolute
// path on the thread's machine, serves image bytes for thumbnails, and
// reveals files in Finder when the machine is this Mac.
import { execFile } from "node:child_process";
import path from "node:path";
import { defineRpcContract, type BbPluginApi } from "@get-bb/plugin-sdk";
import { z } from "zod";

const THREAD_ID = z.string().regex(/^thr_[A-Za-z0-9_]{1,120}$/);
const FILE_PATH = z.string().min(1).max(4096);

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

const targetSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("workspace"), environmentId: z.string(), path: z.string() }),
  z.object({ kind: z.literal("host"), hostId: z.string(), path: z.string() }),
]);

export const rpcContract = defineRpcContract({
  resolve: {
    input: z.object({ threadId: THREAD_ID, path: FILE_PATH }).strict(),
    output: z.object({
      absolutePath: z.string(),
      target: targetSchema,
      isImage: z.boolean(),
      canReveal: z.boolean(),
    }),
  },
  reveal: {
    input: z.object({ threadId: THREAD_ID, path: FILE_PATH }).strict(),
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

  // Paths come from page DOM, so treat them as untrusted: no NUL bytes, no
  // URLs, and always normalize before use.
  async function resolvePath(threadId: string, rawPath: string): Promise<Resolved> {
    const trimmed = rawPath.trim();
    if (trimmed.includes("\0") || /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed)) {
      throw new Error("unsupported path");
    }
    const context = await threadContext(threadId);
    const absolutePath = path.posix.isAbsolute(trimmed)
      ? path.posix.normalize(trimmed)
      : path.posix.join(context.root, trimmed);
    const relative = path.posix.relative(context.root, absolutePath);
    const inside = relative !== "" && !relative.startsWith("..") && !path.posix.isAbsolute(relative);
    return {
      absolutePath,
      hostId: context.hostId,
      environmentId: context.environmentId,
      relativePath: inside ? relative : null,
    };
  }

  async function isLocalMac(hostId: string): Promise<boolean> {
    if (process.platform !== "darwin") return false;
    const config = await bb.sdk.system.config().catch(() => null);
    return config?.primaryHostId === hostId;
  }

  function imageType(filePath: string): string | null {
    return IMAGE_TYPES[path.posix.extname(filePath).toLowerCase()] ?? null;
  }

  bb.rpc.register(rpcContract, {
    async resolve({ threadId, path: rawPath }) {
      const resolved = await resolvePath(threadId, rawPath);
      return {
        absolutePath: resolved.absolutePath,
        target: resolved.relativePath
          ? { kind: "workspace" as const, environmentId: resolved.environmentId, path: resolved.relativePath }
          : { kind: "host" as const, hostId: resolved.hostId, path: resolved.absolutePath },
        isImage: imageType(resolved.absolutePath) !== null,
        canReveal: await isLocalMac(resolved.hostId),
      };
    },
    async reveal({ threadId, path: rawPath }) {
      const resolved = await resolvePath(threadId, rawPath);
      if (!(await isLocalMac(resolved.hostId))) return { revealed: false };
      // execFile passes the path as one argv entry; no shell is involved.
      const revealed = await new Promise<boolean>((resolve) => {
        execFile("/usr/bin/open", ["-R", "--", resolved.absolutePath], (error) => resolve(!error));
      });
      return { revealed };
    },
  });

  // GET /api/v1/plugins/file-links/http/image?threadId=...&path=...
  // Default "local" auth: only the BB app (or a local client) can call it.
  bb.http.route("GET", "/image", async (c) => {
    const threadId = THREAD_ID.safeParse(c.req.query("threadId"));
    const rawPath = FILE_PATH.safeParse(c.req.query("path"));
    if (!threadId.success || !rawPath.success) return c.text("bad request", 400);
    let resolved: Resolved;
    try {
      resolved = await resolvePath(threadId.data, rawPath.data);
    } catch {
      return c.text("not found", 404);
    }
    const mimeType = imageType(resolved.absolutePath);
    if (!mimeType) return c.text("not an image", 415);
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
