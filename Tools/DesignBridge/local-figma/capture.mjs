import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fromPluginExport } from '../src/figma.mjs';
import { invariant } from '../src/package.mjs';
const exec = promisify(execFile);
const project = fileURLToPath(new URL('../../../', import.meta.url));
const args = process.argv.slice(2), options = {};
for (let i = 0; i < args.length; i += 2) {
  invariant(['--session', '--runtime', '--out', '--resume'].includes(args[i]) && args[i + 1], 'Use --session/--runtime/--out/--resume values');
  options[args[i].slice(2)] = args[i + 1];
}
const session = path.resolve(options.session || path.join(project, 'Saved/DesignBridge/local-session'));
const runtime = path.resolve(options.runtime || path.join(project, 'Saved/DesignBridge/local-figma'));
const output = path.resolve(options.out || path.join(project, 'Saved/DesignBridge/genshin_cover_local'));
const cli = path.join(runtime, 'bin/figma-local.mjs');
async function command(...values) {
  try { return JSON.parse((await exec(process.execPath, [cli, ...values], { cwd: session, maxBuffer: 64 * 1024 * 1024 })).stdout); }
  catch (error) { if (error.stdout) return JSON.parse(error.stdout); throw error; }
}
let id = options.resume;
try {
  const binding = JSON.parse(await fs.readFile(path.join(session, '.figma-agent/binding.json'), 'utf8'));
  if (!id) {
    const health = await command('doctor');
    invariant(health.ready, 'Local transport is not ready: ' + health.checks.filter(c => c.status === 'error').map(c => c.message).join('; '));
    const exporter = await fs.readFile(new URL('../figma-plugin/main.js', import.meta.url), 'utf8');
    const config = { type: 'export', fileKey: binding.fileKey, nodeId: binding.nodeId, designId: 'genshin_cover_local', textMode: 'raster', rasterizeNodes: '' };
    const script = `const capture = {format:'designbridge-figma-export',version:1,assets:[]}; let failure;
const __DESIGNBRIDGE_LOCAL__ = {emit(m) {
 if(m.type==='asset') capture.assets.push({id:m.id,sourceNodeId:m.sourceNodeId,base64:figma.base64Encode(Uint8Array.from(m.bytes))});
 else if(m.type==='reference') capture.reference={base64:figma.base64Encode(Uint8Array.from(m.bytes))};
 else if(m.type==='complete'){capture.design=m.design;capture.source=m.source;}
 else if(m.type==='error') failure=m.text;
}};
${exporter}
await exportDesignBridge(${JSON.stringify(config)});
if(failure) throw Error(failure);
if(!capture.design || !capture.reference) throw Error('Export did not complete');
if(JSON.stringify(capture).length > 12*1024*1024) throw Error('Capture exceeds local bridge budget; split the target');
return capture;`;
    const scriptPath = path.join(session, '.figma-agent/designbridge-export.js');
    await fs.writeFile(scriptPath, script);
    const submitted = await command('run', scriptPath, '--node', binding.nodeId);
    invariant(submitted.id, submitted.error || 'Job was not accepted');
    id = submitted.id;
    await fs.writeFile(path.join(session, '.figma-agent/designbridge-receipt.json'), JSON.stringify({ id, output, fileKey: binding.fileKey, nodeId: binding.nodeId }, null, 2));
    console.log(JSON.stringify({ submitted: true, id }));
  }
  const result = await command('wait', id, '--timeout', '30');
  if (result.waitStatus !== 'completed' || !result.journalComplete) {
    console.log(JSON.stringify({ pending: true, id, state: result.waitStatus, instruction: 'Keep the plugin open. Resume with --resume ' + id + '; do not submit again.' }));
    process.exitCode = 2;
  } else {
    invariant(result.result?.ok, result.result?.error || 'Figma export failed');
    const capture = result.result.output;
    invariant(capture?.design?.source?.fileKey === binding.fileKey && capture.design.source.nodeId === binding.nodeId, 'Export provenance differs from binding');
    const raw = path.join(session, '.figma-agent/runs', id, 'designbridge-export.json');
    await fs.writeFile(raw, JSON.stringify(capture));
    const imported = await fromPluginExport(raw, output);
    console.log(JSON.stringify({ ok: true, id, output, ...imported.summary }));
  }
} catch (error) { console.error(JSON.stringify({ ok: false, id, error: error.message })); process.exitCode = 1; }
