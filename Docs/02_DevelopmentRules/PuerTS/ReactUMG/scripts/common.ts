import { existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

export function argumentsFor(allowed: string[]) {
    const raw = process.argv.slice(2);
    const split = raw.indexOf('--');
    const args = split < 0 ? raw : raw.slice(0, split);
    const extra = split < 0 ? [] : raw.slice(split + 1);
    const options: Record<string, string> = {};
    for (let i = 0; i < args.length; i++) {
        const key = args[i];
        if (!allowed.includes(key)) throw new Error('Unknown option: ' + key);
        if (key in options) throw new Error('Duplicate option: ' + key);
        if (key === '--help' || key === '--emit') { options[key] = 'true'; continue; }
        const value = args[++i];
        if (!value || value.startsWith('--')) throw new Error('Missing value: ' + key);
        options[key] = value;
    }
    return { options, extra };
}
export function location(project: string, value: string) { return path.resolve(project, value); }
export function requiredFile(file: string) {
    if (!existsSync(file) || !statSync(file).isFile()) throw new Error('Missing file: ' + file);
    return file;
}
export function compiler(project: string, explicit?: string) {
    const candidates = explicit ? [location(project, explicit)] : [
        path.join(project, 'TypeScript/node_modules/typescript/lib/tsc.js'),
        path.join(project, 'node_modules/typescript/lib/tsc.js'),
    ];
    const found = candidates.find(p => existsSync(p));
    if (!found) throw new Error('TypeScript not installed; restore project dependencies or pass --typescript <tsc.js>');
    return requiredFile(found);
}
export function run(executable: string, args: string[], cwd: string) {
    const result = spawnSync(executable, args, { cwd, stdio: 'inherit', shell: false, windowsHide: true });
    if (result.error) throw result.error;
    if (result.signal) throw new Error('Child terminated: ' + result.signal);
    process.exitCode = result.status ?? 1;
}
export function main(action: () => void) {
    try { action(); } catch (error) {
        console.error(JSON.stringify({ ok: false, error: error instanceof Error ? error.message : String(error) }));
        process.exitCode = 1;
    }
}
