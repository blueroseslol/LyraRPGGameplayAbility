import fs from 'node:fs/promises';
import path from 'node:path';
import { readPackage, invariant, stableStringify } from './src/package.mjs';
import { verifyRuntime } from './src/generate.mjs';
const directory = process.argv[2];
invariant(directory, 'Usage: node audit-render.mjs <package>');
await verifyRuntime(directory);
const { design } = await readPackage(directory);
const runtime = JSON.parse(await fs.readFile(path.join(directory, 'runtime.json'), 'utf8'));
const reactOnly = process.argv[3] === '--react-only';
invariant(!process.argv[3] || reactOnly, 'Unknown option');
const imported = JSON.parse(await fs.readFile(path.join(directory, reactOnly ? 'reactumg-import-report.json' : 'ue-import-report.json'), 'utf8'));
const running = JSON.parse(await fs.readFile(path.join(directory, 'ue-runtime-report.json'), 'utf8'));
invariant(imported.ok && running.ok, 'UE run did not succeed');
if (!reactOnly) invariant(imported.nodes === design.nodes.length, 'Stale imported tree');
invariant(stableStringify(imported.source) === stableStringify(design.source) && stableStringify(running.source) === stableStringify(design.source), 'Stale source identity');
invariant(design.assets.every(a => a.sha256 !== design.reference.sha256), 'Reference screenshot must not be a UI asset');
const assets = new Map(runtime.assets.map(a => [a.id, a]));
const expected = runtime.nodes.flatMap(n => {
  if (n.type === 'image') return [{ sourceId: n.id, widgetName: n.widgetName, assetId: n.assetId, bounds: n.bounds }];
  if (n.backgroundAssetId) return [{ sourceId: n.id, widgetName: n.widgetName + '_Paint', assetId: n.backgroundAssetId,
    bounds: n.backgroundBounds || { x: 0, y: 0, width: n.bounds.width, height: n.bounds.height } }];
  return [];
});
const trees = { ...(reactOnly ? {} : { umg: imported.widgetTree }), react: running.modes.react.tree, native: running.modes.native.tree };
const evidence = [];
for (const e of expected) {
  const asset = assets.get(e.assetId);
  invariant(asset, 'Asset missing: ' + e.assetId);
  const matches = {};
  for (const [mode, tree] of Object.entries(trees)) {
    const candidates = tree.widgets.filter(w => w.class === 'Image' && w.resource === asset.uePath &&
      Object.keys(e.bounds).every(k => Math.abs(w[k] - e.bounds[k]) < 0.001));
    invariant(candidates.length === 1, `${mode}: source ${e.sourceId} missing or ambiguous geometry/resource binding`);
    if (mode !== 'react') invariant(candidates[0].name === e.widgetName, 'Native source identity lost');
    matches[mode] = candidates[0].name;
  }
  evidence.push({ ...e, sha256: asset.sha256, uePath: asset.uePath, matches });
}
for (const a of assets.values()) invariant(expected.some(e => e.assetId === a.id), 'Unused static asset: ' + a.id);
const report = { ok: true, source: design.source, staticAssetSlots: evidence.length, evidence,
  visualAcceptance: 'Separate visual-report.json; structural success does not imply visual acceptance' };
await fs.writeFile(path.join(directory, 'asset-audit.json'), stableStringify(report));
console.log(JSON.stringify({ ok: true, staticAssetSlots: evidence.length, source: design.source }));
