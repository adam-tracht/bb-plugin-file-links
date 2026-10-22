# File Links (`file-links`)

Makes file rows in the BB thread timeline useful. Targets rows like
"Read file X.png", "Read src/foo.ts", and "Viewed image: X.png".

- **Click the file name** to open it in BB's side-panel preview.
  Cmd/Ctrl-click opens it in the default app. Enter or Space works when the
  name has focus.
- **Right-click the file name** for a menu: Open preview, View image (images
  only), Open in default app, Copy full path, Reveal in Finder (only when the
  thread's machine is this Mac).
- **Image rows** (png, jpg, jpeg, gif, webp, svg, bmp) get a small thumbnail
  under the row. Click it for a lightbox; Escape or a backdrop click closes
  it. Styles match the Dwite image-preview plugin.
- **Relative paths resolve where the command actually ran.** Candidates, in
  order: the folder after the command's leading `cd` steps, the command's
  recorded cwd, then the thread's environment folder. The first one where the
  file exists wins. Absolute paths are used as-is.
- **Missing files** show muted (struck through, not clickable). The menu
  offers only Copy full path, labeled "(not found)". The preview never opens
  for a missing file.
- Images inside chat messages are left alone (image-preview handles those).

## How it works

- `app.tsx` registers a content script. A MutationObserver rescans timeline
  rows (batched per animation frame), marks file names as links, and appends
  thumbnails. Disabling the plugin disconnects the observer and removes every
  attribute, node, and style it added.
- BB's file-open functions only work inside a thread surface, so the app also
  registers an invisible thread header action ("navigation bridge"). The
  content script sends a `bb-file-links:navigate` window event; the bridge for
  the matching thread opens the file. If no bridge answers, images fall back
  to the lightbox and other files show a toast.
- `server.ts` provides:
  - RPC `resolve` (thread + item id + path to absolute path, preview target,
    image flag, `exists`, whether Finder reveal is possible) and RPC `reveal`
    (`open -R`, no shell). Results are cached per row for 30 seconds.
  - `GET /api/v1/plugins/file-links/http/image?threadId=&itemId=&path=` for
    thumbnail bytes (404 when the file is missing). Local auth only. Paths are untrusted: NUL bytes and URLs are
    rejected, paths are normalized, only image extensions are served (415
    otherwise), and files over 20 MB get 413. Responses carry `nosniff` and a
    sandbox CSP.

## Path resolution

- The item id comes from the row id (see below). `server.ts` reads the
  thread's `item/started` events through `bb.sdk.threads.events.list` (pages
  of 100, the API maximum) and keeps each item's `command` and `cwd`. Unknown
  items trigger a refresh at most every 2 seconds.
- `shell-cwd.ts` works out the effective folder: it unwraps
  `/bin/zsh -lc '...'` style wrappers (sh, bash, zsh, dash, ksh), then follows
  leading `cd`/`pushd` segments joined by `&&` or `;`. It handles quotes, `~`,
  `$HOME`, and relative `cd`. It stops at anything it cannot know: other
  variables, globs, `cd -`, or a `cd` that is piped or backgrounded.
- Existence: `stat` when the thread runs on this Mac, otherwise a
  `bb.sdk.files.read` probe.

## DOM hooks (fragile; recheck after BB upgrades)

- Row root: `[data-timeline-row-id="<threadId>:..."]`. The thread id is the
  part before the first colon (falls back to the URL). Shell reads look like
  `<threadId>:command:<itemId>`, Claude Code reads like
  `<threadId>:file-read:<itemId>`; the third part is the item id.
- Group rows ("Explored N files") are rows that contain nested rows; only a
  row's own headline is decorated, so groups never get a thumbnail.
- Headline: a `span[title]` whose title matches
  `Read file|Reading file|Viewed image:|Viewing image:|Read|Reading <path>`,
  and whose last child span's text equals the path's basename. That last span
  becomes the link.
- Thumbnails only show for settled rows (`Read file`, `Read`,
  `Viewed image:`), not in-progress ones.
- Requires the `experimental_threadHeaderAction` slot and
  `useBbNavigate().experimental_openFilePreview` /
  `experimental_openFileExternally` from the SDK (0.6.49, BB 0.46).

## Develop

```
npm install
bb plugin build .
bb plugin reload file-links
```

`dist/` is committed, like the other plugins with frontends.
