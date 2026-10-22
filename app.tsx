// bb-plugin-file-links: frontend entry.
//
// BB's core timeline rows ("Read file foo.png", "Viewed image: foo.png") show
// only a basename and cannot be replaced by plugin renderer slots. This
// plugin decorates them in place:
//
// - A content script (plain DOM, no React root) finds those rows, makes the
//   file name a link, adds a right-click menu, and appends a thumbnail with a
//   lightbox for image files.
// - A thread header action (renders nothing) is the bridge to host
//   navigation. The content script has no React context, so it asks the
//   bridge over a window event to open BB's file preview or the default
//   external app. The bridge must live inside a thread surface: the host
//   grants file-open only there (an app overlay always gets false). A split
//   layout mounts one bridge per pane; each answers only for its thread.
//
// DOM contract relied on (verified against BB 0.46.1):
// - Each timeline row root carries `data-timeline-row-id="<threadId>:..."`.
//   File rows look like "<threadId>:command:<itemId>" (shell reads) or
//   "<threadId>:file-read:<itemId>"; the item id lets the backend find the
//   producing command's cwd and leading `cd`.
// - Its headline is a `span[title]` whose title is the row's plain text, for
//   example "Read file /abs/path.png" or "Viewed image: rel/path.png", and
//   whose last child span shows the basename.
// Everything this file adds is tagged `data-bb-file-links-*` and removed when
// the content script aborts (disable, reload, window teardown).
import { useEffect } from "react";
import { toast } from "sonner";
import {
  definePluginApp,
  experimental_copyToClipboard,
  useBbNavigate,
  type ExperimentalLiveFileTarget,
} from "@get-bb/plugin-sdk/app";
import type { ResolvedFile } from "./server";

const NAVIGATE_EVENT = "bb-file-links:navigate";
const STYLE_ID = "bb-file-links-styles";
const LINK_ATTR = "data-bb-file-links-link";
const THUMB_ATTR = "data-bb-file-links-thumb";
const OWNED_ATTR = "data-bb-file-links-owned";
const MISSING_ATTR = "data-bb-file-links-missing";

const ROW_SELECTOR = "[data-timeline-row-id]";
// Longest prefixes first so "Read file x" is not parsed as "Read" + "file x".
const HEADLINE_PATTERN =
  /^(Read file|Reading file|Viewed image:|Viewing image:|Read|Reading)\s+(.+)$/;
const ROW_ITEM_PATTERN = /^thr_[A-Za-z0-9_]+:[a-z-]+:([A-Za-z0-9_-]{1,120})(?::|$)/;
const SETTLED_PREFIXES = new Set(["Read file", "Read", "Viewed image:"]);
const IMAGE_PATTERN = /\.(?:png|jpe?g|gif|webp|svg|bmp)$/i;

interface NavigateDetail {
  action: "preview" | "external";
  threadId: string;
  target: ExperimentalLiveFileTarget;
  accepted: boolean;
}

interface LinkInfo {
  threadId: string;
  /** Timeline item that produced the row, when the row id carries one. */
  itemId: string | null;
  path: string;
  isImage: boolean;
}

