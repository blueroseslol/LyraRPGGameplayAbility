import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { argumentsFor, compiler, location, main } from './common.ts';

main(() => {
    const { options: o, extra } = argumentsFor(['--help', '--project', '--plugin', '--config', '--typescript']);
    if (o['--help']) { console.log('doctor.ts --project <root> [--plugin Plugins/ReactUMG] [--config tsconfig.json] [--typescript path/to/tsc.js]'); return; }
    if (extra.length) throw new Error('Unexpected arguments after --');
    const project = path.resolve(o['--project'] || '.');
    const plugin = location(project, o['--plugin'] || 'Plugins/ReactUMG');
    const checks: { name: string; ok: boolean; detail: string }[] = [];
    const add = (name: string, ok: boolean, detail: string) => checks.push({ name, ok, detail });
    const [major, minor] = process.versions.node.split('.').map(Number);
    add('node', major > 24 || (major === 24 && minor >= 12), process.version);
    const projects = readdirSync(project).filter(x => x.endsWith('.uproject'));
    add('uproject', projects.length > 0, projects.join(', ') || 'No .uproject in project root');
    const config = location(project, o['--config'] || 'tsconfig.json');
    add('tsconfig', existsSync(config), config);
    add('reactumg', existsSync(path.join(plugin, 'ReactUMG.uplugin')), plugin);
    try { add('typescript', true, compiler(project, o['--typescript'])); }
    catch (e) { add('typescript', false, String(e)); }
    for (const name of ['react', 'react-reconciler', '@types/react']) {
        let found = '';
        for (const directory of ['TypeScript', '.']) {
            try {
                const req = createRequire(path.join(project, directory, 'package.json'));
                const file = req.resolve(name + '/package.json');
                found = JSON.parse(readFileSync(file, 'utf8')).version + ' @ ' + file;
                break;
            } catch { /* Try the next conventional dependency root. */ }
        }
        add(name, Boolean(found), found || 'Not found under TypeScript or project node_modules');
    }
    const toolRoot = path.join(plugin, 'Tools/DesignBridge');
    const optional = {
        projectPuerts: existsSync(path.join(project, 'Plugins/Puerts/Puerts.uplugin')),
        bridge: existsSync(path.join(toolRoot, 'cli.mjs')),
        figwrightReader: existsSync(path.join(toolRoot, 'figwright/read.mjs')),
        figwrightDependency: existsSync(path.join(toolRoot, 'node_modules/@figwright/mcp/package.json')),
        textureImporter: existsSync(path.join(toolRoot, 'run-import.ps1')),
    };
    const ok = checks.every(c => c.ok);
    console.log(JSON.stringify({ ok, project, checks, optional,
        note: 'File checks only. Engine-installed PuerTS, ABI compatibility, Figma connection and UE rendering require separate verification.' }, null, 2));
    if (!ok) process.exitCode = 1;
});
