// Reuse the project's tsconfig/compiler, but emit only these test files.
const ts = require('../node_modules/typescript');
const path = require('node:path');
const root = path.resolve(__dirname, '../..');
const config = ts.readConfigFile(path.join(root, 'tsconfig.json'), ts.sys.readFile);
if (config.error) throw new Error(ts.flattenDiagnosticMessageText(config.error.messageText, '\n'));
const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, root);
const program = ts.createProgram(parsed.fileNames, parsed.options);
const errors = [...parsed.errors, ...ts.getPreEmitDiagnostics(program)];
if (errors.length) {
    console.error(ts.formatDiagnosticsWithColorAndContext(errors, {
        getCanonicalFileName: f => f, getCurrentDirectory: () => root, getNewLine: () => '\n'
    }));
    process.exit(1);
}
for (const name of ['Inventory.test.ts', 'Run.ts']) {
    const source = program.getSourceFile(path.join(__dirname, name));
    if (!source || program.emit(source).emitSkipped) throw new Error(`Cannot emit ${name}`);
}
console.log('Harness TypeScript checked and emitted using project tsconfig.');
