(() => {
'use strict';
const $ = s => document.querySelector(s);

/* ---------- icons ---------- */
const P = {
  menu:'M4 7h16M4 12h16M4 17h16',
  undo:'M9 14L4 9l5-5M4 9h10a6 6 0 010 12h-3',
  redo:'M15 14l5-5-5-5M20 9H10a6 6 0 000 12h3',
  pen:'M4 20l4.5-1L19 8.5a2.1 2.1 0 00-3-3L5.5 16 4 20zM14.5 7l3 3',
  eraser:'M9 20h11M5.2 15.8l9.6-9.6a2 2 0 012.8 0l2.2 2.2a2 2 0 010 2.8L12 19H8.4l-3.2-3.2z',
  move:'M12 3v18M3 12h18M12 3L9.5 5.5M12 3l2.5 2.5M12 21l-2.5-2.5M12 21l2.5-2.5M3 12l2.5-2.5M3 12l2.5 2.5M21 12l-2.5-2.5M21 12l-2.5 2.5',
  lock:'M6 11h12v9H6zM8 11V8a4 4 0 018 0v3',
  unlock:'M6 11h12v9H6zM8 11V8a4 4 0 017.6-1.7',
  fit:'M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5',
  layers:'M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5',
  eye:'M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12zM12 15a3 3 0 100-6 3 3 0 000 6z',
  eyeOff:'M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12zM12 15a3 3 0 100-6 3 3 0 000 6zM3 3l18 18',
  video:'M3 7h12v10H3zM15 10.5L21 7v10l-6-3.5',
  videoOff:'M3 7h12v10H3zM15 10.5L21 7v10l-6-3.5M2 3l20 18',
  plus:'M12 5v14M5 12h14',
  up:'M12 19V5M6 11l6-6 6 6',
  down:'M12 5v14M6 13l6 6 6-6',
  edit:'M4 20h4L19 9l-4-4L4 16v4z',
  clear:'M5 5l14 14M19 5L5 19',
  trash:'M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3',
  image:'M4 5h16v14H4zM4 16l5-5 4 4 2-2 5 5M15 9.5a1.5 1.5 0 100-.01',
  doc:'M6 3h9l4 4v14H6zM14 3v5h5',
  pencil:'M4 20l1-4L16 5l3 3L8 19l-4 1zM14 7l3 3M5 16l3 3',
  marker:'M9 19l-4-4 9-9 4 4-9 9zM5 15l-2 5 5-2M12 8l4 4',
  nib:'M12 3l5 8-5 10-5-10 5-8zM12 11v4',
  air:'M11.4 12a.6 .6 0 101.2 0a.6 .6 0 10-1.2 0M7.4 8.5a.6 .6 0 101.2 0a.6 .6 0 10-1.2 0M15.4 8.5a.6 .6 0 101.2 0a.6 .6 0 10-1.2 0M7.4 15.5a.6 .6 0 101.2 0a.6 .6 0 10-1.2 0M15.4 15.5a.6 .6 0 101.2 0a.6 .6 0 10-1.2 0M11.4 5a.6 .6 0 101.2 0a.6 .6 0 10-1.2 0M11.4 19a.6 .6 0 101.2 0a.6 .6 0 10-1.2 0M3.9 12a.6 .6 0 101.2 0a.6 .6 0 10-1.2 0M18.9 12a.6 .6 0 101.2 0a.6 .6 0 10-1.2 0',
  fill:'M5 11l7-7 7 7-7 7-7-7zM5 11h14M20 15.5s-2 2.4-2 3.5a2 2 0 004 0c0-1.1-2-3.5-2-3.5z',
  picker:'M15 4l5 5M17.5 6.5L7 17l-3 1 1-3L15.5 4.5M8 12h7',
  brushes:'M4 7h10M18 7h2M4 17h2M10 17h10M16 5v4M8 15v4'
};
const icon = (n, cls='ic') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="${P[n]}"/></svg>`;
const setIcon = (el, n) => { el.innerHTML = icon(n); };
setIcon($('#btnMenu'),'menu'); setIcon($('#btnUndo'),'undo'); setIcon($('#btnRedo'),'redo');
setIcon($('#btnFit'),'fit'); setIcon($('#btnLayers'),'layers');
setIcon(document.querySelector('[data-tool=pen]'),'pen');
setIcon(document.querySelector('[data-tool=eraser]'),'eraser');
setIcon(document.querySelector('[data-tool=trace]'),'move');
setIcon(document.querySelector('[data-tool=fill]'),'fill');
setIcon(document.querySelector('[data-tool=picker]'),'picker');
setIcon($('#btnBrushes'),'brushes');
$('#btnAddLayer').innerHTML = icon('plus') + 'Add layer';
setIcon($('#btnUp'),'up'); setIcon($('#btnDown'),'down'); setIcon($('#btnRename'),'edit');
setIcon($('#btnClear'),'clear'); setIcon($('#btnDelete'),'trash');
$('#miVideo').innerHTML = icon('video'); $('#miPng').innerHTML = icon('image'); $('#miNew').innerHTML = icon('doc');

/* ---------- elements ---------- */
const viewport = $('#viewport'), stage = $('#stage'), main = $('#main');
const traceEl = new Image(); traceEl.id = 'trace'; traceEl.alt = ''; traceEl.draggable = false;
const liveTemp = document.createElement('canvas'); liveTemp.className = 'layer';
const liveCtx = liveTemp.getContext('2d');
const cursorEl = document.createElement('div'); cursorEl.id = 'cursor'; viewport.append(cursorEl);

/* ---------- toast ---------- */
let toastT;
function toast(msg){ const t=$('#toast'); t.textContent=msg; t.classList.add('show'); clearTimeout(toastT); toastT=setTimeout(()=>t.classList.remove('show'), 2600); }

/* ---------- prefs ---------- */
const prefs = { tool:'pen', brush:'pen', eBrush:'pen', color:'#23272b', size:6, opacity:100, smooth:45, tol:20, recent:[], fingerDraw:false, lockView:false };
try { Object.assign(prefs, JSON.parse(localStorage.getItem('nonphoto-prefs') || '{}')); } catch(e){}
if (prefs.tool === 'trace' || prefs.tool === 'picker') prefs.tool = 'pen';
prefs.recent = Array.isArray(prefs.recent) ? prefs.recent.filter(c => /^#[0-9a-f]{6}$/i.test(c)).slice(0, 6) : [];
function savePrefs(){ try { localStorage.setItem('nonphoto-prefs', JSON.stringify(prefs)); } catch(e){} }

/* ---------- storage (IndexedDB) ---------- */
let dbp = null;
function openDB(){
  if (!dbp) dbp = new Promise((res, rej) => {
    const r = indexedDB.open('nonphoto', 1);
    r.onupgradeneeded = () => r.result.createObjectStore('kv');
    r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
  });
  return dbp;
}
async function kvGet(k){ const db = await openDB(); return new Promise((res, rej) => { const q = db.transaction('kv').objectStore('kv').get(k); q.onsuccess = () => res(q.result); q.onerror = () => rej(q.error); }); }
async function kvSet(k, v){ const db = await openDB(); return new Promise((res, rej) => { const tx = db.transaction('kv','readwrite'); tx.objectStore('kv').put(v, k); tx.oncomplete = res; tx.onerror = () => rej(tx.error); }); }

/* ---------- project state ---------- */
const SNAP_EVERY = 100;
let S = null;
let view = new DOMMatrix(), viewInv = new DOMMatrix();

function newState(w, h){
  return { w, h, actions:[], redo:[], meta:{}, nextId:1, activeId:null, base:0, world:null, snap:null,
    trace:{ blob:null, url:null, m:new DOMMatrix(), opacity:45, visible:true, onTop:false, iw:0, ih:0 } };
}
const mkCanvas = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
const r1 = v => Math.round(v * 10) / 10;
const r2 = v => Math.round(v * 100) / 100;
const findL = (world, id) => world.layers.findIndex(l => l.id === id);
const activeLayer = () => { const i = findL(S.world, S.activeId); return i >= 0 ? S.world.layers[i] : null; };
const isPriv = id => !!(S.meta[id] && S.meta[id].priv);

/* ---------- stroke rendering (shared by live, rebuild and timelapse) ---------- */
// Every brush must draw segment i from points i-1 and i alone (plus data derived
// deterministically from earlier points), so drawing a stroke in chunks while live
// gives exactly the same pixels as drawing it in one go during a rebuild.
const BRUSHES = [
  { id:'pen', name:'Pen', desc:'Smooth ink. Pressure sets width.', icon:'pen' },
  { id:'pencil', name:'Pencil', desc:'Grainy. Pressure sets darkness.', icon:'pencil' },
  { id:'marker', name:'Marker', desc:'Even width. Ignores pressure.', icon:'marker' },
  { id:'ink', name:'Calligraphy', desc:'Angled nib, thick and thin by direction.', icon:'nib' },
  { id:'air', name:'Airbrush', desc:'Soft spray. Pressure sets flow.', icon:'air' }
];
const ERASERS = [
  { id:'pen', name:'Hard eraser', desc:'Clean edges.', icon:'eraser' },
  { id:'air', name:'Soft eraser', desc:'Fades out gently.', icon:'air' }
];
const brushOf = (list, id) => list.find(b => b.id === id) || list[0];

const widthOf = (s, p) => Math.max(0.5, s.s * (0.15 + 0.85 * p));
const markerWidth = s => s.s;
const pencilWidth = (s, p) => Math.max(0.5, s.s * (0.5 + 0.5 * p));
function drawSegs(ctx, s, from, to, style, wf = widthOf){
  const p = s.p, n = p.length / 3;
  ctx.strokeStyle = style; ctx.fillStyle = style; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (n === 1){
    if (from === 0){ ctx.beginPath(); ctx.arc(p[0], p[1], wf(s, p[2]) / 2, 0, Math.PI * 2); ctx.fill(); }
    return;
  }
  for (let i = Math.max(1, from); i < to; i++){
    const j = i * 3, k = j - 3;
    ctx.lineWidth = wf(s, (p[k + 2] + p[j + 2]) / 2);
    ctx.beginPath(); ctx.moveTo(p[k], p[k + 1]); ctx.lineTo(p[j], p[j + 1]); ctx.stroke();
  }
}

function rgbOf(hex){
  let h = hex.slice(1); if (h.length === 3) h = h.replace(/./g, c => c + c);
  const v = parseInt(h, 16) || 0; return [v >> 16 & 255, v >> 8 & 255, v & 255];
}
function mulberry32(a){ return () => { a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const texCache = new Map();
function cachedTex(key, make){
  let v = texCache.get(key);
  if (!v){ if (texCache.size > 48) texCache.clear(); v = make(); texCache.set(key, v); }
  return v;
}

// Pencil: a fixed grain field, thresholded to fully opaque or fully clear pixels.
// Overlapping segments then never darken each other, and more pressure just
// switches on more grains.
const GRAIN = 128;
let grainField = null;
function grainTex(color, lv){
  return cachedTex(`g${color}${lv}`, () => {
    if (!grainField){
      const rnd = mulberry32(20240917), B = GRAIN / 4, coarse = new Float32Array(B * B);
      for (let i = 0; i < coarse.length; i++) coarse[i] = rnd();
      grainField = new Float32Array(GRAIN * GRAIN);
      for (let y = 0; y < GRAIN; y++) for (let x = 0; x < GRAIN; x++)
        grainField[y * GRAIN + x] = 0.6 * rnd() + 0.4 * coarse[(y >> 2) * B + (x >> 2)];
    }
    const c = mkCanvas(GRAIN, GRAIN), x = c.getContext('2d'), img = x.createImageData(GRAIN, GRAIN), d = img.data;
    const [r, g, b] = rgbOf(color), density = 0.22 + 0.1 * lv;
    for (let i = 0; i < grainField.length; i++) if (grainField[i] < density){ const j = i * 4; d[j] = r; d[j + 1] = g; d[j + 2] = b; d[j + 3] = 255; }
    x.putImageData(img, 0, 0);
    return c;
  });
}
function drawPencil(ctx, s, from, to, color){
  const p = s.p, n = p.length / 3;
  const lvOf = pr => Math.max(0, Math.min(7, Math.round(pr * 7)));
  const pat = lv => ctx.createPattern(grainTex(color, lv), 'repeat');
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (n === 1){
    if (from === 0){ ctx.fillStyle = pat(lvOf(p[2])); ctx.beginPath(); ctx.arc(p[0], p[1], pencilWidth(s, p[2]) / 2, 0, Math.PI * 2); ctx.fill(); }
    return;
  }
  let last = -1;
  for (let i = Math.max(1, from); i < to; i++){
    const j = i * 3, k = j - 3, pr = (p[k + 2] + p[j + 2]) / 2, lv = lvOf(pr);
    if (lv !== last){ ctx.strokeStyle = pat(lv); last = lv; }
    ctx.lineWidth = pencilWidth(s, pr);
    ctx.beginPath(); ctx.moveTo(p[k], p[k + 1]); ctx.lineTo(p[j], p[j + 1]); ctx.stroke();
  }
}

// Calligraphy: a flat nib held at 45 degrees, swept between points.
function drawInk(ctx, s, from, to, color){
  const p = s.p, n = p.length / 3, cx = Math.SQRT1_2, cy = -Math.SQRT1_2;
  const half = i => Math.max(0.5, s.s * (0.3 + 0.7 * p[i * 3 + 2])) / 2;
  ctx.fillStyle = color; ctx.strokeStyle = color; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.lineWidth = Math.max(1, s.s * 0.1);
  if (n === 1){
    if (from === 0){ const h = half(0); ctx.beginPath(); ctx.moveTo(p[0] - cx * h, p[1] - cy * h); ctx.lineTo(p[0] + cx * h, p[1] + cy * h); ctx.stroke(); }
    return;
  }
  for (let i = Math.max(1, from); i < to; i++){
    const j = i * 3, k = j - 3, ha = half(i - 1), hb = half(i);
    ctx.beginPath();
    ctx.moveTo(p[k] + cx * ha, p[k + 1] + cy * ha); ctx.lineTo(p[k] - cx * ha, p[k + 1] - cy * ha);
    ctx.lineTo(p[j] - cx * hb, p[j + 1] - cy * hb); ctx.lineTo(p[j] + cx * hb, p[j + 1] + cy * hb);
    ctx.closePath(); ctx.fill(); ctx.stroke();
  }
}

// Airbrush: soft dots stamped at fixed distances along the whole stroke, so where
// a stamp lands never depends on how the stroke was split into chunks.
const lenCache = new WeakMap();
function cumLen(s, n){
  let L = lenCache.get(s);
  if (!L){ L = [0]; lenCache.set(s, L); }
  const p = s.p;
  for (let i = L.length; i < n; i++){ const j = i * 3; L.push(L[i - 1] + Math.hypot(p[j] - p[j - 3], p[j + 1] - p[j - 2])); }
  return L;
}
function softDot(color){
  return cachedTex(`a${color}`, () => {
    const N = 128, c = mkCanvas(N, N), x = c.getContext('2d'), [r, g, b] = rgbOf(color);
    const gr = x.createRadialGradient(N / 2, N / 2, 0, N / 2, N / 2, N / 2);
    gr.addColorStop(0, `rgba(${r},${g},${b},1)`); gr.addColorStop(0.45, `rgba(${r},${g},${b},0.55)`); gr.addColorStop(1, `rgba(${r},${g},${b},0)`);
    x.fillStyle = gr; x.fillRect(0, 0, N, N);
    return c;
  });
}
function drawAir(ctx, s, from, to, color){
  const p = s.p, n = p.length / 3, r = s.s / 2, dot = softDot(color);
  const stamp = (x, y, pr) => { ctx.globalAlpha = 0.04 + 0.16 * pr; ctx.drawImage(dot, x - r, y - r, r * 2, r * 2); };
  ctx.save();
  if (n === 1){ if (from === 0) stamp(p[0], p[1], p[2]); }
  else {
    const L = cumLen(s, to), sp = Math.max(0.5, s.s * 0.12);
    for (let i = Math.max(1, from); i < to; i++){
      const j = i * 3, k = j - 3, a = L[i - 1], b = L[i];
      for (let m = Math.ceil(a / sp); m * sp < b; m++){
        const t = (m * sp - a) / (b - a);
        stamp(p[k] + (p[j] - p[k]) * t, p[k + 1] + (p[j + 1] - p[k + 1]) * t, p[k + 2] + (p[j + 2] - p[k + 2]) * t);
      }
    }
  }
  ctx.restore();
}

function paint(ctx, s, from, to, color){
  switch (s.b){
    case 'pencil': drawPencil(ctx, s, from, to, color); break;
    case 'marker': drawSegs(ctx, s, from, to, color, markerWidth); break;
    case 'ink': drawInk(ctx, s, from, to, color); break;
    case 'air': drawAir(ctx, s, from, to, color); break;
    default: drawSegs(ctx, s, from, to, color);
  }
}

/* ---------- fill ---------- */
// Only the target layer's own pixels decide the region. Colours are compared
// premultiplied so transparent pixels all count as the same colour.
function floodFill(world, L, a){
  const w = world.w, h = world.h, x0 = a.x, y0 = a.y;
  if (x0 < 0 || y0 < 0 || x0 >= w || y0 >= h) return;
  const d = L.ctx.getImageData(0, 0, w, h).data;
  const j0 = (y0 * w + x0) * 4, A0 = d[j0 + 3], R0 = d[j0] * A0, G0 = d[j0 + 1] * A0, B0 = d[j0 + 2] * A0;
  const T = a.g, T2 = a.g * 255;
  const ok = i => { const j = i * 4, A = d[j + 3];
    return Math.abs(A - A0) <= T && Math.abs(d[j] * A - R0) <= T2 && Math.abs(d[j + 1] * A - G0) <= T2 && Math.abs(d[j + 2] * A - B0) <= T2; };
  const mask = new Uint8Array(w * h), stack = [x0, y0];
  while (stack.length){
    const y = stack.pop(), x = stack.pop(), row = y * w;
    if (mask[row + x] || !ok(row + x)) continue;
    let l = x, r = x;
    while (l > 0 && !mask[row + l - 1] && ok(row + l - 1)) l--;
    while (r < w - 1 && !mask[row + r + 1] && ok(row + r + 1)) r++;
    for (let xx = l; xx <= r; xx++) mask[row + xx] = 1;
    for (const ny of [y - 1, y + 1]){
      if (ny < 0 || ny >= h) continue;
      const nr = ny * w; let open = false;
      for (let xx = l; xx <= r; xx++){
        const can = !mask[nr + xx] && ok(nr + xx);
        if (can && !open) stack.push(xx, ny);
        open = can;
      }
    }
  }
  // Grow the region by a pixel so it tucks under anti-aliased line edges.
  const [cr, cg, cb] = rgbOf(a.c), img = new ImageData(w, h), o = img.data;
  for (let y = 0; y < h; y++){
    const row = y * w;
    for (let x = 0; x < w; x++){
      const i = row + x;
      if (mask[i] || (x > 0 && mask[i - 1]) || (x < w - 1 && mask[i + 1]) || (y > 0 && mask[i - w]) || (y < h - 1 && mask[i + w])){
        const j = i * 4; o[j] = cr; o[j + 1] = cg; o[j + 2] = cb; o[j + 3] = 255;
      }
    }
  }
  const tc = world.temp.getContext('2d');
  tc.putImageData(img, 0, 0);
  L.ctx.save(); L.ctx.globalAlpha = a.o; L.ctx.drawImage(world.temp, 0, 0); L.ctx.restore();
  tc.clearRect(0, 0, w, h);
}
function renderStroke(ctx, s, temp){
  const n = s.p.length / 3;
  if (s.tool === 'eraser'){
    ctx.save(); ctx.globalCompositeOperation = 'destination-out'; paint(ctx, s, 0, n, '#000'); ctx.restore(); return;
  }
  if (s.o >= 1){ paint(ctx, s, 0, n, s.c); return; }
  const tc = temp.getContext('2d');
  tc.clearRect(0, 0, temp.width, temp.height);
  paint(tc, s, 0, n, s.c);
  ctx.save(); ctx.globalAlpha = s.o; ctx.drawImage(temp, 0, 0); ctx.restore();
  tc.clearRect(0, 0, temp.width, temp.height);
}

/* ---------- actions ---------- */
function applyAction(world, a){
  const i = a.id != null ? findL(world, a.id) : -1;
  switch (a.t){
    case 'add': {
      const c = mkCanvas(world.w, world.h);
      world.layers.splice(Math.min(a.at, world.layers.length), 0, { id:a.id, canvas:c, ctx:c.getContext('2d'), visible:true });
      break;
    }
    case 'del': if (i >= 0) world.layers.splice(i, 1); break;
    case 'vis': if (i >= 0) world.layers[i].visible = a.v; break;
    case 'move': if (i >= 0){ const [L] = world.layers.splice(i, 1); world.layers.splice(Math.min(a.to, world.layers.length), 0, L); } break;
    case 'clear': if (i >= 0) world.layers[i].ctx.clearRect(0, 0, world.w, world.h); break;
    case 'stroke': if (i >= 0) renderStroke(world.layers[i].ctx, a, world.temp); break;
    case 'fill': if (i >= 0) floodFill(world, world.layers[i], a); break;
  }
}
const structural = a => a.t !== 'stroke' && a.t !== 'clear' && a.t !== 'fill';

function copyCanvas(c){ const d = mkCanvas(c.width, c.height); d.getContext('2d').drawImage(c, 0, 0); return d; }
function takeSnap(world, n){ S.snap = { n, layers: world.layers.map(l => ({ id:l.id, visible:l.visible, copy:copyCanvas(l.canvas) })) }; }

function rebuild(){
  const n = S.actions.length;
  const world = { w:S.w, h:S.h, layers:[], temp:liveTemp };
  let start = 0;
  if (S.snap && S.snap.n <= n){
    for (const l of S.snap.layers){ const c = copyCanvas(l.copy); world.layers.push({ id:l.id, canvas:c, ctx:c.getContext('2d'), visible:l.visible }); }
    start = S.snap.n;
  } else S.snap = null;
  const snapAt = Math.floor(n / SNAP_EVERY) * SNAP_EVERY;
  for (let i = start; i < n; i++){
    applyAction(world, S.actions[i]);
    if (!S.snap && i + 1 === snapAt) takeSnap(world, snapAt);
  }
  S.world = world;
  ensureActive();
  syncDOM(); renderPanel(); updateStatus();
}
function ensureActive(){
  if (findL(S.world, S.activeId) < 0){
    const ls = S.world.layers; S.activeId = ls.length ? ls[ls.length - 1].id : null;
  }
}
function pushAction(a, applied){
  if (!applied) applyAction(S.world, a);
  S.actions.push(a); S.redo.length = 0;
  if (S.actions.length % SNAP_EVERY === 0) takeSnap(S.world, S.actions.length);
  if (structural(a)){ ensureActive(); syncDOM(); renderPanel(); }
  updateStatus(); scheduleSave();
}
function undo(){
  if (cur || S.actions.length <= S.base) return;
  S.redo.push(S.actions.pop());
  rebuild(); scheduleSave();
}
function redo(){
  if (cur || !S.redo.length) return;
  const a = S.redo.pop();
  applyAction(S.world, a); S.actions.push(a);
  if (S.actions.length % SNAP_EVERY === 0) takeSnap(S.world, S.actions.length);
  if (structural(a)){ ensureActive(); syncDOM(); renderPanel(); }
  updateStatus(); scheduleSave();
}

/* ---------- DOM sync ---------- */
function syncDOM(){
  stage.style.width = S.w + 'px'; stage.style.height = S.h + 'px';
  stage.replaceChildren();
  if (!S.trace.onTop) stage.append(traceEl);
  for (const L of S.world.layers){
    L.canvas.className = 'layer';
    L.canvas.style.display = L.visible ? '' : 'none';
    stage.append(L.canvas);
    if (L.id === S.activeId) stage.append(liveTemp);
  }
  if (S.trace.onTop) stage.append(traceEl);
  applyTraceStyle();
}
function applyTraceStyle(){
  const t = S.trace;
  traceEl.style.display = (t.url && t.visible) ? '' : 'none';
  traceEl.style.opacity = t.opacity / 100;
  traceEl.style.width = t.iw + 'px'; traceEl.style.height = t.ih + 'px';
  traceEl.style.transform = t.m.toString();
  traceEl.classList.toggle('adjusting', prefs.tool === 'trace');
}
function updateStatus(){
  const n = S.actions.length - S.base;
  $('#recCount').textContent = n === 1 ? '1 step recorded' : `${n} steps recorded`;
  $('#btnUndo').disabled = S.actions.length <= S.base;
  $('#btnRedo').disabled = !S.redo.length;
}

/* ---------- layers panel ---------- */
function renderPanel(){
  const ul = $('#layerList'); ul.replaceChildren();
  const ls = S.world.layers;
  for (let i = ls.length - 1; i >= 0; i--){
    const L = ls[i], m = S.meta[L.id] || { name:'Layer', priv:false };
    const li = document.createElement('li');
    li.className = 'lrow' + (L.id === S.activeId ? ' active' : '') + (L.visible ? '' : ' hidden');
    const eye = document.createElement('button');
    eye.className = 'ib'; eye.innerHTML = icon(L.visible ? 'eye' : 'eyeOff');
    eye.setAttribute('aria-label', L.visible ? `Hide ${m.name}` : `Show ${m.name}`);
    eye.onclick = () => pushAction({ t:'vis', id:L.id, v:!L.visible });
    const name = document.createElement('button');
    name.className = 'name';
    const sp = document.createElement('span'); sp.textContent = m.name; name.append(sp);
    if (m.priv){ const sm = document.createElement('small'); sm.textContent = 'Hidden from timelapse'; name.append(sm); }
    name.onclick = () => { S.activeId = L.id; syncDOM(); renderPanel(); scheduleSave(); };
    const pv = document.createElement('button');
    pv.className = 'ib' + (m.priv ? ' on' : ''); pv.innerHTML = icon(m.priv ? 'videoOff' : 'video');
    pv.setAttribute('aria-pressed', String(m.priv));
    pv.setAttribute('aria-label', m.priv ? `Show ${m.name} in timelapse` : `Hide ${m.name} from timelapse`);
    pv.onclick = () => { m.priv = !m.priv; S.meta[L.id] = m; renderPanel(); scheduleSave();
      toast(m.priv ? `${m.name} won't appear in the timelapse` : `${m.name} will appear in the timelapse`); };
    li.append(eye, name, pv); ul.append(li);
  }
  const i = findL(S.world, S.activeId);
  $('#btnUp').disabled = i < 0 || i >= ls.length - 1;
  $('#btnDown').disabled = i <= 0;
  $('#btnDelete').disabled = ls.length <= 1;
  const t = S.trace;
  $('#btnImport').textContent = t.url ? 'Replace image' : 'Import image';
  $('#btnAdjust').disabled = !t.url; $('#btnTraceRemove').disabled = !t.url;
  $('#btnAdjust').classList.toggle('on', prefs.tool === 'trace');
  $('#traceOp').value = t.opacity; $('#traceOpOut').textContent = t.opacity;
  $('#traceShow').checked = t.visible; $('#traceTop').checked = t.onTop;
}

