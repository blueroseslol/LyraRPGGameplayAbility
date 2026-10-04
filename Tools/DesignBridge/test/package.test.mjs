import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fixture, png, writeFixture } from './fixture.mjs';
import { readPackage, safeRelativePath, validateDesign, pngSize, stableStringify, createPackage } from '../src/package.mjs';
import { parseFigmaURL, planFigma, fetchFigma } from '../src/figma.mjs';
import { generate, runtimeDocument, verifyRuntime } from '../src/generate.mjs';
import { linearGradientPNG } from '../src/png.mjs';
import { inflateSync } from 'node:zlib';

test('numeric linear-gradient raster uses source transform and color stops', () => {
  const bytes = linearGradientPNG(2, 1, { type: 'GRADIENT_LINEAR', gradientTransform: [[1, 0, 0], [0, 1, 0]], gradientStops: [
    { position: 0, color: { r: 0, g: 0, b: 0, a: 1 } }, { position: 1, color: { r: 1, g: 1, b: 1, a: 1 } },
  ] });
  let offset = 8; const compressed = [];
  while (offset < bytes.length) { const size = bytes.readUInt32BE(offset); if (bytes.toString('ascii', offset + 4, offset + 8) === 'IDAT') compressed.push(bytes.subarray(offset + 8, offset + 8 + size)); offset += size + 12; }
  assert.deepEqual([...inflateSync(Buffer.concat(compressed))], [0, 64, 64, 64, 255, 191, 191, 191, 255]);
});

async function temp(t) {
  const root = await fs.realpath(os.tmpdir());
  const dir = await fs.mkdtemp(path.join(root, 'designbridge-test-'));
  t.after(async () => {
    const target = await fs.realpath(dir), relative = path.relative(root, target);
    assert.ok(relative.startsWith('designbridge-test-') && !relative.includes(path.sep) && !path.isAbsolute(relative));
    await fs.rm(target, { recursive: true, force: true });
  }); return dir;
}

test('container image render bounds survive generation and invalid bounds are rejected', async t => {
  const { design } = await writeFixture(await temp(t));
  design.nodes[1].backgroundAssetId = 'checker';
  design.nodes[1].backgroundBounds = { x: -5, y: -7, width: 270, height: 274 };
  validateDesign(design);
  assert.deepEqual(runtimeDocument(design, '/Game/DesignBridge/Test').nodes[1].backgroundBounds, design.nodes[1].backgroundBounds);
  design.nodes[1].backgroundBounds.width = NaN;
  assert.throws(() => validateDesign(design), /background.width/);
});

