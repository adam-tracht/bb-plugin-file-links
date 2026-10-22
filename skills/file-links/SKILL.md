---
name: file-links
description: How the file-links BB plugin decorates timeline file rows (clickable names, copy/reveal menu, image thumbnails) and which BB DOM hooks it depends on. Use when file rows stop being clickable, thumbnails go missing or duplicate, or after a BB upgrade changes the timeline.
---

# file-links

Source: `bb-plugin-file-links/` in the bb-plugins repo. Full detail in its
README.

- Content script in `app.tsx` scans `[data-timeline-row-id]` rows. A row's own
  `span[title]` headline ("Read file <path>", "Viewed image: <path>") must end
  in a span whose text is the basename; that span becomes the link.
- Opening files goes through an invisible thread header action that listens
  for the `bb-file-links:navigate` window event. No bridge, no preview.
- Thumbnails load from `/api/v1/plugins/file-links/http/image`, which only
  serves image extensions under 20 MB.
- Check after changes: `bb plugin build . && bb plugin reload file-links`,
  then open a thread with image reads, expand "Worked for" and the
  "Explored N files" groups, and confirm one thumbnail per image row.
