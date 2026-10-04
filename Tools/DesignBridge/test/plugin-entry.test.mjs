import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
const code = await fs.readFile(new URL('../figma-plugin/main.js', import.meta.url), 'utf8');

test('local-figma exporter keeps the bridge plugin UI handler intact', async () => {
  const original = () => {}, messages = [];
  const figma = { ui: { onmessage: original, postMessage() { throw Error('Wrong output channel'); } },
    showUI() { throw Error('Must not replace local runtime UI'); }, getNodeByIdAsync: async () => null };
  const fn = vm.runInNewContext(code + '\nexportDesignBridge;', { figma, __DESIGNBRIDGE_LOCAL__: { emit: m => messages.push(m) } });
  assert.equal(figma.ui.onmessage, original);
  await fn({ type: 'export', nodeId: '1:4210' });
  assert.equal(messages.length, 1); assert.equal(messages[0].type, 'error');
});

test('standalone exporter still installs its own UI entry', () => {
  let shown = false;
  const figma = { ui: { postMessage() {} }, showUI: html => { shown = html === 'test'; } };
  vm.runInNewContext(code, { figma, __html__: 'test' });
  assert.equal(shown, true); assert.equal(typeof figma.ui.onmessage, 'function');
});
