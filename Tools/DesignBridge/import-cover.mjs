/** Target-specific adapter for the verified MCP Cover response, not a screenshot-to-UI heuristic. */
import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { createPackage, invariant } from './src/package.mjs';
import { linearGradientPNG } from './src/png.mjs';

const [input, output, sharpPath] = process.argv.slice(2);
invariant(input && output && sharpPath, 'Usage: node import-cover.mjs <MCP-capture-dir> <package-dir> <sharp-module-path>');
const snapshot = JSON.parse(await fs.readFile(path.join(input, 'source.json'), 'utf8'));
const root = snapshot.source;
invariant(root.id === '1:4210' && root.width === 1600 && root.height === 960, 'Wrong Cover source');
const nodes = new Map();
function index(n) { nodes.set(n.id, n); for (const child of n.children || []) index(child); }
index(root);
const get = id => { const n = nodes.get(id); invariant(n, 'Missing source node ' + id); return n; };
const rgba = p => [p.color.r, p.color.g, p.color.b, p.opacity ?? 1];
const local = n => ({ x: n.absoluteBoundingBox.x - root.absoluteBoundingBox.x, y: n.absoluteBoundingBox.y - root.absoluteBoundingBox.y, width: n.width, height: n.height });
const native = (n, parentId, type = 'frame') => ({ id: n.id, name: n.name, parentId, type, bounds: local(n), opacity: n.opacity ?? 1, source: { type: n.type } });
const head = get('1:5495'), banner = get('I1:5495;2910:9711'), border = get('I1:5495;2910:9711;2910:8644');
const author = get('I1:5495;2910:8619'), title = get('1:6019');
const warnings = [];
const warning = (nodeId, code, message) => warnings.push({ severity: 'warning', nodeId, code, message });
const result = [];
result.push({ ...native(root, null), bounds: { x: 0, y: 0, width: root.width, height: root.height }, clip: true, backgroundAssetId: 'cover-gradient' });
result.push({ ...native(get('1:5494'), root.id, 'image'), assetId: 'cards' });
result.push({ ...native(head, root.id), fill: rgba(banner.fills[0]) });
// Figma centered stroke converted to an equivalent inside stroke on expanded bounds.
const bb = local(border), sw = border.strokeWeight;
const bw = bb.width + sw, bh = bb.height + sw;
result.push({ ...native(border, head.id), bounds: { x: bb.x - sw / 2, y: bb.y - sw / 2, width: bw, height: bh } });
for (const [edge, x, y, width, height] of [['top', 0, 0, bw, sw], ['bottom', 0, bh - sw, bw, sw], ['left', 0, sw, sw, bh - 2 * sw], ['right', bw - sw, sw, sw, bh - 2 * sw]]) {
  result.push({ id: border.id + ':' + edge, name: 'Native stroke ' + edge, parentId: border.id, type: 'shape', bounds: { x, y, width, height }, opacity: 1, fill: rgba(border.strokes[0]), source: { strokeOf: border.id } });
}
for (const [id, assetId, mirror] of [['I1:5495;2910:9711;2910:8662', 'arrow-left', false], ['I1:5495;2910:9711;2910:8665', 'arrow-right', true]]) {
  result.push({ ...native(get(id), head.id, 'image'), assetId, ...(mirror ? { mirrorX: true } : {}) });
}
// The available isolated author export clipped its overhanging glyphs. Preserve those
// pixels using the original header export clipped to the source glyph render bounds.
const ar = author.absoluteRenderBounds;
const clip = { x: Math.floor(ar.x - root.absoluteBoundingBox.x), y: Math.floor(ar.y - root.absoluteBoundingBox.y), width: Math.ceil(ar.x + ar.width) - Math.floor(ar.x), height: Math.ceil(ar.y + ar.height) - Math.floor(ar.y) };
result.push({ ...native(author, head.id), bounds: clip, clip: true, source: { type: 'TEXT', characters: author.characters, segments: author.segments, rasterized: true } });
result.push({ id: author.id + ':pixels', name: 'Original author pixels', parentId: author.id, type: 'image', bounds: { x: -clip.x, y: -clip.y, width: head.width, height: head.height }, opacity: 1, assetId: 'header-export' });
const tr = title.absoluteRenderBounds;
result.push({ ...native(title, root.id, 'image'), bounds: { x: tr.x - root.absoluteBoundingBox.x, y: tr.y - root.absoluteBoundingBox.y, width: Math.ceil(tr.width), height: Math.ceil(tr.height) }, assetId: 'title-export', source: { type: 'TEXT', characters: title.characters, segments: title.segments, rasterized: true } });
warning(author.id, 'STATIC_TEXT_RASTERIZED', 'Original source header pixels are clipped to this text glyph region; not editable text.');
warning(title.id, 'STATIC_TEXT_RASTERIZED', 'Original exported text render contains its source background; native text was not substituted.');
warning(root.id, 'GRADIENT_NUMERIC_RASTER', 'Gradient texture is generated from exact source paint and transform, independently of reference pixels.');
warning(head.id, 'LAYOUT_FROZEN', 'Resolved Figma layout is fixed at 1600x960.');
const sharp = createRequire(import.meta.url)(sharpPath);
const assets = [{ id: 'cover-gradient', bytes: linearGradientPNG(root.width, root.height, root.fills[0]), sourceNodeId: root.id }];
for (const [id, filename, sourceNodeId] of [['cards', 'cards.png', '1:5494'], ['header-export', 'header.png', head.id], ['title-export', 'title.png', title.id]]) assets.push({ id, bytes: await fs.readFile(path.join(input, filename)), sourceNodeId });
for (const id of ['arrow-left', 'arrow-right']) assets.push({ id, bytes: await sharp(path.join(input, id + '.svg')).png().toBuffer(), sourceNodeId: id === 'arrow-left' ? 'I1:5495;2910:9711;2910:8662' : 'I1:5495;2910:9711;2910:8665' });
const design = { schemaVersion: 1, id: 'genshin_cover', source: { kind: 'figma', fileKey: 'SKV7kQXEaCXLta7EAuZYG6', nodeId: root.id, captureMethod: 'figma-mcp', capturedAt: '2026-10-04', name: root.name }, canvas: { width: root.width, height: root.height }, nodes: result, assets: [], diagnostics: warnings };
console.log((await createPackage(output, design, assets, snapshot, await fs.readFile(path.join(input, 'reference.png')))).summary);
