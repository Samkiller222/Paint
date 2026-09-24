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
- `stroke` `{id, tool:'pen'|'eraser', b:brush, c:colour, s:size, o:opacity, p:[x,y,pressure,...]}`
  where `p` is a flat array of already-smoothed points in canvas pixels. `b` is a
  brush id from `BRUSHES` (or `ERASERS` for eraser strokes); a missing `b` means `pen`.
- `fill` `{id, x, y, c, o, g}`: flood fill from pixel `x,y` with tolerance `g` (0-255)

Not actions (never recorded):
- The trace image and its position (`S.trace`)
- Layer names and the hide-from-timelapse flag (`S.meta[id] = {name, priv}`).
  `priv` is retroactive: a private layer is skipped for the whole video.
- View zoom, rotation and pan (`view` DOMMatrix)

**Undo** pops the last action to `S.redo` and calls `rebuild()`. Undone strokes never
appear in the timelapse. `S.base` protects the initial "Layer 1" add from undo.
A snapshot of all layers is kept every 100 actions (`SNAP_EVERY`) so rebuilds don't
always start from zero.

**Rendering.** `paint()` dispatches on the stroke's brush:
- `pen`: `drawSegs`, pressure-varying round line segments.
- `marker`: `drawSegs` with a constant width.
- `pencil`: round segments stroked with a grain pattern. The grain is a fixed seeded
  noise field thresholded to fully opaque or clear pixels, so overlapping segments
  never darken. Pressure picks one of 8 density levels.
- `ink`: a flat nib at 45 degrees swept between points (filled quads, outlined so
  there are no seams).
- `air`: soft radial dots stamped at fixed arc-length spacing along the stroke
  (`cumLen`, cached in a WeakMap). Pressure sets each stamp's alpha.

Rule for any new brush: segment `i` may only depend on points up to `i` and fixed
data, never on how the stroke was split up. Live drawing paints in chunks, rebuilds
paint in one go, and the timelapse uses different chunks again; all three must give
the same pixels.

`renderStroke` is shared by live drawing, rebuilds and the timelapse, so they match.
Pen strokes with opacity below 1 go through a temp canvas so overlaps don't darken.
Eraser strokes draw straight onto the layer with `destination-out`.

**Fill** (`floodFill`) looks only at the target layer's own pixels, never the trace
image or other layers, so it replays the same in the timelapse. Colours are compared
premultiplied, and the region grows by 1 px to tuck under anti-aliased edges.
It runs on pointerup and is cancelled if the pointer moves or a second finger lands.

**Eyedropper** (`picker` tool) samples the visible layers on white, not the trace
image. It isn't recorded, and it switches back to the previous tool on release.

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
- Fill and eyedropper follow the same rule: fingers only use them if "Draw with
  finger too" is on.
- In trace mode (`prefs.tool === 'trace'`), every pointer moves, scales or rotates the
  trace image instead of drawing.

**Timelapse export.** Replays actions into a separate world, advancing a budget of
points per frame so the video lasts the chosen length. It records the canvas with
`captureStream` and `MediaRecorder`, preferring MP4 and falling back to WebM, which
is what Android Chrome usually gives. A fill appears at once and uses a small fixed
share of the video time. Private layers and their clears and fills are skipped,
and the trace image is never drawn. Output is capped at 1920 px on the longest side.

**PNG export** composites visible, non-private layers on white.

**Saving.**
- The project autosaves to IndexedDB (database `nonphoto`, store `kv`, key
  `project`), debounced 900 ms. The trace image is stored as a Blob.
- Brush and UI prefs go in localStorage (`nonphoto-prefs`): tool, pen brush
  (`brush`), eraser brush (`eBrush`), colour, size, opacity, smoothing, fill
  tolerance (`tol`), the last 6 colours (`recent`), finger drawing, view lock.
- Files are saved through Claude's `downloads` capability when running as a
  claude.ai artifact, and through a normal `<a download>` everywhere else.

## Known limits and ideas

- Five drawing brushes and two erasers. No custom brushes or brush settings beyond
  size and opacity.
- Fill has no gap closing beyond the 1 px grow, so a gap in a line lets it leak.
- `rebuild()` gets slow with thousands of strokes. More snapshots or per-layer
  caching would help.
- Only one project at a time. "New canvas" replaces it (the trace image is kept).
- No selection, layer opacity, or layer thumbnails yet.
- Exporting a timelapse runs in real time, so a 20 second video takes about
  20 seconds.

## Shortcuts

`b` pen, `e` eraser, `g` fill, `i` eyedropper, `[` `]` brush size, Ctrl/Cmd+Z undo,
Shift+Ctrl/Cmd+Z or Ctrl/Cmd+Y redo. Tapping the active pen, eraser or fill tool
opens the Brushes dialog.

## Conventions

- Plain JS, no frameworks. Keep all colours as CSS tokens on `:root`, with dark mode
  under `prefers-color-scheme` and `[data-theme]`.
- Don't use `prompt()`, `confirm()` or `alert()`. They're blocked when the page runs
  as a claude.ai artifact. Use the `ask()` dialog helper instead.
- Test on a touch device with a stylus when changing input handling.
