# 安装与脚本入口

[返回 Skill](skill.md)

## 需要哪些依赖

已有工程优先使用现有版本与 lockfile，不把下表当作升级要求。主流程需要 Unreal、PuerTS、ReactUMG、React/renderer、TypeScript，以及 Agent 侧的 Figwright；图片对比与 DesignBridge 自动化按需启用。

| 开源项目 / 地址 | 作用与安装位置 |
| --- | --- |
| [PuerTS](https://github.com/Tencent/puerts) / [Releases](https://github.com/Tencent/puerts/releases) | UE 中运行 JS/TS；使用匹配引擎版本、平台和 JS 后端的插件及第三方库，按所选版本的 Unreal 安装说明配置 |
| [ReactUMG](https://github.com/puerts/ReactUMG) | React 到 UMG 的 renderer；接入 UE 插件、JS 模块和 typings，按该版本工程结构放置 |
| [React 与 react-reconciler](https://github.com/facebook/react) | ReactUMG 的运行依赖；安装到项目既有 JS 依赖位置，版本必须与 renderer API 匹配，不能直接套用最新版 React |
| [TypeScript](https://github.com/microsoft/TypeScript) | 项目编译器；安装在已有开发依赖中。示例 `satisfies` 要求 TS 4.9+ |
| [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) | `@types/react`、必要时 `@types/react-reconciler`；保持与现有声明/renderer 兼容 |
| [Figwright](https://github.com/awdr74100/figwright) / [插件发行包](https://github.com/awdr74100/figwright/releases) | Agent 的 MCP 服务和 Figma 开发插件；二者选择匹配版本 |
| [Node.js](https://github.com/nodejs/node) / [下载](https://nodejs.org/en/download) | Agent 侧工具运行环境；插件 scripts 中的 TS 脚本要求 Node 24.12+，与 UE 内嵌 JS 后端版本无关 |
| [npm CLI](https://github.com/npm/cli) | 通常随 Node 安装；按工程 lockfile 恢复依赖 |
| [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk) | 可选 DesignBridge 采集器的直接依赖，由其 package/lockfile 安装；直接使用 MCP 客户端无需手动安装 SDK |
| [Python](https://github.com/python/cpython) / [Pillow](https://github.com/python-pillow/Pillow) | 可选像素对比环境；现有 Python 比较脚本需要 Pillow |
| [PowerShell](https://github.com/PowerShell/PowerShell) | 可选 Windows Setup/UE 导入脚本；TS 工具本身不依赖它，调用 `.ps1` 时需要 |
| [Git](https://github.com/git/git) / [下载](https://git-scm.com/downloads) | 获取源码与固定版本；已有检出无需重克隆 |

传递依赖由锁文件管理，无需逐个手动安装。UE 与 Figma 是另外的产品前置条件，不列为开源库：安装对应 [Unreal Engine](https://www.unrealengine.com/download) 及其 C++ 工具链（需要编译插件时），安装 [Figma 桌面端](https://www.figma.com/downloads/) 并取得目标文件权限。UE Python 导入器使用引擎的 PythonScriptPlugin，不使用系统 Python 的 Pillow 环境。

## 1. 准备 UE 工程

1. 按所选 PuerTS 版本的说明安装 UE 插件/第三方依赖，启用插件，生成所需 `ue`、`puerts` 类型声明，确认简单 JS 能在有效 world 中执行。
2. 接入 ReactUMG 的插件、运行 JS 和 `react-umg` 类型声明。只复制 `.uplugin` 或安装 npm React 不构成完整接入。
3. 在已有 package.json 所在目录运行 `npm ci`（有锁文件）或 `npm install`（无锁文件）。新工程先依据 ReactUMG 版本填写 React、react-reconciler、TypeScript 和类型依赖，再锁定版本。
4. 保持一个主 tsconfig 和现有路径映射；确认 JSX、`ue`、`react-umg` 和 `react` 类型可解析，outDir 与实际 PuerTS 模块加载位置一致。

已存在的工程配置是版本依据。ReactUMG 上游仓库**不保证包含**本地扩展 `scripts/Figwright`、`jsx-props.ts` 或截图辅助模块；没有这些扩展时，使用 Figwright MCP 读取、直接编写 TSX，并沿用工程资产导入与运行方式。

## 2. 准备 Figwright

通用接入：按 [Figwright Setup](https://github.com/awdr74100/figwright#setup) 在 Agent 的 MCP 客户端注册 `@figwright/mcp`，下载匹配的 Figma 插件发行包，在桌面端导入 manifest，运行插件并验证端到端连接。选择版本后固定版本/锁文件，避免每次启动漂移。

如果已有包含 DesignBridge 扩展的 ReactUMG 检出，可在该插件根目录运行：

```powershell
./scripts/Figwright/setup-figwright.ps1
node scripts/Figwright/figwright/read.mjs serve
```

Setup 会安装工具锁定依赖并准备匹配的开发插件。仅使用 Codex 且希望修改其 MCP 注册时才添加 `-RegisterCodex`。根据脚本输出导入 manifest；若已有 relay，先检查状态，不重复启动。此路径可能包含额外几何字段补丁，不要换成原版插件后假定字段仍存在。

## 3. 使用固化 TS 脚本

文件已迁到 [Plugins/ReactUMG/scripts](../../../../Plugins/ReactUMG/scripts/)，本文不再附带脚本副本。底层工具位于 `scripts/Figwright`；TS 助手及验证入口合并于 `TypeScript/ReactUMGTest`，C++ 验证模块为 `Source/ReactUMGTest`。

这些脚本是 Agent 在宿主机运行的 CLI，不是 PuerTS 游戏脚本。Node 24.12+ 可以直接执行插件 scripts 中使用的可擦除 TS 语法；无需 ts-node、tsx 或额外 npm 安装。Node 执行时不做类型检查、不读取工程 tsconfig；`compile.ts` 会显式调用项目 tsc。见 [Node TypeScript 说明](https://nodejs.org/api/typescript.html)。

在工程根目录设定插件脚本位置；插件不在默认位置时修改 `$scripts`：

```powershell
$scripts = 'Plugins/ReactUMG/scripts'
node "$scripts/doctor.ts" --project .
node "$scripts/compile.ts" --project .
```

| 脚本 | 默认行为与边界 |
| --- | --- |
| `doctor.ts` | 只读检查工程、配置、ReactUMG、编译器与 React 依赖；输出 JSON。另列可选 PuerTS/DesignBridge 文件是否存在，不证明 ABI、Figma 连接或 UE 可运行 |
| `compile.ts` | 默认 `--noEmit`；显式 `--emit` 才写入工程配置的 outDir，编译错误时不输出。支持 `--config`、`--typescript <tsc.js>` |
| `bridge.ts` | 调用已安装的 DesignBridge 工具，支持 `--plugin <目录>`；不自动安装、不自动重试、不另建转换器。缺少扩展时明确失败 |
| `common.ts` | 内部参数与子进程辅助；参数数组传递，不拼接 shell 命令 |

共同约定：`--project` 默认当前目录；插件默认 `Plugins/ReactUMG`；编译器从 `TypeScript/node_modules` 或根 `node_modules` 查找。使用 `--help` 查看入口。失败返回非零状态；子进程退出码原样保留。脚本配置保留在插件 scripts/package.json，不改游戏 tsconfig。

### Figwright → 离线包 → 生成代码

以下仅适用于已安装 DesignBridge 扩展的工程。先读取状态，再填写真实 session、节点和 URL；不要把示例变量原样当作有效输入：

```powershell
node "$scripts/bridge.ts" --project . --action status
$session = '替换为当前 session'
$node = '替换为目标节点 ID'
$url = '替换为目标 Figma URL'
node "$scripts/bridge.ts" --project . --action capture -- --session $session --node $node --out Saved/DesignBridge/capture-new --scale 1
node "$scripts/bridge.ts" --project . --action from-figwright -- --input Saved/DesignBridge/capture-new --out Saved/DesignBridge/package-new --url $url
node "$scripts/bridge.ts" --project . --action generate -- --package Saved/DesignBridge/package-new --out TypeScript/UI/Generated --asset-root /Game/ReactUMG/Imported
node "$scripts/bridge.ts" --project . --action verify-runtime -- --package Saved/DesignBridge/package-new
```

`--` 后的参数传给原工具；相对路径以 `--project` 为基准。采集目录应为新目录，生成目标不要指向手写页面。生成器支持范围以实际实现为准，Agent 仍需根据设计选择合理 Layout。

### 导入与编译

Windows 下调用已有 UE Python 导入器，显式提供 `.uproject`、离线包和引擎目录：

```powershell
node "$scripts/bridge.ts" --project . --action import -- -Project YourProject.uproject -Package Saved/DesignBridge/package-new -Engine 'D:/UnrealEngine/YourEngine'
node "$scripts/compile.ts" --project . --emit
```

默认使用 `powershell.exe`；需要 PowerShell 7 时在 `--` 前传 `--powershell pwsh`。导入会启动 UE 并写资产，编译会写 JS，按当前任务授权使用。随后由现有游戏入口加载本次页面；本组脚本不假设工程有 ReactUMGTest 或特定截图入口。

## 4. 可选像素验证

需要 Python 图像比较时，在独立虚拟环境安装 Pillow：

```powershell
python -m venv .venv-ui
.venv-ui/Scripts/python -m pip install Pillow
```

实际版本记录到项目环境/锁文件。比较同尺寸参考图、UE 图及重构前基线，单独记录严格阈值结果。已存在截图工具时直接复用；脚本成功不代表视觉、PIE 或 Cook 通过。