const styles = `
  [${LINK_ATTR}] {
    cursor: pointer;
    text-decoration-line: underline;
    text-decoration-style: dotted;
    text-decoration-color: color-mix(in srgb, currentColor 45%, transparent);
    text-underline-offset: 2px;
  }
  [${LINK_ATTR}]:hover,
  [${LINK_ATTR}]:focus-visible {
    text-decoration-style: solid;
    text-decoration-color: currentColor;
    outline: none;
  }
  [${LINK_ATTR}][${MISSING_ATTR}],
  [${LINK_ATTR}][${MISSING_ATTR}]:hover {
    cursor: default;
    text-decoration-line: line-through;
    text-decoration-style: solid;
    text-decoration-color: color-mix(in srgb, currentColor 35%, transparent);
    opacity: 0.6;
  }
  .bb-file-links-thumb-wrap {
    display: block;
    padding: 0.25rem 0 0.375rem 1.25rem;
  }
  .bb-file-links-thumb {
    display: block;
    height: 6rem;
    width: auto;
    max-width: min(100%, 14rem);
    object-fit: contain;
    padding: 0;
    cursor: zoom-in;
    background: var(--muted, Canvas);
    border: 1px solid var(--border, transparent);
    border-radius: var(--radius-lg, 0.75rem);
    box-shadow: 0 0.125rem 0.5rem color-mix(in srgb, var(--foreground, CanvasText) 12%, transparent);
    transition: transform 140ms ease, box-shadow 140ms ease;
  }
  .bb-file-links-thumb:hover,
  .bb-file-links-thumb:focus-visible {
    transform: translateY(-1px);
    box-shadow: 0 0.375rem 1rem color-mix(in srgb, var(--foreground, CanvasText) 18%, transparent);
    outline: 2px solid var(--ring, currentColor);
    outline-offset: 2px;
  }
  .bb-file-links-menu {
    position: fixed;
    z-index: 2147483000;
    min-width: 12rem;
    padding: 0.25rem;
    color: var(--popover-foreground, var(--foreground, CanvasText));
    background: var(--popover, var(--card, Canvas));
    border: 1px solid var(--border, transparent);
    border-radius: var(--radius-md, 0.5rem);
    box-shadow: 0 0.5rem 1.5rem color-mix(in srgb, var(--foreground, CanvasText) 18%, transparent);
    font-size: 0.8125rem;
    color-scheme: light dark;
  }
  .bb-file-links-menu-item {
    display: block;
    width: 100%;
    padding: 0.375rem 0.5rem;
    color: inherit;
    background: transparent;
    border: 0;
    border-radius: calc(var(--radius-md, 0.5rem) - 2px);
    font: inherit;
    text-align: left;
    cursor: pointer;
  }
  .bb-file-links-menu-item:hover,
  .bb-file-links-menu-item:focus-visible {
    background: var(--accent, var(--muted, Canvas));
    color: var(--accent-foreground, inherit);
    outline: none;
  }
  .bb-file-links-menu-path {
    padding: 0.25rem 0.5rem 0.375rem;
    color: var(--muted-foreground, currentColor);
    font-size: 0.75rem;
    overflow-wrap: anywhere;
    border-bottom: 1px solid var(--border, transparent);
    margin-bottom: 0.25rem;
  }
  #bb-file-links-lightbox {
    position: fixed;
    inset: 0;
    z-index: 2147483000;
    display: grid;
    place-items: center;
    padding: clamp(1rem, 4vw, 3rem);
    color: var(--foreground, CanvasText);
    background: color-mix(in srgb, var(--background, Canvas) 92%, transparent);
    backdrop-filter: blur(0.375rem);
    color-scheme: light dark;
  }
  .bb-file-links-dialog {
    position: relative;
    display: grid;
    justify-items: center;
    gap: 0.75rem;
    max-width: min(96vw, 80rem);
    max-height: 100%;
  }
  .bb-file-links-expanded {
    display: block;
    max-width: min(92vw, 76rem);
    max-height: calc(100vh - 8rem);
    width: auto;
    height: auto;
    object-fit: contain;
    background: var(--muted, Canvas);
    border-radius: var(--radius-lg, 0.75rem);
    box-shadow: 0 1rem 3rem color-mix(in srgb, var(--foreground, CanvasText) 30%, transparent);
  }
  .bb-file-links-caption {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    max-width: min(92vw, 76rem);
    color: var(--muted-foreground, currentColor);
    font-size: 0.8125rem;
    text-align: center;
    overflow-wrap: anywhere;
  }
  .bb-file-links-button {
    padding: 0.25rem 0.625rem;
    color: var(--foreground, CanvasText);
    background: var(--card, Canvas);
    border: 1px solid var(--border, transparent);
    border-radius: 999px;
    font: inherit;
    cursor: pointer;
  }
  .bb-file-links-button:hover,
  .bb-file-links-button:focus-visible {
    background: var(--accent, var(--card, Canvas));
    outline: 2px solid var(--ring, currentColor);
    outline-offset: 2px;
  }
  .bb-file-links-close {
    position: fixed;
    top: 0.75rem;
    right: 0.75rem;
    display: grid;
    place-items: center;
    width: 2.75rem;
    height: 2.75rem;
    padding: 0;
    color: var(--foreground, CanvasText);
    background: var(--card, Canvas);
    border: 1px solid var(--border, transparent);
    border-radius: 999px;
    box-shadow: 0 0.25rem 1rem color-mix(in srgb, var(--foreground, CanvasText) 20%, transparent);
    font: inherit;
    font-size: 1.5rem;
    line-height: 1;
    cursor: pointer;
  }
  .bb-file-links-close:hover,
  .bb-file-links-close:focus-visible {
    background: var(--accent, var(--card, Canvas));
    outline: 2px solid var(--ring, currentColor);
    outline-offset: 2px;
  }
  @media (prefers-reduced-motion: reduce) {
    .bb-file-links-thumb { transition: none; }
  }
`;