function addLayer(){
  const id = S.nextId++;
  S.meta[id] = { name:`Layer ${id}`, priv:false };
  const i = findL(S.world, S.activeId);
  S.activeId = id;
  pushAction({ t:'add', id, at: i + 1 });
}
$('#btnAddLayer').onclick = addLayer;
$('#btnUp').onclick = () => { const i = findL(S.world, S.activeId); if (i >= 0 && i < S.world.layers.length - 1) pushAction({ t:'move', id:S.activeId, to:i + 1 }); };
$('#btnDown').onclick = () => { const i = findL(S.world, S.activeId); if (i > 0) pushAction({ t:'move', id:S.activeId, to:i - 1 }); };
$('#btnRename').onclick = async () => {
  const m = S.meta[S.activeId]; if (!m) return;
  const v = await ask('Rename layer', '', 'Rename', m.name);
  if (v && v.trim()){ m.name = v.trim().slice(0, 40); renderPanel(); scheduleSave(); }
};
$('#btnClear').onclick = async () => {
  const m = S.meta[S.activeId]; if (!m) return;
  if (await ask(`Clear ${m.name}?`, 'The clearing shows in the timelapse unless this layer is hidden from it. You can undo it.', 'Clear layer')) pushAction({ t:'clear', id:S.activeId });
};
$('#btnDelete').onclick = async () => {
  const m = S.meta[S.activeId]; if (!m || S.world.layers.length <= 1) return;
  if (await ask(`Delete ${m.name}?`, 'You can undo this.', 'Delete layer')) pushAction({ t:'del', id:S.activeId });
};

