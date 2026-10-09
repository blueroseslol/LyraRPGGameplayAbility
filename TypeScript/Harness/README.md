# Lyra TypeScript 自动化测试

测试逻辑在本目录，C++ 薄桥在 `Source/LyraEditor/Tests`，结果由 UE Automation 和 UnrealHarness CLI 输出。

## 运行

在 `TypeScript` 目录运行全部四组测试：

```powershell
cd D:\MatrixTA\LyraRPGGameplayAbility\TypeScript
npm test
```

依次运行 Automation Spec、Functional Test、Automation Driver、Puerts / Lyra TypeScript。
复用软链接所指 UnrealHarness 仓库的 Vitest 配置与依赖，固定目标为本 Lyra 工程；Puerts 测试前自动编译 TS。
任一组失败则命令返回非零退出码，每组输出报告目录。需已编译 LyraEditor；不会自动构建 C++。
引擎使用 UnrealHarness 的 `.harness-local.json`，也可通过 `HARNESS_ENGINE` 环境变量指定。

仅运行 Puerts 组：`npm test -- -t Puerts`。

在 Lyra 工程根目录执行：

```powershell
# 使用现有 tsconfig 与 TypeScript，类型检查整个项目，仅输出本目录测试
node TypeScript/Harness/build.cjs

# 修改 C++ 薄桥后才需要重新编译
& D:\UnrealEngine\UE_5.8\Engine\Build\BatchFiles\Build.bat LyraEditor Win64 Development "-Project=$PWD\LyraStarterGame.uproject" -WaitMutex -NoHotReloadFromIDE

node D:/MatrixTA/UnrealHarness/Tools/UnrealHarness/harness.mjs test Harness.Puerts.Lyra --engine D:/UnrealEngine/UE_5.8 --project "$PWD/LyraStarterGame.uproject" --json
```

本机链接：`Plugins/UnrealHarness` → `D:/MatrixTA/UnrealHarness/Plugins/UnrealHarness`。其他机器应按实际仓库路径重新创建链接；不要覆盖已存在的插件目录。

`Inventory` 测试真实 `ULyraInventoryItemInstance` 的标签数量累加、非正数忽略、部分扣除、超量扣除和标签隔离。`AsyncInventory` 先等待真实 Puerts Timer，再执行同样的业务测试。

每个用例创建独立的测试 JsEnv 与库存 UObject；不会调用或修改 `Main.ts`，不创建游戏 GameInstance。这里验证的是无 World 的真实 Lyra C++ 业务逻辑，不代表 Gameplay JS 环境、PIE UI 或网络复制已验收。

## 失败验证

故障注入属于进程启动参数：在运行命令后追加 `--new-process`，再追加下面任一参数，测试应失败且 CLI 返回 1。普通运行默认复用同项目空闲 Editor：

- `--engine-arg -HarnessScriptFailure`：库存初始数量断言错误。
- `--engine-arg -HarnessScriptThrow`：TS 抛异常。
- `--engine-arg -HarnessScriptReject`：Promise rejection。
- `--engine-arg -HarnessScriptTimeout`：Promise 不完成，5 秒超时并释放测试环境。

正常运行不带上述开关。CLI 的整个进程等待上限默认 300 秒，独立于脚本用例的 5 秒超时。

UE 命名空间使用 `import UE = require('ue')`。当前 `esModuleInterop` 会把 `import * as UE` 编译为属性复制，破坏 Puerts 的懒加载类型访问。
