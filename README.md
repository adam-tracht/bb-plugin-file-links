# File Links (`file-links`)

Makes file rows in the BB thread timeline useful. Targets rows like
"Read file X.png", "Read src/foo.ts", and "Viewed image: X.png", skill reads
("Read bb-plugin-authoring/SKILL.md" in Codex, "Loaded skill aside-browser"
in Claude Code), and the folder or file in search and list rows ("Searched
for X in src/lib", "Listed files in ~/.bb").

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
  order: each folder the command `cd`s into (every top-level `cd` in the
  chain, in order), the command's
  recorded cwd, then the thread's environment folder. The first one where the
  file exists wins. Absolute paths are used as-is.
- **Missing files** show muted (struck through, not clickable). The menu
  offers only Copy full path, labeled "(not found)". The preview never opens
  for a missing file.
- **Skill rows open the SKILL.md that was actually read.**
  - Codex shows a shortened path ("bb-orchestration/SKILL.md") while the row
    title keeps the full path, so the link uses that full path.
  - Claude Code's Skill call records only the skill name. The plugin reads
    the producing Claude session's transcript
    (`~/.claude/projects/*/<session>.jsonl`, or under `CLAUDE_CONFIG_DIR`)
    and takes the "Base directory for this skill" line that answered that
    call, matching the Nth call for a name to the Nth transcript call. It
    never guesses from the name alone; if the transcript is gone or the
    thread runs on another machine, the row stays plain text.
  - BB's global skills folder (`~/.bb/runtime/global-skills/<hash>/`)
    changes hash over time. When the recorded copy is gone, the same file
    under the newest other hash is used. Bundled plugin skills that Claude
    Code read from a temp folder show as missing once that folder is deleted.
- **Folder names in search and list rows** are links too. Click opens the
  folder in Finder; the menu offers Open folder, Copy full path, Reveal in
  Finder. If the target is a file, it behaves like any file link. The query
  text is never touched. Targets with glob characters (`*.md`, `qbo*`) stay
  plain. When the query itself contains " in ", each possible split is
  checked and the first one that exists wins. Folders only open when the
  thread runs on this Mac; on a remote machine a folder cannot be checked
  for existence, so it is assumed to exist.
- **Image links in chat messages** (`[chart.png](/abs/chart.png)`, which BB
  renders as a `file://` link) get one thumbnail at the end of the link's
  paragraph or list item; click it for the same lightbox. Relative links
  resolve against the thread's environment folder. Missing files get no
  thumbnail. Markdown images (`![alt](x.png)`, which BB already renders with
  its own lightbox), http(s) links, and the composer are left alone. This
  replaces the Dwite image-preview plugin, which pointed `<img src>` at the
  link's `file://` href and showed a broken image.

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
    image flag, `exists`, `isDirectory`, whether Finder reveal is possible)
    and RPC `reveal` (`open -R`, no shell). `resolve` takes an optional
    `kind`: `file` (default), `path` (a file or folder from a search or list
    row), or `skill` (a Claude Code "Loaded skill" row; `path` is the skill
    name). `reveal` takes the same `kind` plus `open: true` to open a folder
    instead of revealing it. Results are cached per row for 30 seconds.
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
  every top-level `cd`/`pushd` joined by `&&`, `||`, or `;`, including ones
  after other commands (`git log; cd ../x; grep ...`). Each distinct folder is
  a candidate. A `cd` inside parentheses or on either side of a pipe is
  skipped. Claude Code rows record an empty cwd, so their `cd` steps start
  from the environment folder. It handles quotes, `~`,
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
  and whose last child span's text equals the path's basename or its
  trailing segments. That last span
  becomes the link.
- Skill rows: Codex uses the file headline with a shortened path (the last
  span is the path's trailing segments, not just the basename). Claude Code
  uses a `span[title="Loaded skill <name>"]` whose last span is the name; the
  row id is `<threadId>:tool:<itemId>` and the item is a `toolCall` with
  `tool: "Skill"`.
- Search and list rows: `span[title]` is "Searched <rest>" or "Listed
  <rest>" with two child spans, the last holding the rest ("for Q in P",
  "matching Q in P", "in P", "files in P"). The plugin splits that text node
  and wraps only the target in a `span[data-bb-file-links-target]`, which
  is unwrapped on cleanup.
- Chat messages: markdown renders in `[data-markdown-preview]` inside a
  timeline row; local links are `a[href^="file:"]` (scheme-less hrefs are
  accepted too). The thumbnail is a `span[data-bb-file-links-message-thumb]`
  appended to the anchor's closest `p`, `li`, `td`, or heading, and is
  dropped when React replaces the anchor.
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