test('source prototype interactions cannot be silently rasterized', () => {
  const node = { id: '1:2', type: 'VECTOR', name: 'Clickable', absoluteBoundingBox: box(120, 240, 40, 40), reactions: [{ trigger: { type: 'ON_CLICK' } }] };
  assert.throws(() => planFigma(response(node), '1:1', { fileKey: 'abc' }), /interactive subtree/);
});
test('Figma URL preserves file and normalizes node id; rejects pages without node selection', () => {
  assert.deepEqual(parseFigmaURL('https://www.figma.com/design/SKV7kQXEaCXLta7EAuZYG6/Test?node-id=1-4210'), { fileKey: 'SKV7kQXEaCXLta7EAuZYG6', nodeId: '1:4210' });
  assert.throws(() => parseFigmaURL('https://example.com/design/abc?a=b'));
  assert.throws(() => parseFigmaURL('https://figma.com/design/abc'));
});
test('capture does not make a network request without an explicit token', async () => {
  await assert.rejects(fetchFigma('https://figma.com/design/abc?node-id=1-2', 'unused', {}, ''), /token is missing/);
});
test('paths reject traversal, absolute names, ADS and URL-like entries', () => {
  for (const value of ['../secret', 'assets/../../secret', 'C:\\secret', '/tmp/x', 'assets/x:evil', 'https://example.com/x', 'assets//x']) assert.throws(() => safeRelativePath(value));
  assert.equal(safeRelativePath('assets\\image.png'), 'assets/image.png');
});
test('PNG signature and dimensions are validated, not trusted from metadata', () => {
  assert.deepEqual(pngSize(png(3, 7)), { width: 3, height: 7 });
  assert.throws(() => pngSize(Buffer.from('<html>not an image</html>')));
});
test('package verifies all image hashes and original reference', async t => {
  const dir = await temp(t); const { design } = await writeFixture(dir);
  assert.equal((await readPackage(dir)).summary.nodes, 5);
  await fs.appendFile(path.join(dir, design.assets[0].path), 'corruption');
  await assert.rejects(readPackage(dir), /hash mismatch/);
});
test('reference corruption is a failure even when UI assets remain valid', async t => {
  const dir = await temp(t); await writeFixture(dir); await fs.writeFile(path.join(dir, 'reference.png'), png(1, 1));
  await assert.rejects(readPackage(dir), /Reference image hash/);
});
test('hierarchy rejects cycles, multiple roots, duplicate ids and leaf children', async t => {
  const { design } = await writeFixture(await temp(t));
  for (const mutate of [d => d.nodes[1].parentId = 'art', d => d.nodes[1].parentId = null, d => d.nodes[1].id = 'root', d => d.nodes[3].parentId = 'art']) {
    const copy = structuredClone(design); mutate(copy); assert.throws(() => validateDesign(copy));
  }
});
test('missing resource and blocking diagnostic cannot silently render', async t => {
  const { design } = await writeFixture(await temp(t));
  const missing = structuredClone(design); missing.assets = []; assert.throws(() => validateDesign(missing), /Missing image/);
  design.diagnostics.push({ severity: 'error', code: 'CLIP_UNSUPPORTED', message: 'unsupported clip' });
  assert.throws(() => validateDesign(design), /blocking diagnostics/);
});
test('generation is deterministic, retains source IDs and uses imported resource object paths', async t => {
  const dir = await temp(t), pkg = path.join(dir, 'pkg'), out = path.join(dir, 'generated');
  await writeFixture(pkg); await generate(pkg, out, '/Game/DesignBridge/Test');
  const first = await fs.readFile(path.join(out, 'fixture.design.ts'), 'utf8');
  await generate(pkg, out, '/Game/DesignBridge/Test'); assert.equal(await fs.readFile(path.join(out, 'fixture.design.ts'), 'utf8'), first);
  assert.match(first, /\/Game\/DesignBridge\/Test\/Textures\/T_/); assert.match(first, /"parentId": "panel"/);
  const doc = runtimeDocument((await readPackage(pkg)).design, '/Game/DesignBridge/Test');
  assert.equal(new Set(doc.nodes.map(n => n.widgetName)).size, doc.nodes.length);
});
test('generator refuses arbitrary UE destinations and handwritten file overwrites', async t => {
  const dir = await temp(t), pkg = path.join(dir, 'pkg'), out = path.join(dir, 'generated'); await writeFixture(pkg);
  await assert.rejects(generate(pkg, out, '/Game/UserContent'), /inside \/Game\/DesignBridge/);
  await fs.mkdir(out); await fs.writeFile(path.join(out, 'fixture.design.ts'), '// user code');
  await assert.rejects(generate(pkg, out), /hand-written/);
});
test('UE import refuses stale runtime after source design changes', async t => {
  const dir = await temp(t), pkg = path.join(dir, 'pkg'), out = path.join(dir, 'generated');
  await writeFixture(pkg); await generate(pkg, out); await verifyRuntime(pkg);
  const file = path.join(pkg, 'ui.json');
  const design = JSON.parse(await fs.readFile(file, 'utf8'));
  design.nodes[1].bounds.x += 1; await fs.writeFile(file, stableStringify(design));
  await assert.rejects(verifyRuntime(pkg), /stale or modified/);
});
test('package writer refuses unrelated output directories', async t => {
  const dir = await temp(t); await fs.writeFile(path.join(dir, 'user.txt'), 'keep');
  await assert.rejects(writeFixture(dir), /not owned/); assert.equal(await fs.readFile(path.join(dir, 'user.txt'), 'utf8'), 'keep');
});
const box = (x, y, width, height) => ({ x, y, width, height });
function response(child, rootExtra = {}) {
  return { name: 'source', version: 'v1', nodes: { '1:1': { document: { id: '1:1', type: 'FRAME', name: 'Root', absoluteBoundingBox: box(100, 200, 640, 360), children: [child], ...rootExtra } } } };
}
test('Figma geometry is parent relative and preserves opacity without guessing layout', () => {
  const { design } = planFigma(response({ id: '1:2', type: 'RECTANGLE', name: 'R', opacity: .5, absoluteBoundingBox: box(130, 250, 20, 40), fills: [{ type: 'SOLID', color: { r: 1, g: 0, b: 0 } }] }), '1:1', { fileKey: 'abc' });
  assert.deepEqual(design.nodes[1].bounds, box(30, 50, 20, 40)); assert.equal(design.nodes[1].opacity, .5);
});
test('raster fallback uses render bounds and does not apply opacity twice', () => {
  const node = { id: '1:2', type: 'VECTOR', name: 'V', opacity: .4, absoluteBoundingBox: box(130, 250, 20, 40), absoluteRenderBounds: box(125, 245, 30, 50) };
  const plan = planFigma(response(node), '1:1', { fileKey: 'abc' });
  assert.equal(plan.design.nodes[1].opacity, 1); assert.deepEqual(plan.design.nodes[1].bounds, box(25, 45, 30, 50));
  assert.equal(plan.images[0].nodeId, '1:2');
});
test('complex root visuals cannot silently flatten the whole screen', () => {
  const child = { id: '1:2', type: 'RECTANGLE', name: 'R', absoluteBoundingBox: box(110, 220, 50, 50) };
  const plan = planFigma(response(child, { fills: [{ type: 'GRADIENT_LINEAR' }] }), '1:1', { fileKey: 'abc' });
  assert.ok(plan.design.diagnostics.some(d => d.code === 'CONTAINER_VISUAL_REQUIRES_EXPORT' && d.severity === 'error'));
  assert.throws(() => planFigma(response(child), '1:1', { fileKey: 'abc', rasterizeNodes: ['1:1'] }), /Whole-screen/);
});
test('native text needs font mapping; explicit static rasterization keeps a diagnostic', () => {
  const node = { id: '1:2', type: 'TEXT', name: 'Title', characters: '真实文字', style: { fontFamily: 'DesignFont', fontSize: 30 }, absoluteBoundingBox: box(120, 240, 180, 40), fills: [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }] };
  const plan = planFigma(response(node), '1:1', { fileKey: 'abc' });
  assert.ok(plan.design.diagnostics.some(d => d.code === 'FONT_MAPPING_REQUIRED'));
  const raster = planFigma(response(node), '1:1', { fileKey: 'abc', textMode: 'raster' });
  assert.equal(raster.design.nodes[1].type, 'image'); assert.ok(raster.design.diagnostics.some(d => d.code === 'STATIC_TEXT_RASTERIZED'));
});
test('source strings are serialized as data, not interpolated executable code', () => {
  assert.equal(JSON.parse(stableStringify({ text: '"; process.exit(); //\n</script>' })).text, '"; process.exit(); //\n</script>');
});
