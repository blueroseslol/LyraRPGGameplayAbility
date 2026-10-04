import path from 'node:path';
import { argumentsFor, location, main, requiredFile, run } from './common.ts';

main(() => {
    const { options: o, extra } = argumentsFor(['--help', '--project', '--plugin', '--action', '--powershell']);
    if (o['--help']) {
        console.log('bridge.ts --project <root> [--plugin Plugins/ReactUMG] --action <serve|status|capture|from-figwright|generate|verify|verify-runtime|import> -- <tool arguments>');
        return;
    }
    const project = path.resolve(o['--project'] || '.');
    const plugin = location(project, o['--plugin'] || 'Plugins/ReactUMG');
    const root = path.join(plugin, 'Tools/DesignBridge');
    const action = o['--action'];
    if (['serve', 'status', 'capture'].includes(action)) {
        if (extra.includes('--project')) throw new Error('Use the wrapper --project option, not forwarded --project');
        run(process.execPath, [requiredFile(path.join(root, 'figwright/read.mjs')), action, '--project', project, ...extra], project);
    } else if (['from-figwright', 'generate', 'verify', 'verify-runtime'].includes(action)) {
        if (extra.includes('--project')) throw new Error('Use the wrapper --project option, not forwarded --project');
        run(process.execPath, [requiredFile(path.join(root, 'cli.mjs')), action,
            ...(action === 'generate' ? ['--project', project] : []), ...extra], project);
    } else if (action === 'import') {
        if (process.platform !== 'win32') throw new Error('The bundled UE importer currently requires Windows; use your project importer');
        run(o['--powershell'] || 'powershell.exe', ['-NoProfile', '-NonInteractive', '-File',
            requiredFile(path.join(root, 'run-import.ps1')), ...extra], project);
    } else throw new Error('Unknown --action; use --help');
});