/* ---------- dialogs ---------- */
function ask(title, text, okLabel, inputValue){
  return new Promise(res => {
    const d = $('#askDlg'); $('#askTitle').textContent = title; $('#askText').textContent = text;
    $('#askText').hidden = !text;
    const inp = $('#askInput'); inp.hidden = inputValue == null; if (inputValue != null) inp.value = inputValue;
    $('#askYes').textContent = okLabel;
    const done = v => { d.close(); $('#askYes').onclick = $('#askNo').onclick = null; res(v); };
    $('#askYes').onclick = () => done(inputValue != null ? inp.value : true);
    $('#askNo').onclick = () => done(inputValue != null ? null : false);
    d.onclose = () => res(inputValue != null ? null : false);
    d.showModal(); if (inputValue != null) inp.select();
  });
}
document.querySelectorAll('dialog [data-close]').forEach(b => b.onclick = () => b.closest('dialog').close());

/* ---------- view ---------- */
function setView(m){ view = m; viewInv = m.inverse(); stage.style.transform = m.toString(); }
function fitView(){
  const r = viewport.getBoundingClientRect(); const pad = 24;
  const s = Math.max(0.02, Math.min((r.width - pad * 2) / S.w, (r.height - pad * 2) / S.h));
  setView(new DOMMatrix().translate((r.width - S.w * s) / 2, (r.height - S.h * s) / 2).scale(s));
}
function toCanvas(e){ const r = viewport.getBoundingClientRect(); return viewInv.transformPoint(new DOMPoint(e.clientX - r.left, e.clientY - r.top)); }
function toViewport(e){ const r = viewport.getBoundingClientRect(); return { x:e.clientX - r.left, y:e.clientY - r.top }; }
function pairDelta(a1, a2, b1, b2){
  const ca = { x:(a1.x + a2.x) / 2, y:(a1.y + a2.y) / 2 }, cb = { x:(b1.x + b2.x) / 2, y:(b1.y + b2.y) / 2 };
  const da = Math.hypot(a2.x - a1.x, a2.y - a1.y) || 1, db = Math.hypot(b2.x - b1.x, b2.y - b1.y) || 1;
  const ang = (Math.atan2(b2.y - b1.y, b2.x - b1.x) - Math.atan2(a2.y - a1.y, a2.x - a1.x)) * 180 / Math.PI;
  return new DOMMatrix().translate(cb.x, cb.y).rotate(ang).scale(db / da).translate(-ca.x, -ca.y);
}

