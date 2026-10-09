// Reuse UnrealHarness's existing suite through the project's plugin link.
const { spawn } = require('node:child_process');
const { existsSync, realpathSync } = require('node:fs');
const path = require('node:path');

try {
    const projectRoot = path.resolve(__dirname, '../..');
    const plugin = realpathSync(path.join(projectRoot, 'Plugins/UnrealHarness'));
    const harnessRoot = path.resolve(plugin, '../..');
    const vitest = path.join(harnessRoot, 'node_modules/vitest/vitest.mjs');
    if (!existsSync(vitest)) throw new Error(`请先在 UnrealHarness 仓库安装依赖：${harnessRoot}`);
    const child = spawn(process.execPath, [vitest, 'run', ...process.argv.slice(2)], {
        cwd: harnessRoot,
        stdio: 'inherit',
        env: { ...process.env, HARNESS_PROJECT: path.join(projectRoot, 'LyraStarterGame.uproject') },
    });
    child.on('error', error => { console.error(error.message); process.exitCode = 1; });
    child.on('exit', code => { process.exitCode = code ?? 1; });
} catch (error) {
    console.error(`无法启动 UnrealHarness 测试：${error.message}`);
    process.exitCode = 1;
}
