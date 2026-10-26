---
name: file-links
description: How the file-links BB plugin decorates timeline file rows (clickable names, copy/reveal menu, image thumbnails) and which BB DOM hooks it depends on. Use when file rows stop being clickable, thumbnails go missing or duplicate, or after a BB upgrade changes the timeline.
---

# file-links

Source: https://github.com/adam-tracht/bb-plugin-file-links (local clone:
`~/Documents/GitHub/bb-plugin-file-links`). Full detail in its README.

- Content script in `app.tsx` scans `[data-timeline-row-id]` rows. A row's own
  `span[title]` headline ("Read file <path>", "Viewed image: <path>") must end
  in a span whose text is the basename; that span becomes the link.
- Opening files goes through an invisible thread header action that listens
  for the `bb-file-links:navigate` window event. No bridge, no preview.
- Relative paths resolve against the folder the command ran in: every top-level `cd`
  step (parsed in `shell-cwd.ts`), then the item cwd, then the environment
  folder; first existing file wins. The item comes from the row id
  (`<threadId>:command:<itemId>`) and the thread's `item/started` events.
  Missing files render muted and only offer Copy full path. If a link opens
  the wrong file, curl RPC `resolve` with `{threadId, itemId, path}` and check
  `bb plugin logs file-links`.
- Skill rows: Codex "Read <dir>/SKILL.md" links from the full path in the
  title; Claude Code "Loaded skill <name>" resolves from the session
  transcript's "Base directory for this skill" line (`claude-skills.ts`,
  matched by call order, local machine only). Rotated
  `~/.bb/runtime/global-skills/<hash>` copies fall back to the newest hash.
  Debug with RPC `resolve` `{threadId, itemId, path: <name>, kind: "skill"}`.
- Search and list rows ("Searched for Q in P", "Listed files in P") wrap only
  the target P in `span[data-bb-file-links-target]`; globs stay plain.
  Folders resolve with `kind: "path"` and open through RPC `reveal` with
  `open: true`. Relative paths try every top-level `cd` in the command.
- Chat messages: image links (`a[href^="file:"]` inside
  `[data-markdown-preview]`) get one `span[data-bb-file-links-message-thumb]`
  at the end of their paragraph or list item, only when RPC `resolve` says the
  file exists. Markdown `<img>`, http(s) links, and the composer are skipped.
  Check on thr_2uwkdftncd (recap PNG link).
- Thumbnails load from `/api/v1/plugins/file-links/http/image`, which only
  serves image extensions under 20 MB.
- Check after changes: `bb plugin build . && bb plugin reload file-links`,
  then open a thread with image reads, expand "Worked for" and the
  "Explored N files" groups, and confirm one thumbnail per image row.