/* ---------- drawing input ---------- */
let cur = null;       // active stroke
let lastPen = -1e9;   // last time a pen was seen (palm rejection)
const vp = new Map(); // touch points for view gestures
let vStart = null;
const tp = new Map(); // pointers for trace adjusting
let tStart = null;
let pend = null;      // fill waiting for its pointerup
let picking = null;   // eyedropper pointer
const busy = () => !!(cur || pend || picking);

const pressureOf = e => e.pointerType === 'pen' ? (e.pressure > 0 ? e.pressure : 0.5) : 1;
const smoothK = () => 1 - (prefs.smooth / 100) * 0.9;

function startStroke(e){
  const L = activeLayer();
  if (!L) return;
  if (!L.visible){ toast('This layer is hidden. Show it to draw on it.'); return; }
  const p = toCanvas(e), pr = pressureOf(e);
  const s = { t:'stroke', id:L.id, tool:prefs.tool, b: prefs.tool === 'eraser' ? prefs.eBrush : prefs.brush, c:prefs.color, s:prefs.size, o: prefs.tool === 'eraser' ? 1 : prefs.opacity / 100, p:[r1(p.x), r1(p.y), r2(pr)] };
  cur = { pid:e.pointerId, type:e.pointerType, s, x:p.x, y:p.y, pr, rx:p.x, ry:p.y, rp:pr, drawn:1, t0:performance.now() };
  liveTemp.style.opacity = s.o;
}
function addPoint(x, y, pr){
  const k = smoothK();
  cur.x += (x - cur.x) * k; cur.y += (y - cur.y) * k; cur.pr += (pr - cur.pr) * Math.min(1, k * 1.6);
  const P = cur.s.p, n = P.length;
  const dx = cur.x - P[n - 3], dy = cur.y - P[n - 2];
  if (dx * dx + dy * dy < 0.25) return;
  P.push(r1(cur.x), r1(cur.y), r2(cur.pr));
}
function flushLive(){
  const s = cur.s, n = s.p.length / 3;
  if (n <= cur.drawn) return;
  if (s.tool === 'eraser'){
    const c = activeLayer().ctx; c.save(); c.globalCompositeOperation = 'destination-out'; paint(c, s, cur.drawn, n, '#000'); c.restore();
  } else paint(liveCtx, s, cur.drawn, n, s.c);
  cur.drawn = n;
}
function moveStroke(e){
  const evs = (e.getCoalescedEvents && e.getCoalescedEvents().length) ? e.getCoalescedEvents() : [e];
  for (const ev of evs){ const p = toCanvas(ev), pr = pressureOf(ev); cur.rx = p.x; cur.ry = p.y; cur.rp = pr; addPoint(p.x, p.y, pr); }
  flushLive();
}
function endStroke(){
  for (let i = 0; i < 40 && Math.hypot(cur.rx - cur.x, cur.ry - cur.y) > 0.5; i++) addPoint(cur.rx, cur.ry, cur.rp);
  flushLive();
  const s = cur.s, L = activeLayer(), n = s.p.length / 3;
  if (s.tool === 'pen'){
    if (n === 1) paint(liveCtx, s, 0, 1, s.c);
    L.ctx.save(); L.ctx.globalAlpha = s.o; L.ctx.drawImage(liveTemp, 0, 0); L.ctx.restore();
    liveCtx.clearRect(0, 0, S.w, S.h);
    addRecent(s.c);
  } else if (n === 1){
    L.ctx.save(); L.ctx.globalCompositeOperation = 'destination-out'; paint(L.ctx, s, 0, 1, '#000'); L.ctx.restore();
  }
  cur = null;
  pushAction(s, true);
}
function cancelStroke(){
  if (!cur) return;
  const wasEraser = cur.s.tool === 'eraser';
  cur = null; liveCtx.clearRect(0, 0, S.w, S.h);
  if (wasEraser) rebuild();
}