function basename(filePath: string): string {
  const trimmed = filePath.replace(/\/+$/, "");
  return trimmed.slice(trimmed.lastIndexOf("/") + 1);
}

function itemIdForRow(row: Element): string | null {
  return ROW_ITEM_PATTERN.exec(row.getAttribute("data-timeline-row-id") ?? "")?.[1] ?? null;
}

function threadIdForRow(row: Element): string | null {
  const fromRow = row.getAttribute("data-timeline-row-id")?.split(":")[0] ?? "";
  if (/^thr_[A-Za-z0-9_]+$/.test(fromRow)) return fromRow;
  const fromUrl = window.location.pathname.match(/\/threads\/(thr_[A-Za-z0-9_]+)/);
  return fromUrl ? fromUrl[1] : null;
}

/** Parse a headline span into a file reference, or null for other rows. */
function parseHeadline(headline: HTMLElement): { prefix: string; path: string; name: HTMLElement } | null {
  const match = HEADLINE_PATTERN.exec(headline.title.trim());
  if (!match) return null;
  const [, prefix, filePath] = match;
  const name = headline.lastElementChild;
  if (!(name instanceof HTMLElement)) return null;
  // The visible name must be the path's basename. This rejects rows such as
  // "Read 3 files" whose title happens to share a prefix.
  if (name.textContent?.trim() !== basename(filePath)) return null;
  return { prefix, path: filePath, name };
}

function ownedElement<K extends keyof HTMLElementTagNameMap>(tag: K, className?: string) {
  const element = document.createElement(tag);
  element.setAttribute(OWNED_ATTR, "true");
  if (className) element.className = className;
  return element;
}

