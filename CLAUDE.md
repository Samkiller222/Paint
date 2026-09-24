# Nonphoto

A browser-based drawing app for tracing. Its one job ibis Paint X can't do: show a
trace image while drawing, but leave it out of the timelapse video entirely.

Named after non-photo blue, the pencil colour for guide lines that don't reproduce.
Non-photo blue (`--blue`) is used in the UI for anything that is not recorded.

## Who uses it and how

- Built for a beginner artist practising line smoothing by tracing.
- Main device: Lenovo IdeaTab with a stylus, in Chrome on Android. The user rests
  their palm on the screen while drawing, so palm rejection matters.
- Hosted on GitHub Pages and added to the home screen.

## Files

- `index.html`: the whole app. HTML, CSS and JS in one file, no build step, no
  dependencies. Only external request is the Manrope font from Google Fonts.

Keep it a single self-contained file unless there's a strong reason not to.

## How it works

**Recording model.** Everything the user does is an action in `S.actions`. The canvas
is rebuilt by replaying actions, and the timelapse is the same replay, drawn
progressively into a video. Nothing is screen-recorded.

Action types:
- `add` `{id, at}`: create layer at index
- `del` `{id}`, `vis` `{id, v}`, `move` `{id, to}`, `clear` `{id}`
- `stroke` `{id, tool:'pen'|'eraser', c:colour, s:size, o:opacity, p:[x,y,pressure,...]}`
  where `p` is a flat array of already-smoothed points in canvas pixels

Not actions (never recorded):
- The trace image and its position (`S.trace`)
- Layer names and the hide-from-timelapse flag (`S.meta[id] = {name, priv}`).
  `priv` is retroactive: a private layer is skipped for the whole video.
- View zoom, rotation and pan (`view` DOMMatrix)

**Undo** pops the last action to `S.redo` and calls `rebuild()`. Undone strokes never
appear in the timelapse. `S.base` protects the initial "Layer 1" add from undo.
A snapshot of all layers is kept every 100 actions (`SNAP_EVERY`) so rebuilds don't
always start from zero.

**Rendering.** `drawSegs` draws pressure-varying round line segments.
`renderStroke` is shared by live drawing, rebuilds and the timelapse, so they match.
Pen strokes with opacity below 1 go through a temp canvas so overlaps don't darken.
Eraser strokes draw straight onto the layer with `destination-out`.

**Live drawing.** Pen strokes draw onto `liveTemp`, a canvas inserted in the DOM just
above the active layer, then get committed to the layer on pointerup.
Smoothing is an exponential moving average, set by `prefs.smooth`. On pointerup it
catches up to the final raw point.

**Input rules.**
- Pen and mouse draw. Fingers only draw if "Draw with finger too" is on.
- Two fingers zoom, rotate and pan (`pairDelta`), unless view lock is on.
- Palm rejection: touch gestures are ignored while a pen stroke is active, or within
  350 ms of the pen last being seen, including hover.
- A finger stroke is cancelled if a second finger lands within 250 ms, so a gesture
  can start.
- In trace mode (`prefs.tool === 'trace'`), every pointer moves, scales or rotates the
  trace image instead of drawing.

**Timelapse export.** Replays actions into a separate world, advancing a budget of
points per frame so the video lasts the chosen length. It records the canvas with
`captureStream` and `MediaRecorder`, preferring MP4 and falling back to WebM, which
is what Android Chrome usually gives. Private layers and their clears are skipped,
and the trace image is never drawn. Output is capped at 1920 px on the longest side.

**PNG export** composites visible, non-private layers on white.

**Saving.**
- The project autosaves to IndexedDB (database `nonphoto`, store `kv`, key
  `project`), debounced 900 ms. The trace image is stored as a Blob.
- Brush and UI prefs go in localStorage (`nonphoto-prefs`).
- Files are saved through Claude's `downloads` capability when running as a
  claude.ai artifact, and through a normal `<a download>` everywhere else.

## Known limits and ideas

- Brushes are basic round pens. No textures, no brush library.
- `rebuild()` gets slow with thousands of strokes. More snapshots or per-layer
  caching would help.
- Only one project at a time. "New canvas" replaces it (the trace image is kept).
- No colour history, fill tool, selection, or layer thumbnails yet.
- Exporting a timelapse runs in real time, so a 20 second video takes about
  20 seconds.

## Conventions

- Plain JS, no frameworks. Keep all colours as CSS tokens on `:root`, with dark mode
  under `prefers-color-scheme` and `[data-theme]`.
- Don't use `prompt()`, `confirm()` or `alert()`. They're blocked when the page runs
  as a claude.ai artifact. Use the `ask()` dialog helper instead.
- Test on a touch device with a stylus when changing input handling.