function doFill(f){
  const L = activeLayer();
  if (!L) return;
  if (!L.visible){ toast('This layer is hidden. Show it to fill on it.'); return; }
  const x = Math.floor(f.x), y = Math.floor(f.y);
  if (x < 0 || y < 0 || x >= S.w || y >= S.h) return;
  pushAction({ t:'fill', id:L.id, x, y, c:prefs.color, o:prefs.opacity / 100, g:Math.round(prefs.tol * 2.55) });
  addRecent(prefs.color);
}
const pickCtx = mkCanvas(1, 1).getContext('2d', { willReadFrequently:true });
function pickAt(e){
  const p = toCanvas(e), x = Math.floor(p.x), y = Math.floor(p.y);
  if (x < 0 || y < 0 || x >= S.w || y >= S.h) return;
  pickCtx.globalAlpha = 1; pickCtx.fillStyle = '#fff'; pickCtx.fillRect(0, 0, 1, 1);
  for (const L of S.world.layers) if (L.visible) pickCtx.drawImage(L.canvas, x, y, 1, 1, 0, 0, 1, 1);
  const d = pickCtx.getImageData(0, 0, 1, 1).data;
  prefs.color = '#' + [d[0], d[1], d[2]].map(v => v.toString(16).padStart(2, '0')).join('');
  syncBrushUI(); savePrefs();
}
function beginAt(e){
  if (prefs.tool === 'fill'){ const p = toCanvas(e); pend = { pid:e.pointerId, type:e.pointerType, x:p.x, y:p.y, cx:e.clientX, cy:e.clientY }; return; }
  if (prefs.tool === 'picker'){ picking = { pid:e.pointerId, type:e.pointerType }; pickAt(e); return; }
  startStroke(e);
}
function moveCursor(e){
  if (e.pointerType === 'touch' || (prefs.tool !== 'pen' && prefs.tool !== 'eraser')){ cursorEl.style.display = 'none'; return; }
  const p = toViewport(e), d = Math.max(3, prefs.size * Math.hypot(view.a, view.b));
  cursorEl.style.display = 'block'; cursorEl.style.width = cursorEl.style.height = d + 'px';
  cursorEl.style.transform = `translate(${p.x - d / 2}px, ${p.y - d / 2}px)`;
}

function vReset(){ const pts = [...vp.values()]; vStart = pts.length >= 2 ? { m:view, pts:pts.map(p => ({ ...p })) } : null; }
function gestureAllowed(){ return !prefs.lockView && !(cur && cur.type !== 'touch') && performance.now() - lastPen > 350; }
function tReset(){ const pts = [...tp.values()]; tStart = pts.length ? { m:S.trace.m, pts:pts.map(p => ({ ...p })) } : null; }