function mountFileLinks(pluginId: string, signal: AbortSignal) {
  const links = new WeakMap<HTMLElement, LinkInfo>();
  const resolutions = new Map<string, Promise<ResolvedFile | null>>();
  const listen = { signal } as const;

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = styles;
  document.head.appendChild(style);

  function imageUrl(info: LinkInfo): string {
    const query = new URLSearchParams({ threadId: info.threadId, path: info.path });
    if (info.itemId) query.set("itemId", info.itemId);
    return `/api/v1/plugins/${encodeURIComponent(pluginId)}/http/image?${query}`;
  }

  async function rpc<T>(method: string, input: unknown): Promise<T | null> {
    try {
      const response = await fetch(`/api/v1/plugins/${encodeURIComponent(pluginId)}/rpc/${method}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(input),
        signal,
      });
      const payload = (await response.json()) as { ok: boolean; result?: T };
      return payload.ok ? (payload.result ?? null) : null;
    } catch {
      return null;
    }
  }

  function lookupInput(info: LinkInfo) {
    return { threadId: info.threadId, path: info.path, ...(info.itemId ? { itemId: info.itemId } : {}) };
  }

  // One lookup per row (thread + item + path), so virtualized rows that
  // remount while scrolling reuse it.
  function resolve(info: LinkInfo): Promise<ResolvedFile | null> {
    const key = `${info.threadId}\n${info.itemId ?? ""}\n${info.path}`;
    let pending = resolutions.get(key);
    if (!pending) {
      pending = rpc<ResolvedFile>("resolve", lookupInput(info));
      resolutions.set(key, pending);
      // Failed lookups are retried on the next interaction.
      void pending.then((result) => {
        if (!result) resolutions.delete(key);
      });
    }
    return pending;
  }

  function navigate(
    action: NavigateDetail["action"],
    threadId: string,
    target: ExperimentalLiveFileTarget,
  ): boolean {
    const detail: NavigateDetail = { action, threadId, target, accepted: false };
    window.dispatchEvent(new CustomEvent(NAVIGATE_EVENT, { detail }));
    return detail.accepted;
  }

  async function openPreview(info: LinkInfo) {
    const resolved = await resolve(info);
    if (signal.aborted) return;
    if (!resolved) {
      toast.error(`Could not locate ${basename(info.path)}`);
      return;
    }
    if (!resolved.exists) {
      toast.error("File not found", { description: resolved.absolutePath });
      return;
    }
    if (navigate("preview", info.threadId, resolved.target)) return;
    if (info.isImage) {
      openLightbox(info);
      return;
    }
    toast.error("BB could not open a preview here");
  }

  async function openExternally(info: LinkInfo) {
    const resolved = await resolve(info);
    if (signal.aborted) return;
    if (resolved && !resolved.exists) {
      toast.error("File not found", { description: resolved.absolutePath });
      return;
    }
    if (!resolved || !navigate("external", info.threadId, resolved.target)) {
      toast.error(`Could not open ${basename(info.path)}`);
    }
  }

  async function copyPath(info: LinkInfo) {
    const resolved = await resolve(info);
    if (signal.aborted) return;
    const text = resolved?.absolutePath ?? info.path;
    const copied = await experimental_copyToClipboard({ text });
    if (copied) toast.success("Copied path", { description: text });
    else toast.error("Could not copy the path");
  }

  async function reveal(info: LinkInfo) {
    const result = await rpc<{ revealed: boolean }>("reveal", lookupInput(info));
    if (!signal.aborted && !result?.revealed) toast.error("Could not reveal the file in Finder");
  }

  // Context menu --------------------------------------------------------

  let menu: HTMLElement | null = null;
  let menuAbort: AbortController | null = null;

  function closeMenu() {
    menuAbort?.abort();
    menuAbort = null;
    menu?.remove();
    menu = null;
  }

  async function openMenu(info: LinkInfo, x: number, y: number) {
    closeMenu();
    const root = ownedElement("div", "bb-file-links-menu");
    root.setAttribute("role", "menu");
    const pathLine = ownedElement("div", "bb-file-links-menu-path");
    pathLine.textContent = info.path;
    root.appendChild(pathLine);

    // Everything except Copy waits for the lookup and needs an existing file.
    const exists = (r: ResolvedFile | null) => r?.exists === true;
    const items: Array<{ label: string; run: () => void; when?: (r: ResolvedFile | null) => boolean }> = [
      { label: "Open preview", run: () => void openPreview(info), when: exists },
      { label: "Open in default app", run: () => void openExternally(info), when: exists },
      { label: "Copy full path", run: () => void copyPath(info) },
      { label: "Reveal in Finder", run: () => void reveal(info), when: (r) => r?.canReveal === true },
    ];
    if (info.isImage) items.splice(1, 0, { label: "View image", run: () => openLightbox(info), when: exists });

    const buttons: HTMLButtonElement[] = [];
    const revealButtons = new Map<HTMLButtonElement, (r: ResolvedFile | null) => boolean>();
    for (const item of items) {
      const button = ownedElement("button", "bb-file-links-menu-item");
      button.type = "button";
      button.setAttribute("role", "menuitem");
      button.textContent = item.label;
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        closeMenu();
        item.run();
      });
      if (item.when) {
        button.hidden = true;
        revealButtons.set(button, item.when);
      }
      buttons.push(button);
      root.appendChild(button);
    }

    document.body.appendChild(root);
    menu = root;
    const rect = root.getBoundingClientRect();
    root.style.left = `${Math.max(4, Math.min(x, window.innerWidth - rect.width - 4))}px`;
    root.style.top = `${Math.max(4, Math.min(y, window.innerHeight - rect.height - 4))}px`;
    buttons.find((button) => !button.hidden)?.focus();

    menuAbort = new AbortController();
    const menuSignal = AbortSignal.any([signal, menuAbort.signal]);
    document.addEventListener(
      "pointerdown",
      (event) => {
        if (!root.contains(event.target as Node)) closeMenu();
      },
      { capture: true, signal: menuSignal },
    );
    document.addEventListener(
      "keydown",
      (event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          event.stopPropagation();
          closeMenu();
          return;
        }
        if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
        event.preventDefault();
        const visible = buttons.filter((button) => !button.hidden);
        const index = visible.indexOf(document.activeElement as HTMLButtonElement);
        const step = event.key === "ArrowDown" ? 1 : -1;
        visible[(index + step + visible.length) % visible.length]?.focus();
      },
      { capture: true, signal: menuSignal },
    );
    window.addEventListener("blur", closeMenu, { signal: menuSignal });
    window.addEventListener("resize", closeMenu, { signal: menuSignal });
    document.addEventListener("scroll", closeMenu, { capture: true, signal: menuSignal });

    const resolved = await resolve(info);
    if (menu !== root) return;
    pathLine.textContent = resolved?.absolutePath ?? info.path;
    if (resolved && !resolved.exists) pathLine.textContent += " (not found)";
    for (const [button, when] of revealButtons) button.hidden = !when(resolved);
    buttons.find((button) => !button.hidden)?.focus();
  }

  // Lightbox ------------------------------------------------------------

  let lightbox: HTMLElement | null = null;
  let lightboxAbort: AbortController | null = null;
  let lightboxReturnFocus: HTMLElement | null = null;

  function closeLightbox() {
    lightboxAbort?.abort();
    lightboxAbort = null;
    lightbox?.remove();
    lightbox = null;
    if (lightboxReturnFocus?.isConnected) lightboxReturnFocus.focus();
    lightboxReturnFocus = null;
  }

  function openLightbox(info: LinkInfo) {
    closeLightbox();
    closeMenu();
    lightboxReturnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const root = ownedElement("div");
    root.id = "bb-file-links-lightbox";
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-modal", "true");
    root.setAttribute("aria-label", `Image preview: ${basename(info.path)}`);

    const close = ownedElement("button", "bb-file-links-close");
    close.type = "button";
    close.setAttribute("aria-label", "Close image preview");
    close.textContent = "×";

    const dialog = ownedElement("div", "bb-file-links-dialog");
    const image = ownedElement("img", "bb-file-links-expanded");
    image.src = imageUrl(info);
    image.alt = basename(info.path);

    const caption = ownedElement("div", "bb-file-links-caption");
    const pathText = ownedElement("span");
    pathText.textContent = info.path;
    const previewButton = ownedElement("button", "bb-file-links-button");
    previewButton.type = "button";
    previewButton.textContent = "Open preview";
    const copyButton = ownedElement("button", "bb-file-links-button");
    copyButton.type = "button";
    copyButton.textContent = "Copy path";
    caption.append(pathText, previewButton, copyButton);

    dialog.append(image, caption);
    root.append(close, dialog);
    document.body.appendChild(root);
    lightbox = root;
    close.focus();

    void resolve(info).then((resolved) => {
      if (lightbox === root && resolved) pathText.textContent = resolved.absolutePath;
    });

    lightboxAbort = new AbortController();
    const boxSignal = AbortSignal.any([signal, lightboxAbort.signal]);
    close.addEventListener("click", closeLightbox, { signal: boxSignal });
    previewButton.addEventListener(
      "click",
      () => {
        closeLightbox();
        void openPreview({ ...info, isImage: false });
      },
      { signal: boxSignal },
    );
    copyButton.addEventListener("click", () => void copyPath(info), { signal: boxSignal });
    root.addEventListener(
      "click",
      (event) => {
        if (event.target === root || event.target === dialog) closeLightbox();
      },
      { signal: boxSignal },
    );
    document.addEventListener(
      "keydown",
      (event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          event.stopPropagation();
          closeLightbox();
        } else if (event.key === "Tab") {
          // Keep focus inside the dialog.
          const focusable = [close, previewButton, copyButton];
          const index = focusable.indexOf(document.activeElement as HTMLButtonElement);
          event.preventDefault();
          const step = event.shiftKey ? -1 : 1;
          focusable[(index + step + focusable.length) % focusable.length].focus();
        }
      },
      { capture: true, signal: boxSignal },
    );
  }

  // Row decoration ------------------------------------------------------

  function decorateRow(row: HTMLElement) {
    const threadId = threadIdForRow(row);
    let thumbFor: LinkInfo | null = null;
    if (threadId) {
      for (const headline of row.querySelectorAll<HTMLElement>("span[title]")) {
        // Group rows ("Explored N files") contain nested rows; each nested
        // row decorates its own headline, so skip headlines owned by them.
        if (headline.closest(ROW_SELECTOR) !== row) continue;
        const parsed = parseHeadline(headline);
        if (!parsed) continue;
        const info: LinkInfo = {
          threadId,
          itemId: itemIdForRow(row),
          path: parsed.path,
          isImage: IMAGE_PATTERN.test(parsed.path),
        };
        const existing = links.get(parsed.name);
        if (
          !existing ||
          existing.path !== info.path ||
          existing.threadId !== threadId ||
          existing.itemId !== info.itemId
        ) {
          const name = parsed.name;
          links.set(name, info);
          name.setAttribute(LINK_ATTR, "true");
          name.setAttribute("role", "link");
          name.setAttribute("tabindex", "0");
          name.removeAttribute(MISSING_ATTR);
          name.removeAttribute("aria-disabled");
          // Mute names whose file is gone; the menu still offers Copy path.
          void resolve(info).then((resolved) => {
            if (signal.aborted || links.get(name) !== info || !resolved || resolved.exists) return;
            name.setAttribute(MISSING_ATTR, "true");
            name.setAttribute("aria-disabled", "true");
          });
        }
        if (info.isImage && SETTLED_PREFIXES.has(parsed.prefix)) thumbFor = info;
        break;
      }
    }

    const current = row.querySelector<HTMLElement>(`:scope > [${THUMB_ATTR}]`);
    if (!thumbFor) {
      current?.remove();
      return;
    }
    const key = `${thumbFor.threadId}\n${thumbFor.path}`;
    if (current?.getAttribute(THUMB_ATTR) === key) return;
    current?.remove();

    const info = thumbFor;
    const wrap = ownedElement("div", "bb-file-links-thumb-wrap");
    wrap.setAttribute(THUMB_ATTR, key);
    const image = ownedElement("img", "bb-file-links-thumb");
    image.loading = "lazy";
    image.decoding = "async";
    image.alt = basename(info.path);
    image.title = info.path;
    image.tabIndex = 0;
    image.setAttribute("role", "button");
    image.setAttribute("aria-label", `View image: ${basename(info.path)}`);
    // A missing or unreadable file leaves no broken-image box behind.
    image.addEventListener("error", () => wrap.remove(), { once: true });
    image.src = imageUrl(info);
    links.set(image, info);
    wrap.appendChild(image);
    row.appendChild(wrap);
  }

  function scan() {
    for (const row of document.querySelectorAll<HTMLElement>(ROW_SELECTOR)) decorateRow(row);
  }

  let frame = 0;
  const observer = new MutationObserver(() => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      if (!signal.aborted) scan();
    });
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: ["title", "data-timeline-row-id"],
  });
  scan();

  // Delegated listeners: they cover rows React mounts later without
  // per-node bookkeeping.
  function linkFromEvent(event: Event): { element: HTMLElement; info: LinkInfo } | null {
    const element = (event.target as Element | null)?.closest?.<HTMLElement>(
      `[${LINK_ATTR}], img.bb-file-links-thumb`,
    );
    if (!element || !element.isConnected) return null;
    const info = links.get(element);
    return info ? { element, info } : null;
  }

  document.addEventListener(
    "click",
    (event) => {
      const hit = linkFromEvent(event);
      if (!hit || event.button !== 0) return;
      if (hit.element.hasAttribute(MISSING_ATTR)) return;
      event.preventDefault();
      event.stopPropagation();
      if (hit.element.tagName === "IMG") openLightbox(hit.info);
      else if (event.metaKey || event.ctrlKey) void openExternally(hit.info);
      else void openPreview(hit.info);
    },
    { capture: true, ...listen },
  );
  document.addEventListener(
    "keydown",
    (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      const hit = linkFromEvent(event);
      if (!hit || hit.element.hasAttribute(MISSING_ATTR)) return;
      event.preventDefault();
      event.stopPropagation();
      if (hit.element.tagName === "IMG") openLightbox(hit.info);
      else void openPreview(hit.info);
    },
    { capture: true, ...listen },
  );
  document.addEventListener(
    "contextmenu",
    (event) => {
      const hit = linkFromEvent(event);
      if (!hit) return;
      event.preventDefault();
      event.stopPropagation();
      void openMenu(hit.info, event.clientX, event.clientY);
    },
    { capture: true, ...listen },
  );

  return () => {
    observer.disconnect();
    if (frame) cancelAnimationFrame(frame);
    closeMenu();
    closeLightbox();
    for (const element of document.querySelectorAll(`[${LINK_ATTR}]`)) {
      element.removeAttribute(LINK_ATTR);
      element.removeAttribute(MISSING_ATTR);
      element.removeAttribute("aria-disabled");
      element.removeAttribute("role");
      element.removeAttribute("tabindex");
    }
    for (const element of document.querySelectorAll(`[${OWNED_ATTR}]`)) element.remove();
    style.remove();
  };
}

/** Renders nothing; forwards this thread's navigation intents to the host. */
function NavigationBridge({ threadId }: { threadId: string }) {
  const navigate = useBbNavigate();
  useEffect(() => {
    function onNavigate(event: Event) {
      const detail = (event as CustomEvent<NavigateDetail>).detail;
      if (!detail || typeof detail !== "object" || detail.accepted) return;
      if (detail.threadId !== threadId) return;
      const options = { target: detail.target, location: null };
      detail.accepted =
        detail.action === "external"
          ? navigate.experimental_openFileExternally(options)
          : navigate.experimental_openFilePreview(options);
    }
    window.addEventListener(NAVIGATE_EVENT, onNavigate);
    return () => window.removeEventListener(NAVIGATE_EVENT, onNavigate);
  }, [navigate, threadId]);
  return null;
}

export default definePluginApp((app) => {
  app.slots.experimental_threadHeaderAction({
    id: "navigation-bridge",
    title: "File links",
    component: NavigationBridge,
  });
  app.contentScripts.register({
    id: "file-links",
    mount({ pluginId, signal }) {
      // The host aborts `signal`, then calls the returned disposer once.
      return mountFileLinks(pluginId, signal);
    },
  });
});
