import test from 'node:test';
import assert from 'node:assert/strict';
import { planFigwright, mcpData } from '../src/figwright.mjs';

const url = 'https://www.figma.com/design/testfile/demo?node-id=1-1';
const bounds = (x, y, width, height) => ({ x, y, width, height });
function source(extra = {}) {
  const child = { id: '1:2', type: 'TEXT', name: 'Overhanging text', visible: true,
    width: 80, height: 30, absoluteBoundingBox: bounds(152, 228, 80, 30),
    absoluteRenderBounds: bounds(154, 225, 78, 43), relativeTransform: [[1, 0, 52], [0, 1, 28]],
    opacity: 0.5, fills: 'mixed', characters: 'Title', ...extra };
  return { fileName: 'Test', node: { id: '1:1', type: 'FRAME', name: 'Root', visible: true,
    width: 640, height: 360, absoluteBoundingBox: bounds(100, 200, 640, 360),
    absoluteRenderBounds: bounds(100, 200, 640, 360), relativeTransform: [[1, 0, 100], [0, 1, 200]],
    children: [child] }, reactions: [{ nodeId: '1:1', reactions: [] }, { nodeId: '1:2', reactions: [] }],
    motion: { rootNodeId: '1:1', coverage: { status: 'complete' }, nodes: [] } };
}
test('Figwright import keeps paint bounds and does not apply raster opacity twice', () => {
  const result = planFigwright(source(), { url });
  assert.deepEqual(result.design.nodes[1].bounds, bounds(54, 25, 78, 43));
  assert.equal(result.design.nodes[1].opacity, 1);
  assert.equal(result.design.source.fileKeyVerified, false);
  assert.equal(result.design.source.captureMethod, 'figwright');
});
test('Figwright reflection raster uses API absolute bounds, not rotated layout x', () => {
  const result = planFigwright(source({ type: 'RECTANGLE', fills: [], x: 1600,
    absoluteBoundingBox: bounds(1552, 228, 48, 36), absoluteRenderBounds: bounds(1552, 228, 48, 36),
    relativeTransform: [[-1, 0, 1600], [0, 1, 28]] }), { url });
  assert.equal(result.design.nodes[1].type, 'image');
  assert.equal(result.design.nodes[1].bounds.x, 1452);
});
test('Figwright refuses missing geometry and partial animation coverage', () => {
  assert.throws(() => planFigwright(source({ absoluteBoundingBox: undefined }), { url }), /geometry missing/);
  const s = source(); s.motion.coverage.status = 'partial';
  assert.throws(() => planFigwright(s, { url }), /incomplete/);
});
test('Figwright refuses prototype or animation behavior rather than flattening it', () => {
  const s = source(); s.reactions[1].reactions = [{ trigger: { type: 'ON_CLICK' }, actions: [] }];
  assert.throws(() => planFigwright(s, { url }), /interactive/);
  s.reactions[1].reactions = []; s.motion.nodes = [{ nodeId: '1:2' }];
  assert.throws(() => planFigwright(s, { url }), /animation mapping/);
});
test('MCP adapter rejects errors and recognizes structured content', () => {
  assert.deepEqual(mcpData({ content: [{ type: 'text', text: 'note' }, { type: 'text', text: '{"ok":true}' }] }), { ok: true });
  assert.throws(() => mcpData({ isError: true, content: [] }), /tool error/);
});