viewport.addEventListener('pointerdown', e => {
  if (e.pointerType === 'pen') lastPen = performance.now();
  try { viewport.setPointerCapture(e.pointerId); } catch(err){}

  if (prefs.tool === 'trace'){
    if (!S.trace.url) return;
    const p = toCanvas(e); tp.set(e.pointerId, { x:p.x, y:p.y }); tReset(); return;
  }

  if (e.pointerType === 'touch'){
    cursorEl.style.display = 'none';
    if (prefs.fingerDraw && vp.size === 0 && !busy()){ vp.set(e.pointerId, toViewport(e)); beginAt(e); return; }
    vp.set(e.pointerId, toViewport(e));
    if (cur && cur.type === 'touch'){
      if (performance.now() - cur.t0 < 250) cancelStroke(); else return;
    }
    if (pend && pend.type === 'touch') pend = null;
    if (picking && picking.type === 'touch') picking = null;
    if (vp.size >= 2 && gestureAllowed()) vReset();
    return;
  }
  if (e.button !== 0 && e.pointerType === 'mouse') return;
  if (busy()) return;
  vStart = null;
  beginAt(e);
});
viewport.addEventListener('pointermove', e => {
  if (e.pointerType === 'pen') lastPen = performance.now();
  moveCursor(e);
  if (prefs.tool === 'trace'){
    if (!tp.has(e.pointerId) || !tStart) return;
    const p = toCanvas(e); tp.set(e.pointerId, { x:p.x, y:p.y });
    const b = [...tp.values()], a = tStart.pts;
    let d;
    if (b.length >= 2 && a.length >= 2) d = pairDelta(a[0], a[1], b[0], b[1]);
    else d = new DOMMatrix().translate(b[0].x - a[0].x, b[0].y - a[0].y);
    S.trace.m = d.multiply(tStart.m); applyTraceStyle();
    return;
  }
  if (pend && e.pointerId === pend.pid && Math.hypot(e.clientX - pend.cx, e.clientY - pend.cy) > 12) pend = null;
  if (picking && e.pointerId === picking.pid) pickAt(e);
  if (cur && e.pointerId === cur.pid){ if (vp.has(e.pointerId)) vp.set(e.pointerId, toViewport(e)); moveStroke(e); return; }
  if (vp.has(e.pointerId)){
    vp.set(e.pointerId, toViewport(e));
    if (vStart && vp.size >= 2){
      if (!gestureAllowed()){ vStart = null; return; }
      const b = [...vp.values()];
      setView(pairDelta(vStart.pts[0], vStart.pts[1], b[0], b[1]).multiply(vStart.m));
    }
  }
});
function pointerEnd(e){
  if (prefs.tool === 'trace'){
    if (tp.delete(e.pointerId)){ tReset(); if (!tp.size) scheduleSave(); }
    return;
  }
  if (pend && e.pointerId === pend.pid){ const f = pend; pend = null; if (e.type === 'pointerup') doFill(f); }
  if (picking && e.pointerId === picking.pid){ picking = null; if (e.type === 'pointerup' && prefs.tool === 'picker') setTool(prevTool); }
  if (cur && e.pointerId === cur.pid){
    if (e.type === 'pointercancel') cancelStroke(); else endStroke();
  }
  if (vp.delete(e.pointerId)) vReset();
}
viewport.addEventListener('pointerup', pointerEnd);
viewport.addEventListener('pointercancel', pointerEnd);
viewport.addEventListener('pointerleave', () => { cursorEl.style.display = 'none'; });
viewport.addEventListener('contextmenu', e => e.preventDefault());
viewport.addEventListener('wheel', e => {
  e.preventDefault();
  if (prefs.lockView) return;
  const p = toViewport(e), k = Math.exp(-e.deltaY * 0.0015);
  setView(new DOMMatrix().translate(p.x, p.y).scale(k).translate(-p.x, -p.y).multiply(view));
}, { passive:false });

