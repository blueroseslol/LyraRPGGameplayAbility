import path from 'node:path';
import { argumentsFor, compiler, location, main, requiredFile, run } from './common.ts';

main(() => {
    const { options: o, extra } = argumentsFor(['--help', '--project', '--config', '--typescript', '--emit']);
    if (o['--help']) { console.log('compile.ts --project <root> [--config tsconfig.json] [--typescript path/to/tsc.js] [--emit]'); return; }
    if (extra.length) throw new Error('Unexpected arguments after --');
    const project = path.resolve(o['--project'] || '.');
    const config = requiredFile(location(project, o['--config'] || 'tsconfig.json'));
    // No installation, config changes or emission unless explicitly requested.
    run(process.execPath, [compiler(project, o['--typescript']), '--project', config,
        ...(o['--emit'] ? ['--noEmit', 'false', '--noEmitOnError'] : ['--noEmit'])], project);
});