/* ---------- tools and brush ---------- */
let prevTool = 'pen';
function setTool(t){
  if (t === 'trace' && !S.trace.url){ toast('Import a trace image first.'); return; }
  if (t === 'picker' && prefs.tool !== 'picker' && prefs.tool !== 'trace') prevTool = prefs.tool;
  prefs.tool = t; savePrefs();
  document.querySelectorAll('[data-tool]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.tool === t)));
  viewport.classList.toggle('trace-mode', t === 'trace');
  viewport.dataset.tool = t;
  tp.clear(); tStart = null; pend = null; picking = null;
  cursorEl.style.display = 'none';
  applyTraceStyle(); renderPanel();
}
document.querySelectorAll('[data-tool]').forEach(b => b.onclick = () => {
  const t = b.dataset.tool;
  if (t === prefs.tool && (t === 'pen' || t === 'eraser' || t === 'fill')){ openBrushes(); return; }
  setTool(t);
  if (t === 'fill') toast('Tap an area to fill it on this layer.');
  if (t === 'picker') toast('Tap the canvas to pick a colour.');
});
function syncToolIcons(){
  const B = brushOf(BRUSHES, prefs.brush), E = brushOf(ERASERS, prefs.eBrush);
  const pen = document.querySelector('[data-tool=pen]'), er = document.querySelector('[data-tool=eraser]');
  setIcon(pen, B.icon); pen.setAttribute('aria-label', `Draw with ${B.name}`);
  er.setAttribute('aria-label', E.name);
}
function addRecent(c){
  if (prefs.recent[0] === c) return;
  prefs.recent = [c, ...prefs.recent.filter(x => x !== c)].slice(0, 6);
  savePrefs(); renderRecent();
}
function renderRecent(){
  const box = $('#recent'); box.replaceChildren();
  for (const c of prefs.recent){
    const b = document.createElement('button');
    b.style.background = c; b.setAttribute('aria-label', `Use colour ${c}`);
    b.onclick = () => { prefs.color = c; syncBrushUI(); savePrefs(); if (prefs.tool !== 'pen' && prefs.tool !== 'fill') setTool('pen'); };
    box.append(b);
  }
  box.hidden = !prefs.recent.length;
}

/* ---------- brushes dialog ---------- */
function previewBrush(cv, item, kind, ink){
  const W = 150, H = 40, k = 2; cv.width = W * k; cv.height = H * k;
  const x = cv.getContext('2d'); x.scale(k, k);
  const p = [];
  for (let i = 0; i <= 48; i++){ const t = i / 48; p.push(r1(10 + t * (W - 20)), r1(H / 2 + Math.sin(t * Math.PI * 2) * H * 0.24), r2(0.15 + 0.85 * Math.sin(t * Math.PI))); }
  const s = { t:'stroke', tool:kind, b:item.id, c:ink, s:9, o:1, p };
  if (kind === 'eraser'){ x.fillStyle = ink; x.fillRect(0, 9, W, H - 18); x.globalCompositeOperation = 'destination-out'; paint(x, s, 0, p.length / 3, '#000'); }
  else paint(x, s, 0, p.length / 3, ink);
}
function openBrushes(){
  const ink = getComputedStyle(document.documentElement).getPropertyValue('--ink').trim() || '#23272b';
  const fillList = (box, list, kind) => {
    box.replaceChildren();
    for (const item of list){
      const b = document.createElement('button'), cv = document.createElement('canvas');
      const on = kind === 'pen' ? prefs.brush === item.id : prefs.eBrush === item.id;
      b.className = 'bcard'; b.setAttribute('aria-pressed', String(on));
      const nm = document.createElement('b'), ds = document.createElement('small');
      nm.textContent = item.name; ds.textContent = item.desc;
      b.append(cv, nm, ds);
      previewBrush(cv, item, kind, ink);
      b.onclick = () => {
        if (kind === 'pen') prefs.brush = item.id; else prefs.eBrush = item.id;
        savePrefs(); syncToolIcons(); setTool(kind); $('#brushDlg').close();
      };
      box.append(b);
    }
  };
  fillList($('#brushList'), BRUSHES, 'pen');
  fillList($('#eraserList'), ERASERS, 'eraser');
  $('#optTol').value = prefs.tol; $('#optTolOut').textContent = prefs.tol;
  $('#brushDlg').showModal();
}
$('#btnBrushes').onclick = openBrushes;
$('#optTol').oninput = e => { prefs.tol = +e.target.value; $('#optTolOut').textContent = prefs.tol; savePrefs(); };
const colorIn = $('#color'), sizeIn = $('#size'), opIn = $('#opacity');
function syncBrushUI(){
  colorIn.value = prefs.color; $('#swatch').style.background = prefs.color;
  sizeIn.value = prefs.size; $('#sizeOut').textContent = prefs.size;
  opIn.value = prefs.opacity; $('#opOut').textContent = prefs.opacity;
  $('#optFinger').checked = prefs.fingerDraw;
  $('#optSmooth').value = prefs.smooth; $('#optSmoothOut').textContent = prefs.smooth;
  $('#btnLock').setAttribute('aria-pressed', String(prefs.lockView));
  setIcon($('#btnLock'), prefs.lockView ? 'lock' : 'unlock');
}
colorIn.oninput = () => { prefs.color = colorIn.value; syncBrushUI(); savePrefs(); };
sizeIn.oninput = () => { prefs.size = +sizeIn.value; syncBrushUI(); savePrefs(); };
opIn.oninput = () => { prefs.opacity = +opIn.value; syncBrushUI(); savePrefs(); };
$('#optFinger').onchange = e => { prefs.fingerDraw = e.target.checked; savePrefs(); };
$('#optSmooth').oninput = e => { prefs.smooth = +e.target.value; syncBrushUI(); savePrefs(); };
$('#btnLock').onclick = () => { prefs.lockView = !prefs.lockView; vStart = null; syncBrushUI(); savePrefs(); toast(prefs.lockView ? 'Zoom and rotation locked' : 'Zoom and rotation unlocked'); };
$('#btnFit').onclick = fitView;
$('#btnUndo').onclick = undo; $('#btnRedo').onclick = redo;
$('#btnLayers').onclick = () => {
  const open = main.classList.toggle('no-panel') === false;
  $('#btnLayers').setAttribute('aria-pressed', String(open));
};
if (window.matchMedia('(max-width:760px)').matches){ main.classList.add('no-panel'); $('#btnLayers').setAttribute('aria-pressed','false'); }

document.addEventListener('keydown', e => {
  if (e.target.matches('input, select')) return;
  const mod = e.ctrlKey || e.metaKey;
  if (mod && e.key.toLowerCase() === 'z'){ e.preventDefault(); e.shiftKey ? redo() : undo(); }
  else if (mod && e.key.toLowerCase() === 'y'){ e.preventDefault(); redo(); }
  else if (!mod && e.key === 'b') setTool('pen');
  else if (!mod && e.key === 'e') setTool('eraser');
  else if (!mod && e.key === 'g') setTool('fill');
  else if (!mod && e.key === 'i') setTool('picker');
  else if (!mod && (e.key === '[' || e.key === ']')){
    const step = Math.max(1, Math.round(prefs.size * 0.15)) * (e.key === ']' ? 1 : -1);
    prefs.size = Math.max(1, Math.min(120, prefs.size + step)); syncBrushUI(); savePrefs();
  }
});

/* ---------- trace image ---------- */
async function setTraceBlob(blob, fit){
  if (S.trace.url) URL.revokeObjectURL(S.trace.url);
  const url = URL.createObjectURL(blob);
  traceEl.src = url;
  try { await traceEl.decode(); } catch(e){ URL.revokeObjectURL(url); toast("That file couldn't be opened as an image."); return false; }
  S.trace.blob = blob; S.trace.url = url; S.trace.iw = traceEl.naturalWidth; S.trace.ih = traceEl.naturalHeight;
  if (fit){
    const s = Math.min(S.w / S.trace.iw, S.h / S.trace.ih);
    S.trace.m = new DOMMatrix().translate((S.w - S.trace.iw * s) / 2, (S.h - S.trace.ih * s) / 2).scale(s);
    S.trace.visible = true;
  }
  return true;
}
$('#btnImport').onclick = () => $('#traceFile').click();
$('#traceFile').onchange = async e => {
  const f = e.target.files[0]; e.target.value = '';
  if (!f) return;
  if (await setTraceBlob(f, true)){ syncDOM(); renderPanel(); scheduleSave(); toast('Trace image added. It stays out of the timelapse.'); }
};
$('#btnAdjust').onclick = () => setTool(prefs.tool === 'trace' ? 'pen' : 'trace');
$('#traceOp').oninput = e => { S.trace.opacity = +e.target.value; $('#traceOpOut').textContent = S.trace.opacity; applyTraceStyle(); scheduleSave(); };
$('#traceShow').onchange = e => { S.trace.visible = e.target.checked; applyTraceStyle(); scheduleSave(); };
$('#traceTop').onchange = e => { S.trace.onTop = e.target.checked; syncDOM(); scheduleSave(); };
$('#btnTraceRemove').onclick = () => {
  if (S.trace.url) URL.revokeObjectURL(S.trace.url);
  Object.assign(S.trace, { blob:null, url:null, iw:0, ih:0, m:new DOMMatrix() });
  traceEl.removeAttribute('src');
  if (prefs.tool === 'trace') setTool('pen');
  syncDOM(); renderPanel(); scheduleSave();
};

/* ---------- saving ---------- */
let saveT, saveWarned = false;
function scheduleSave(){ clearTimeout(saveT); saveT = setTimeout(saveNow, 900); }
async function saveNow(){
  const t = S.trace, m = t.m;
  try {
    await kvSet('project', {
      v:1, w:S.w, h:S.h, actions:S.actions, meta:S.meta, nextId:S.nextId, activeId:S.activeId, base:S.base,
      trace:{ blob:t.blob, m:[m.a, m.b, m.c, m.d, m.e, m.f], opacity:t.opacity, visible:t.visible, onTop:t.onTop }
    });
  } catch(e){
    if (!saveWarned){ saveWarned = true; toast("Couldn't save to this browser. Export your work before closing."); }
  }
}
window.addEventListener('pagehide', saveNow);
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') saveNow(); });

/* ---------- file saving via the viewer ---------- */
let dlP = null;
function getDownloads(){
  if (!dlP) dlP = (window.claude && window.claude.use ? Promise.resolve(window.claude.use('downloads')) : Promise.resolve(null)).catch(() => null);
  return dlP;
}
function fallbackDownload(name, blob){
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name;
  document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 60000);
}
async function saveFile(name, blob){
  const d = await getDownloads();
  if (d){
    try { await d.save({ filename:name, data:blob }); toast(`Saved ${name}`); }
    catch(err){
      const c = err && err.code;
      if (c === 'declined') return;
      if (c === 'rate_limited'){ toast('A save prompt is already open.'); return; }
      if (c === 'too_large'){ toast('That file is too large to save here. Try a shorter video.'); return; }
      fallbackDownload(name, blob);
    }
    return;
  }
  fallbackDownload(name, blob);
}

/* ---------- menu ---------- */
$('#btnMenu').onclick = () => { syncBrushUI(); $('#menuDlg').showModal(); };
$('#menuDlg').addEventListener('click', e => {
  const b = e.target.closest('[data-act]'); if (!b) return;
  $('#menuDlg').close();
  if (b.dataset.act === 'png') exportPNG();
  if (b.dataset.act === 'timelapse') openTimelapse();
  if (b.dataset.act === 'new'){ $('#newW').value = S.w; $('#newH').value = S.h; $('#newDlg').showModal(); }
});
document.querySelectorAll('#newDlg [data-w]').forEach(b => b.onclick = () => { $('#newW').value = b.dataset.w; $('#newH').value = b.dataset.h; });
$('#btnCreate').onclick = () => {
  const w = Math.round(+$('#newW').value), h = Math.round(+$('#newH').value);
  if (!(w >= 200 && w <= 4096 && h >= 200 && h <= 4096)){ toast('Width and height must be between 200 and 4096.'); return; }
  $('#newDlg').close();
  const keepTrace = S.trace.blob;
  S = newState(w, h);
  startProject();
  if (keepTrace) setTraceBlob(keepTrace, true).then(() => { syncDOM(); renderPanel(); scheduleSave(); });
  scheduleSave();
};

/* ---------- export image ---------- */
function compositeFinal(){
  const c = mkCanvas(S.w, S.h), x = c.getContext('2d');
  x.fillStyle = '#fff'; x.fillRect(0, 0, S.w, S.h);
  for (const L of S.world.layers) if (L.visible && !isPriv(L.id)) x.drawImage(L.canvas, 0, 0);
  return c;
}
function exportPNG(){
  compositeFinal().toBlob(b => { if (b) saveFile('nonphoto-drawing.png', b); else toast("Couldn't create the image."); }, 'image/png');
}

/* ---------- timelapse ---------- */
let tl = null;
function pickMime(){
  const list = ['video/mp4;codecs=avc1.42E01F', 'video/mp4', 'video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'];
  return list.find(m => { try { return MediaRecorder.isTypeSupported(m); } catch(e){ return false; } }) || '';
}
function openTimelapse(){
  const strokes = S.actions.filter(a => (a.t === 'stroke' || a.t === 'fill') && !isPriv(a.id)).length;
  if (!strokes){ toast('Nothing to replay yet. Draw something first.'); return; }
  if (!window.MediaRecorder || !HTMLCanvasElement.prototype.captureStream){ toast("This browser can't record video."); return; }
  $('#tlSetup').hidden = false; $('#tlRun').hidden = true;
  $('#tlStart').hidden = false; $('#tlSave').hidden = true; $('#tlCancel').textContent = 'Cancel';
  $('#tlNote').textContent = 'Your strokes replay from the start. The trace image and any layer marked hidden from timelapse are left out.';
  $('#tlBar').style.width = '0';
  $('#tlDlg').showModal();
}
$('#tlCancel').onclick = () => { if (tl) tl.cancelled = true; $('#tlDlg').close(); };
$('#tlDlg').addEventListener('close', () => { if (tl) tl.cancelled = true; });
$('#tlSave').onclick = () => { if (tl && tl.blob) saveFile(tl.name, tl.blob); };
$('#tlStart').onclick = async () => {
  const mime = pickMime();
  if (!mime){ toast("This browser can't record video."); return; }
  $('#tlSetup').hidden = true; $('#tlRun').hidden = false; $('#tlStart').hidden = true;
  $('#tlNote').textContent = 'Recording. Keep this screen open until it finishes.';
  const seconds = +$('#tlLen').value;
  const job = tl = { cancelled:false, blob:null, name:'' };

  const sc = Math.min(1, 1920 / Math.max(S.w, S.h));
  const vw = Math.max(2, Math.round(S.w * sc / 2) * 2), vh = Math.max(2, Math.round(S.h * sc / 2) * 2);
  const out = $('#tlCanvas'); out.width = vw; out.height = vh;
  const o = out.getContext('2d');
  const world = { w:S.w, h:S.h, layers:[], temp:mkCanvas(S.w, S.h) };
  const tctx = world.temp.getContext('2d');
  const acts = S.actions.slice();
  let total = 0;
  const FILL_COST = 20; // a fill appears at once, then holds for a moment
  for (const a of acts) if (!isPriv(a.id)){ if (a.t === 'stroke') total += a.p.length / 3; else if (a.t === 'fill') total += FILL_COST; }
  const fps = 30, per = Math.max(1, total / (seconds * fps));
  let ai = 0, pi = 0, inStroke = null;

  function step(budget){
    while (budget > 0 && ai < acts.length){
      const a = acts[ai];
      if (a.t !== 'stroke'){
        if (!((a.t === 'clear' || a.t === 'fill') && isPriv(a.id))){ applyAction(world, a); if (a.t === 'fill') budget -= FILL_COST; }
        ai++; continue;
      }
      const li = findL(world, a.id);
      if (isPriv(a.id) || li < 0){ ai++; continue; }
      const L = world.layers[li], n = a.p.length / 3;
      if (!inStroke){ inStroke = a; pi = 0; }
      const to = Math.min(n, pi + Math.ceil(budget));
      if (a.tool === 'eraser'){ L.ctx.save(); L.ctx.globalCompositeOperation = 'destination-out'; paint(L.ctx, a, pi, to, '#000'); L.ctx.restore(); }
      else paint(tctx, a, pi, to, a.c);
      budget -= Math.max(1, to - pi); pi = to;
      if (pi >= n){
        if (a.tool === 'pen'){ L.ctx.save(); L.ctx.globalAlpha = a.o; L.ctx.drawImage(world.temp, 0, 0); L.ctx.restore(); tctx.clearRect(0, 0, S.w, S.h); }
        inStroke = null; ai++;
      }
    }
  }
  function compose(){
    o.globalAlpha = 1; o.fillStyle = '#fff'; o.fillRect(0, 0, vw, vh);
    for (const L of world.layers){
      if (!L.visible || isPriv(L.id)) continue;
      o.drawImage(L.canvas, 0, 0, vw, vh);
      if (inStroke && inStroke.id === L.id && inStroke.tool === 'pen'){ o.globalAlpha = inStroke.o; o.drawImage(world.temp, 0, 0, vw, vh); o.globalAlpha = 1; }
    }
  }
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  compose();
  const stream = out.captureStream(fps);
  let rec;
  try { rec = new MediaRecorder(stream, { mimeType:mime, videoBitsPerSecond:10000000 }); }
  catch(e){ toast("This browser can't record video."); $('#tlDlg').close(); return; }
  const chunks = [];
  rec.ondataavailable = e => { if (e.data && e.data.size) chunks.push(e.data); };
  const stopped = new Promise(r => rec.onstop = r);
  rec.start(500);
  await sleep(300);
  while (ai < acts.length && !job.cancelled){
    step(per); compose();
    $('#tlBar').style.width = (100 * ai / acts.length).toFixed(1) + '%';
    await sleep(1000 / fps);
  }
  compose(); $('#tlBar').style.width = '100%';
  if (!job.cancelled) await sleep(1500);
  rec.stop(); await stopped;
  stream.getTracks().forEach(t => t.stop());
  if (job.cancelled) return;
  const ext = mime.startsWith('video/mp4') ? 'mp4' : 'webm';
  job.blob = new Blob(chunks, { type:mime.split(';')[0] });
  job.name = `nonphoto-timelapse.${ext}`;
  $('#tlNote').textContent = ext === 'webm'
    ? 'Done. This browser records WebM, which most video apps and TikTok accept. Convert it to MP4 if one does not.'
    : 'Done. Save the video to keep it.';
  $('#tlSave').hidden = false; $('#tlCancel').textContent = 'Close';
};

/* ---------- boot ---------- */
function startProject(){
  liveTemp.width = S.w; liveTemp.height = S.h;
  if (!S.actions.length){
    const id = S.nextId++; S.meta[id] = { name:'Layer 1', priv:false };
    S.actions.push({ t:'add', id, at:0 }); S.activeId = id; S.base = 1;
  }
  if (!S.trace.url){ traceEl.removeAttribute('src'); }
  rebuild();
  requestAnimationFrame(fitView);
}
async function boot(){
  syncBrushUI(); syncToolIcons(); renderRecent();
  let data = null;
  try { data = await kvGet('project'); } catch(e){}
  if (data && data.v === 1 && data.w && data.h){
    S = newState(data.w, data.h);
    S.actions = data.actions || []; S.meta = data.meta || {}; S.nextId = data.nextId || 1;
    S.activeId = data.activeId; S.base = data.base || 0;
    const t = data.trace || {};
    if (t.blob && await setTraceBlob(t.blob, false)){
      if (Array.isArray(t.m)) S.trace.m = new DOMMatrix(t.m);
      S.trace.opacity = t.opacity ?? 45; S.trace.visible = t.visible !== false; S.trace.onTop = !!t.onTop;
    }
  } else S = newState(1536, 2048);
  startProject();
  setTool(prefs.tool);
  getDownloads();
}
boot();
})();
