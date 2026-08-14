## 变更状态：方向修订（2026-08-12）

> **⚠️ 方案调整**：M2 复制 Shooter→Palworld 三插件导致同名资产冲突、ShooterGame 无法使用，已删除 PalworldCore/Explorer/Maps 并移除 uproject 注册。**改为直接在 ShooterGame 上开发**，保留「搜打撤 + 分队对抗」玩法目标。**保留项**：M0 文档记录（基线/边界/验收矩阵）；M1 基线修复（`AddEntry(ItemInstance)`、`WaitDebugger` 注释、`LyraGame.Inventory.AddItemInstance` 测试、GameInstance Shutdown 释放 FJsEnv）已并入 ShooterGame 持续有效；M2 执行记录（3.1-3.8）作为「方案不可行」教训保留。**M3 按新方向重定向继续（见第 4 节）；M4-M9 已按「直接在 ShooterGame 上开发」重定向（见第 5-10 节）**。详见 proposal.md 顶部方向修订标注。

## 0. 约定

- 引擎路径：项目 `EngineAssociation` 为 `5.7`，下文命令使用 `D:/UnrealEngine/UE_5.7`；若在源码引擎下工作，替换为 `D:/UnrealEngine/UnrealEngine5`。
- Node 未加入当前 shell PATH，执行 npm 命令前需 `export PATH="/c/nvm4w/nodejs:$PATH"`（Bash）或使用完整路径 `C:/nvm4w/nodejs/npm`。
- 每个里程碑结束前，把该里程碑的静态验证（编译、typecheck）与运行时验收（Editor、Cook、PIE、联机）分别记入 1.3 的验收矩阵；未运行项必须显式标注为未验证。
- 「需要 Unreal Editor」的任务不得以编译通过替代验收。

## 1. 里程碑 M0：基线与实施护栏

- [x] 1.1 在 `D:/MatrixTA/LyraRPGGameplayAbility` 记录主仓库及嵌套插件仓库（`Plugins/Puerts`、`Plugins/EasyEditorPlugin` 为符号链接，需单独确认）的 `git status --short`，建立 `TypeScript/Main.ts`、`openspec/config.yaml`、`Docs/` 等用户既有修改的不可覆盖清单（记录于 `openspec/changes/add-palworld-gamefeature/baseline-record.md`）；验证：再次运行 `git status --short` 比对，无需 Unreal Editor。
- [x] 1.2 将 `openspec/changes/add-arpg-moba-gamefeatures` 标记为被本变更取代（在其 `proposal.md` 顶部加入取代说明并注明本变更名），不执行 archive（其 delta 规格从未实施，归档会污染主规格）；验证：文件内容评审，无需 Unreal Editor。
- [x] 1.3 在 `openspec/changes/add-palworld-gamefeature/` 建立本变更的验收矩阵（`acceptance-matrix.md`），列出 C++ 编译、TypeScript typecheck、Automation、Editor 资产、Cook/Stage、Standalone、Dedicated Server、双客户端八列，并为 Palworld 与原 Shooter 回归各留一行；验证：矩阵结构评审。
- [x] 1.4 在 `openspec/changes/add-palworld-gamefeature/` 记录实施边界矩阵（`implementation-boundaries.md`）：C++（必须）、TypeScript（编排与 UI）、Primary Data Asset、视觉资产、第三方模板各自的职责与不越界规则，依据 design.md 决策 8；验证：文档评审。

## 2. 里程碑 M1：Lyra 基线缺陷修复（阻塞后续全部里程碑）

- [x] 2.1 在 `Source/LyraGame/Inventory/LyraInventoryManagerComponent.cpp` 实现 `FLyraInventoryList::AddEntry(ULyraInventoryItemInstance*)`，与既有 `AddEntry(ItemDef, StackCount)` 保持一致的子对象注册、`MarkItemDirty` 与消息广播语义；验证：编译通过 + 新增 `LyraGame.Inventory.AddItemInstance` Automation 测试覆盖「加入后可查询到实例」「StatTags 保持」两个断言。
- [x] 2.2 在 `Source/LyraGame/Inventory/LyraInventoryManagerComponent.cpp` 补齐 `AddItemInstance` 的公开入口，使 `UPickupableStatics::AddPickupToInventory` 的 `Instances` 分支不再走到未实现路径；验证：扩展同组 Automation 测试。
- [x] 2.3 在 `Source/LyraGame/System/LyraGameInstance.cpp:94` 注释 `GameScript->WaitDebugger()`（用户决定采用直接注释方案，不做配置化），使无调试器环境下 Dedicated Server 启动不阻塞；验证：编译通过，并在无调试器环境下启动 Dedicated Server 观察不阻塞（联机验收，记入矩阵）。
- [ ] 2.4 修正 `Config/DefaultPuerts.ini`：移除或修正指向不存在的 `Developer/TypeScript/tsconfig.json` 的注册项，并把项目根 `tsconfig.json`（实际编译 `TypeScript/Main.ts` 者）加入 `TypeScriptConfigPaths`；验证：INI 解析成功，编辑器启动无缺失路径告警，需要 Unreal Editor。**（2026-08-12 已解决：用户授权恢复 Puerts 设置，移除 EasyEditorPlugin 迭代加入的三条 `Developer/TypeScript/*` TypeScriptConfigPaths，回落原生默认 `tsconfig.json`）**
- [ ] 2.5 同步 `TypeScript/Main.ts` 与 `Content/JavaScript/Main.js`：确认源码为期望状态后重新构建，使产物不再执行源码中已注释的 `GameplayRuntime` 实例化；验证：在项目根执行 `npm run typecheck` 与 `npm run build`，比对产物内容。**（用户否决：`Content/JavaScript` 为构建自动生成产物，不手动改动/提交；产物由用户构建流程管理，不再实施）**
- [x] 2.6 编译 LyraGame 完整变更；验证：`D:/UnrealEngine/UE_5.7/Engine/Build/BatchFiles/Build.bat LyraEditor Win64 Development D:/MatrixTA/LyraRPGGameplayAbility/LyraStarterGame.uproject -WaitMutex`，不以 Live Coding 结果替代完整编译。
- [x] 2.7 运行 M1 的 Automation 测试；验证：`D:/UnrealEngine/UE_5.7/Engine/Binaries/Win64/UnrealEditor-Cmd.exe D:/MatrixTA/LyraRPGGameplayAbility/LyraStarterGame.uproject -NullRHI -ExecCmds="Automation RunTests LyraGame.Inventory;Quit" -unattended -nopause`。

## 3. 里程碑 M2：三插件复制与命名空间迁移

- [x] 3.1 复制 `Plugins/GameFeatures/ShooterCore/` 为 `Plugins/GameFeatures/PalworldCore/`，重命名 `.uplugin`、`Source/ShooterCoreRuntime/` 为 `Source/PalworldCoreRuntime/`，同步修改 `Build.cs` 模块名、`IMPLEMENT_MODULE` 与所有 `SHOOTERCORERUNTIME_API` 宏；**并重命名全部 12 个类（`Lyra*`/`AimAssist*`/`AssistProcessor`/`Elim*Processor`/`TDM_PlayerSpawningManagmentComponent`/`ControlPointStatusMessage` → `Pal*` 前缀）及对应头文件与 `.generated.h` include——两个模块同时加载时同名 UClass 会 FName 冲突，类名重命名是必须项**；**并将三个 Palworld 插件注册进 `LyraStarterGame.uproject` 的 Plugins 列表（否则 UBT 的 `ConfigureGameFeaturePlugins()` 会 ignore 新 GameFeature 模块，不编译）**；验证：`Build.bat LyraEditor Win64 Development ... -WaitMutex` 编译通过。
- [x] 3.2 复制 `Plugins/GameFeatures/ShooterExplorer/` 为 `Plugins/GameFeatures/PalworldExplorer/`（纯内容插件，无 Source），`.uplugin` 依赖改为 `PalworldCore`；验证：JSON 解析成功，Plugin Browser 可识别，需要 Unreal Editor。
- [x] 3.3 复制 `Plugins/GameFeatures/ShooterMaps/` 为 `Plugins/GameFeatures/PalworldMaps/`（纯内容插件），`.uplugin` 依赖改为 `PalworldCore`；验证：同 3.2。
- [x] 3.4 在三个插件的 `Config/Tags/*.ini` 中把玩法专属 Tag 由 `ShooterGame.*` 迁移为 `Palworld.*`；`InputTag.*`、`HUD.Slot.*` 等跨玩法通用 Tag 沿用 ShooterCore 既有定义，不重复注册；验证：启动 Editor 检查无重复定义/缺失 GameplayTag 日志，需要 Unreal Editor。**（用户决策：玩法专属 Tag 保留原名，ini 原样复制定义——`.uasset` 内 Tag 值为硬编码字符串，命令行/内置工具无法批量替换，保留原名使复制资产零改动即可独立运行；新增玩法 Tag（如 M5 的 `Palworld.GamePhase.*`）统一使用 `Palworld.*` 前缀，不修改旧名定义）**
- [x] 3.5 在 Unreal Editor 中对三个 Palworld 插件的 Content 执行资产重定向与 Fix Up Redirectors，确保 Palworld 资产不再引用 ShooterCore/ShooterExplorer/ShooterMaps；验证：引用审计（Reference Viewer 或 `-run=ResavePackages` 报告）显示零跨插件引用，需要 Unreal Editor。**（执行记录：① 用 Python `rename_assets` 将四个 GameFeatureData 资产重命名为插件名约定（`/PalworldCore/ShooterCore`→`/PalworldCore/PalworldCore` 等），修复插件注册失败；② 用 Python `reparent_blueprint` 将 7 个引用旧类的蓝图重定向到 `PalworldCoreRuntime` 新类；③ 用户决策：删除 Palworld 用不到的 Shooter 特有资产——Accolades 连杀播报、ControlPoint 据点模式、AimAssist 瞄准辅助测试、`B_Hero_ShooterMannequin`、`B_TeamSpawningRules`、`L_ShooterGym`/`L_ShooterPerf`/`L_StateTree_FollowTest`/`L_FiringRange_WP` 测试地图、Accolades UI，后续如有需要再从 ShooterCore 手动移植；④ **更正**：此前的 4 参数 `rename_referencing_soft_object_paths(asset, old, new, bCheck)` 调用在 UE 5.7 不存在（正确签名 `(packages, asset_redirector_map)`），当时异常被吞、实际未生效，此前「grep 审计零残留」不实；本轮改用正确签名 + `unreal.SoftObjectPath.import_text()` 构造 FSoftObjectPath 映射表，处理主内容 790 个含引用包，修复简单软引用（如 `NS_CapturePointCounter` 66→0、`EQS_Tester`、`B_AbilitySpawner`）；⑤ 修复 Duplicate PrimaryAssetID（19+ 条，含编辑器「Duplicate Asset ID Map」弹窗）：13 个主数据资产重命名（`B_ShooterGame_Elimination`→`B_PalworldGame_Elimination`、3 个 `LAS_ShooterGame_*`→`LAS_PalworldGame_*`、8 个 Playlist/LobbyBackground/测试 Experience）；地图不重命名（World Partition 脚本 rename 有损坏 ExternalActors 风险），改为取消 PalworldMaps/PalworldExplorer GF 的 `Map` 类型注册；删除损坏的 `PalworldMaps_Label`（PrimaryAssetLabel，AssetBundleData 为保护字段且文本损坏）并移除其 `PrimaryAssetLabel` 注册；删除 PalworldCore GF 的 `GameFeatureAction_DataRegistry`（指向已删 `AccoladeDataRegistry`）；PATS 清理（移除 `Accolades` 目录、`/ShooterCore/Input/Configs`→`/PalworldCore/Input/Configs`）。验证：完整编辑器会话 8 插件全部 Registered、零 AssetBundleEntry/零 Duplicate/零缺失资产；⑥ **残留引用（用户决策 2026-08-12：现阶段不剥离 Shooter 引用，后续阶段手动修复）**：a) **Palworld 关卡引用了 ShooterGame 关卡的 WorldPartition 外部文件**——三张 Palworld 地图（关卡）`L_Expanse`/`L_Convolution_Blockout`/`L_Expanse_Blockout` 的 `.umap` WorldPartition 通过 `/ShooterMaps/__ExternalActors__/Maps/<MapName>/<Hash>` 引用 ShooterGame 地图的外部文件（每张 .umap 各 5 处；已核实 L_Expanse.umap 引用 `/ShooterMaps/__ExternalActors__/Maps/L_Expanse/9V/12/8YX9S0D4OVPOFJU6NWOIY`），而 PalworldMaps 自带的 `__ExternalActors__`/`__ExternalObjects__` 外部文件副本（共含约 3 万处 `/ShooterMaps/Maps/*` 引用：L_Expanse ~2.07 万、L_Convolution_Blockout ~0.39 万、L_Expanse_Blockout ~0.54 万）因地图未指向它们而处于未被引用状态，`L_ShooterFrontendBackground.umap` 自身 168 处；b) 主内容残余的子对象路径（`:MovieScene_0...DisplayName`）、硬类引用（`TSubclassOf`，BT/蓝图）、Niagara 元数据字符串——`rename_referencing_soft_object_paths` 只做精确 FSoftObjectPath 匹配，无法脚本修复；c) 外部文件无法脚本处理的原因：加载 ExternalActor 包触发 UE 5.7 异步加载器原生断言崩溃（`FAsyncPackage2::MoveConstructedObjectsToPhase2` / `RF_NeedLoad`），需在编辑器内处理；修复路径：后续阶段（M2 3.7 停用 Shooter 时，或 M4 重建地图）在编辑器用 Replace References + 加载重存逐类清理。**注意：`get_assets_by_path`/`list_assets` 返回数组在 Python 绑定中悬空（迭代即引擎退出），批量枚举需用 `scan_files_synchronous` + 文件清单硬编码绕过；`rename_referencing_soft_object_paths` 的映射表需用 `import_text` 构造 `FSoftObjectPath` 对象（纯字符串 dict 与 `SoftObjectPath("path")` 均不生效）**）**
- [ ] 3.6 回归验证原 Shooter 三件套未被破坏：启动原 ShooterCore Elimination Experience 完成一局；验证：单客户端 PIE + Standalone，记入验收矩阵的「原 Shooter 回归」行，需要 Unreal Editor。
- [ ] 3.7 验证 Palworld 插件可独立运行：停用 Shooter 三插件后启动 Palworld Experience；验证：需要 Unreal Editor，对应 `palworld-gamefeature-shells` 的「仅启用 Palworld 玩法」场景。
- [ ] 3.8 **（推迟，用户决策 2026-08-12）** 手动修复残留 `/Shooter*` 跨插件引用：① **Palworld 关卡的 WorldPartition 指向 ShooterGame 地图的外部文件**——三张 Palworld 地图 `L_Expanse`/`L_Convolution_Blockout`/`L_Expanse_Blockout` 的 `.umap` 需把 WorldPartition 引用从 `/ShooterMaps/__ExternalActors__/Maps/<MapName>/` 改指 `/PalworldMaps/__ExternalActors__/Maps/<MapName>/`（使地图指向自身副本），同时把 PalworldMaps 的 `__ExternalActors__`/`__ExternalObjects__` 副本内部的 `/ShooterMaps/Maps/<MapName>` 改指 `/PalworldMaps/Maps/<MapName>`（约 3 万处），`L_ShooterFrontendBackground.umap`（168 处）同理——需在编辑器加载地图后执行 Replace References / 重存（脚本无法处理：加载 ExternalActor 包触发 UE 5.7 异步加载器原生断言崩溃）；② 主内容子对象路径（`:MovieScene_0...DisplayName` 等）、硬类引用（`TSubclassOf`）、Niagara 元数据字符串——`rename_referencing_soft_object_paths` 只做精确 FSoftObjectPath 匹配，无法脚本修复；③ PalworldCore GF 的 GameFeatureAction 仍引用 ShooterCore 资产（`B_AimAssistTargetManager`/`B_HandleShooterReplays`/`B_EliminationFeedRelay`/`IMC_ShooterGame`）——其中 `B_AimAssistTargetManager` 等指向已删玩法，需在编辑器删除或改指；执行时机：M2 3.7 停用 Shooter 前，或 M4 重建 PalworldMaps 地图时，逐一用编辑器工具清理并回归。

## 4. 里程碑 M3：GameFeature TypeScript 构建与生命周期（重定向到 ShooterGame，2026-08-12）

> **最终状态说明（2026-08-12）**：已迁移到**原生 PuerTS**——GameFeature TS 位于 `TypeScript/GameFeatures/`，由**根 `tsconfig.json`** 编译到 `Content/JavaScript/GameFeatures/`（匹配 4.3 staging）；npm 工作区在**项目根**（`package.json` + `node_modules/typescript`）；**已移除 EasyEditorPlugin**（解除链接、清除 `PuertsRuntimePlugin` 依赖、`@matrix/puerts-runtime` 引用）；**已恢复 `Config/DefaultPuerts.ini`**（移除 EasyEditorPlugin 迭代加入的 `Developer/TypeScript/*` TypeScriptConfigPaths，回落原生默认 `tsconfig.json`）。

- [x] 4.1 原生 TS 构建：`TypeScript/GameFeatures/**` 由根 `tsconfig.json` 编译到 `Content/JavaScript/GameFeatures`（无需独立 gamefeatures tsconfig）；验证：`npm run typecheck`（项目根）通过。**（已实施：根 tsconfig `include: ["TypeScript/**/*"]` 覆盖 GameFeatures）**
- [x] 4.2 项目根 `package.json` 的 `build` 与 `typecheck` 脚本指向根 `tsconfig.json`，不改变其既有产出（Main.js）；验证：在**项目根**执行 `npm run typecheck` 与 `npm run build`。
- [x] 4.3 PuerTS 脚本打包 staging：在 `Config/DefaultGame.ini` 的 `[/Script/UnrealEd.ProjectPackagingSettings]` 添加 `+DirectoriesToAlwaysStageAsNonUFS=(Path="Content/JavaScript")`，使整个 `Content/JavaScript/`（Main.js、GameFeatures/、puerts 运行时库）以 NonUFS 松散文件进包、保留相对结构；**不再在 `LyraGame.Build.cs` 用 RuntimeDependencies**（打包设置覆盖面更完整且无需 C++ 改动）；验证：编译通过，M9 的 Cook/Stage 检查确认 `Content/JavaScript/` 产物存在。
- [x] 4.4 实现 GameFeature 脚本模块的注册、激活状态重放、幂等激活与对称释放（含 DisposableScope 释放委托、Timer 与弱 World 引用），逻辑可脱离 UE 运行时测试；验证：`npm run typecheck` + TypeScript contract tests 覆盖「重复激活」「重复停用」「VM 重启后重建一次」（已实施：`TypeScript/GameFeatures/` 15 个 contract tests 全部通过）。
- [x] 4.5 以最小方式接入 `TypeScript/Main.ts`（保留用户既有代码，只增加一次 bootstrap 调用）；验证：`npm run typecheck`，并在 PIE 多实例下确认每个 GameInstance 独立启动一次，需要 Unreal Editor。**（已实施：`TypeScript/Main.ts` 仅新增一行 `BootstrapGameFeatures(GameInstance)`；新增 `TypeScript/GameFeatures/Bootstrap.ts` 作为 UE 引导层——唯一 import `ue`/`puerts` 的文件，构建 `LifecycleAdapters`（World 惰性弱引用、`K2_SetTimerDelegate`+`puerts.toDelegate` 定时器、`puerts.on/off` 事件总线），模块级 `RebuildGuard` 保证同一 VM 代数只引导一次（PIE 多实例各自独立 VM），并导出 `ShutdownGameFeatures()` 供 `GameInstance::Shutdown` Reset 前停用清理；`npm run typecheck` 通过；**PIE 多实例已验证：单实例 + 2 个 Standalone 共 6 个 GameInstance，每个恰好激活一次、无重复引导**）**
- [x] 4.6 为 ShooterGame 建立 GameFeature TS 入口（activate/deactivate 入口 + 服务组装根，替代原 Palworld 内容插件入口）；验证：`npm run typecheck`，停用后作用域内无残留注册。**（已实施：`TypeScript/GameFeatures/Shooter/`——`CreateShooterGameFeature()` 在 Activate 时经 `ServiceRegistry` 组装服务并挂到 Ctx 作用域、订阅 `GameplayRuntime.Start` 事件，Deactivate 由生命周期对称释放；`RegisterShooterGameFeatures()` 供 bootstrap 注册；新增 `Tests/ShooterContractTests.ts` 7 个测试覆盖服务组装/释放、事件拆除、重复注册幂等、激活中注销对称释放、ServiceRegistry 覆盖/逆序释放/释放后忽略注册，全部通过；`npm run typecheck` 通过）**

## 5. 里程碑 M4：区域传送与玩家区域状态（重定向到 ShooterGame，2026-08-12；二次修订 2026-08-13 复用 Lyra 传送门）

> **方向修订**：M2 已删除 Palworld 三插件。M4 改为**直接在 ShooterGame 上开发**——C++ 落点为 `Plugins/GameFeatures/ShooterCore/Source/ShooterCoreRuntime/`（类前缀 `Lyra*`，沿用该模块既有命名），Automation 测试前缀为 `ShooterCore.*`，地图落点为 `ShooterMaps`，TS 编排落点为 `TypeScript/GameFeatures/Shooter/Services/`（沿用 M3 纯逻辑 + contract tests 模式）。新玩法 Tag 统一使用 `ShooterGame.*` 前缀（沿袭 M3 方向修订约定）。
>
> **二次修订（2026-08-13，复用 Lyra 现成传送门）**：下方 5.1–5.5 的自研传送实现（C++ `ALyraTravelDestination` / `ULyraTravelStatics` / `ELyraTravelResult` / `ULyraZoneStateComponent` / `ALyraTravelInteractionPoint`，TS `TravelCoordinator` / `TravelGateway` / `TravelTypes`）已**全部删除**，改为复用 Lyra 现成传送门 Actor `B_Teleport`（`ShooterCore/Content/Blueprint/B_Teleport` + `GCNL_Teleporter_Activate` GameplayCue），**其接入由用户处理**。5.1–5.5 的「已实施」记录作废，仅保留 git 历史。
>
> **待定**：玩家当前区域 Tag 复制（原 `ULyraZoneStateComponent` 职责）是否补回一个最小 C++ 组件，取决于 `B_Teleport` 的接入方式——若 `B_Teleport` 不提供「按区域/队伍寻址 + 区域状态复制」，再单独补回该组件（保留原「仅区域 Tag 复制 + OnRep 广播」思路）。

- [x] 5.1 在 `Plugins/GameFeatures/ShooterCore/Source/ShooterCoreRuntime/` 实现传送目标点 Actor `ALyraTravelDestination`，携带区域 Tag，基地点另带队伍标识（`AreaTag` / `TeamId`（0=不限队伍，>0=队伍基地）/ `DisplayName`）；验证：编译通过 + 新增 `ShooterCore.Travel.Destination` Automation 测试覆盖「按 Tag 查找」「按队伍查找」。**（已实施：`Public|Private/Travel/LyraTravelDestination.*`；Automation 测试通过——按 Tag 命中、未知 Tag 返回空、按队伍精确匹配（`FindTeamBase` 只认 `TeamId` 精确相等，通用区域 TeamId=0 不算任何队基地）、未配置队伍返回空）**
- [x] 5.2 在同模块实现 Authority 安全的传送接口 `ULyraTravelStatics`（静态工具类 + `ELyraTravelResult` 枚举），函数体内校验 World、目标 Actor、Authority、目标点存在性与队伍归属，返回可诊断枚举（Success/NotAuthority/InvalidTarget/UnknownDestination/NoTeam）；验证：新增 `ShooterCore.Travel.Authority` Automation 测试覆盖非 Authority 拒绝、未知目标、无队伍、成功四条路径。**（已实施：`Public|Private/Travel/LyraTravelTypes.h`（枚举）+ `LyraTravelStatics.*`（`FindDestination`/`FindTeamBase`/`TeleportToArea`/`GetCurrentZoneTag`）；Automation 测试通过——无控制器 InvalidTarget、`SetRole(ROLE_SimulatedProxy)` 模拟客户端 NotAuthority、未知 Tag UnknownDestination、队伍受限目标无队伍 NoTeam、通用区域 Success）**
- [x] 5.3 在 PlayerState 侧扩展玩家当前区域 Tag 的复制状态 `ULyraZoneStateComponent`（挂载于 PlayerState 的组件，不修改 `ALyraPlayerState`；ReplicatedUsing=OnRep + GameplayMessage 广播）；验证：编译通过 + Automation 测试覆盖「设置/读取」与「Pawn 更换后区域标识保持」。**（已实施：`Public|Private/Travel/LyraZoneStateComponent.*`，`SetIsReplicatedByDefault(true)`，`DOREPLIFETIME(CurrentZoneTag)`，OnRep 时经 `GameplayMessageSubsystem` 广播 `ShooterGame.Zone.Changed` 频道 `FLyraZoneChangedMessage`（`HasInstance` 守卫，无 GameInstance 环境跳过）；Automation 测试通过——初始为空、设置可读、模拟 Pawn 更换后标识保持、重复设置 no-op）**
- [x] 5.4 在 TypeScript 实现传送编排服务 `TravelCoordinator`（`TypeScript/GameFeatures/Shooter/Services/`）：判定谁能传、传到哪，非 Authority 快速失败，并调用 5.2 的 C++ 接口、按返回码分支；验证：`npm run typecheck` + contract tests 覆盖非 Authority 快速失败与 C++ 返回码分支。**（已实施：`TravelTypes.ts`（`TravelResult` 枚举镜像 `ELyraTravelResult` + TS 侧 `SameZone`）、`TravelGateway.ts`（接口 + `CreateNullTravelGateway` 保守空网关）、`TravelCoordinator.ts`（非 Authority 快速失败 → 同区域 `SameZone` no-op → 调 C++ 网关按返回码分支）；`ShooterFeature` Activate 注册 `travel.coordinator` 服务（`CreateTravelGateway` 可注入，Bootstrap 注入真实 UE 网关）；Bootstrap `CreateUeTravelGateway` 经 `GameplayStatics.GetPlayerController` 惰性解析 PC + `ULyraTravelStatics` 权威接口；`TypeScript/GameFeatures/UeDeclarations.d.ts` 临时声明新 C++ 类（PuerTS 重新生成后可删）；contract tests 6 个通过，typecheck 通过）**
- [x] 5.5 C++ 基座：实现交互式传送入口 `ALyraTravelInteractionPoint`（直接实现 `IInteractableTarget`，而非继承拾取专用的 `ALyraWorldCollectable`——传送点不是可拾取物），`GatherInteractionOptions` 暴露 `FInteractionOption`（`InteractionAbilityToGrant` + 文本），`CustomizeInteractionEventData` 把 `DestinationAreaTag` 写入事件 `TargetTags` 供 BP 能力读取；使用与拾取相同的交互输入（`InputTag.Ability.Interact`）；验证：编译通过。**（剩余需 Unreal Editor：创建 `GA_Travel` 资产并配置 `InteractionAbilityToGrant`、地图布置交互点、PIE 单客户端「按 F 触发传送」）**
- [ ] 5.6 在 `ShooterMaps` 的 World Partition 地图（沿用 `L_Expanse`）中用 `B_Teleport` 布置两队基地与至少两个可探索区域的传送点，并确认服务器端流送配置允许按各客户端位置流送；验证：需要 Unreal Editor（与用户确认 `B_Teleport` 接入方式后执行）。
- [ ] 5.7 双客户端验收区域隔离与位置复制：A 传送进副本区域、B 留在其队伍基地；验证：Dedicated Server + 2 客户端，确认双方位置正确复制、无 CharacterMovement 回弹、任一方的区域加载不强制另一方加载，对应 `world-zone-travel` 的分散区域场景。

## 6. 里程碑 M5：局内 Phase 与全局局时

- [ ] 6.1 在 ShooterCore 插件 `Config/Tags/` 定义 Phase Tag 层级：`ShooterGame.GamePhase.Warmup`、`.Playing`、`.Playing.Free`、`.Extract`、`.MatchEnd`（Extract 为 Playing 的兄弟）；验证：Editor 启动无 Tag 冲突，需要 Unreal Editor。
- [ ] 6.2 创建继承 `ULyraGamePhaseAbility` 的 Phase 类探针（优先保存型 TypeScript Blueprint），验证父类、`GamePhaseTag` CDO 默认值、类软引用与编辑器重启后引用有效；验证：保存后关闭并重启 Unreal Editor，需要 Unreal Editor。
- [ ] 6.3 对 6.2 探针执行 Development Cook/Stage 并在 Standalone 与 Dedicated Server 加载；验证：`D:/UnrealEngine/UE_5.7/Engine/Build/BatchFiles/RunUAT.bat BuildCookRun -project=D:/MatrixTA/LyraRPGGameplayAbility/LyraStarterGame.uproject -noP4 -platform=Win64 -clientconfig=Development -build -cook -stage -pak -skiparchive`。
- [ ] 6.4 若 6.3 失败，改用无 Event Graph 的 Phase GA Blueprint 配置壳（只填 `GamePhaseTag`），规则保留在 TypeScript Coordinator；验证：重复 6.2-6.3 并在验收矩阵记录最终采用路径。
- [ ] 6.5 在 TypeScript（`TypeScript/GameFeatures/Shooter/Services/`）实现回合协调器，仅 Authority 驱动 Warmup→Playing→Extract→MatchEnd，并按模式配置决定是否注册局时计时器；验证：`npm run typecheck` + contract tests 覆盖正常流程、重复结束、客户端请求推进被拒三条路径。
- [ ] 6.6 在 GameState 侧复制「局时结束的服务器时间戳」，客户端按该时间戳本地插值显示剩余时间；验证：编译通过 + Automation 测试覆盖时间戳复制。
- [ ] 6.7 实现 Extract 阶段的按队伍分流撤离：遍历所有 PlayerState，各自传送回本队基地；验证：`npm run typecheck` + contract tests。
- [ ] 6.8 在 ShooterCore 上创建自由模式与计时模式两套 ExperienceDefinition 与 UserFacingExperience 配置实例；验证：Asset Manager 可解析 Primary Asset ID 且无缺失引用，需要 Unreal Editor。
- [ ] 6.9 双客户端验收阶段顺序与局时一致性：两名玩家分处不同区域时观察到一致的阶段顺序与剩余局时；验证：Dedicated Server + 2 客户端，对应 `match-phase-lifecycle` 的全局局时复制场景。
- [ ] 6.10 双客户端验收撤离分流：计时模式局时耗尽后两队玩家各自被传回本队基地；验证：Dedicated Server + 2 客户端（两队各一名）。
- [ ] 6.11 验收自由模式不触发强制撤离，且界面不展示局时倒计时；验证：Standalone + PIE。
- [ ] 6.12 验收晚加入恢复：客户端在 Playing 阶段加入后展示当前阶段与剩余局时，不在本地重启 Warmup；验证：Dedicated Server + 至少 2 客户端。

## 7. 里程碑 M6：装备槽、属性与伤害

- [ ] 7.1 在 `ShooterCoreRuntime` 实现装备槽组件（挂载于 PlayerState），槽位以 GameplayTag 寻址，状态使用 `FFastArraySerializer` 复制，物品实例作为子对象注册；验证：编译通过 + 新增 `ShooterCore.Equipment.Slots` Automation 测试。
- [ ] 7.2 在 ShooterCore 插件 `Config/Tags/` 定义槽位 Tag：`ShooterGame.Equip.Slot.Head`、`.Body`、`.Legs`、`.Accessory1`、`.Accessory2`；验证：Editor 启动无 Tag 冲突，需要 Unreal Editor。
- [ ] 7.3 在 `ShooterCoreRuntime` 实现装备槽 Inventory Fragment，声明物品可进入的槽位 Tag 与其属性效果类；验证：编译通过 + Automation 测试覆盖「装备到不匹配槽位被拒绝」。
- [ ] 7.4 在 `ShooterCoreRuntime` 实现 `UPalWorldAttackDefenseSet`（仅含攻击与防御两项属性；**复制 `Source/LyraGame/AbilitySystem/Attributes/LyraCombatSet.*` 后重命名修改**；生命值继续用 `ULyraHealthSet`，不重复定义）；验证：编译通过 + Automation 测试覆盖属性复制。
- [ ] 7.5 实现 Authority 安全的装备/卸下写入：装备时施加属性效果并记录句柄，卸下时按句柄精确移除；写入前二次校验 Authority 与槽位合法性并返回可诊断枚举；验证：新增 `ShooterCore.Equipment.Authority` Automation 测试覆盖非 Authority 拒绝、槽位不匹配、已占用槽位更替三条路径。
- [ ] 7.6 实现 Pawn 重生后按当前槽位内容重新施加属性效果，且施加前先移除已记录旧句柄以保证幂等；验证：Automation 测试覆盖「连续重建三次后属性数值不累积」。
- [ ] 7.7 在 `ShooterCoreRuntime` 实现 `UPalWorldAttackDefenseExecution`（捕获攻击（Source）与防御（Target）属性，沿用队伍许可乘数与距离/材质衰减，最终值取 `Max(..., 0)`；**复制 `Source/LyraGame/AbilitySystem/Executions/LyraDamageExecution.*` 后重命名修改**，不修改原 `ULyraDamageExecution`）；验证：编译通过 + 新增 `ShooterCore.Damage.Execution` Automation 测试覆盖攻击提升、防御提升、防御高于攻击取零三个场景。
- [ ] 7.8 新增/配置指向 `UPalWorldAttackDefenseExecution` 的 `GE_Damage_*` 资产；原 Shooter 的 `GE_Damage_*` 保持指向 `ULyraDamageExecution`；验证：需要 Unreal Editor。
- [ ] 7.9 新增装备槽变更的 GameplayMessage Tag 与消息结构，供 UI 订阅；验证：编译通过。
- [ ] 7.10 在 TypeScript 实现装备操作意图提交与前置校验，写入经 7.5 的 C++ 边界；验证：`npm run typecheck` + contract tests。
- [ ] 7.11 双客户端验收装备属性：装备后属性提升并复制、卸下后精确还原、多件装备互不干扰；验证：Dedicated Server + 2 客户端，对应 `equipment-slots-and-attributes` 全部场景。
- [ ] 7.12 回归验收原 Shooter 伤害不变：在 ShooterCore Experience 中射击命中，伤害结算与本变更前一致；验证：需要 Unreal Editor，记入验收矩阵的「原 Shooter 回归」行。

## 8. 里程碑 M7：PVP、死亡掉落与按队伍复活

- [ ] 8.1 在 ShooterCore 的搜打撤 Experience 中挂载队伍创建组件（复用 `B_TeamSetup_TwoTeams` 的人数平衡策略）与队伍显示资产；验证：需要 Unreal Editor，2-4 名玩家场景中队伍人数差不超过 1。
- [ ] 8.2 在 `ShooterCoreRuntime` 实现死亡掉落：监听死亡开始，读取背包全部物品实例，生成可拾取容器并清空背包，装备槽不变；背包为空时不生成容器；验证：编译通过 + 新增 `ShooterCore.Death.Drop` Automation 测试覆盖「有物品掉落」「空背包不生成」「装备槽保留」。
- [ ] 8.3 配置尸包容器资产（继承 ShooterCore 的可拾取基类），使其可被其他玩家拾取；验证：需要 Unreal Editor。
- [ ] 8.4 在 `ShooterCoreRuntime` 实现按队伍基地过滤的出生点选择组件，覆写 `OnChoosePlayerStart`：按 `ALyraPlayerStart::StartPointTags` 的队伍标记过滤本队基地点位，再选未占用者；玩家无队伍时返回 nullptr 交由上游回退；验证：编译通过 + 新增 `ShooterCore.Spawn.TeamBase` Automation 测试覆盖「按队伍过滤」「无队伍回退」。
- [ ] 8.5 在 ShooterCore 的搜打撤 Experience 中挂载 8.4 的出生点组件（替代复制来的 TDM「离敌人最远」组件，两者并存不互相修改）；验证：需要 Unreal Editor。
- [ ] 8.6 为两队基地布置带队伍标记的 PlayerStart；验证：需要 Unreal Editor。
- [ ] 8.7 配置重生流程（复用 `GA_AutoRespawn` 与重生倒计时 UI）指向队伍基地；验证：需要 Unreal Editor，PIE 单客户端确认死亡后在本队基地重生。
- [ ] 8.8 双客户端验收 PVP 分队语义：队友互射零伤害、敌队正常伤害、基地内可交战（无免伤保护区）；验证：Dedicated Server + 2 客户端（两队各一名），对应 `combat-teams-and-death` 分队伤害语义全部场景。
- [ ] 8.9 双客户端验收风险回报闭环：A 击杀 B → B 尸包出现且 A 可拾取（物品 StatTags 保持）→ B 在本队基地重生且装备仍在；验证：Dedicated Server + 2 客户端。
- [ ] 8.10 双客户端验收两队复活隔离：分属两队的玩家先后死亡，各自在本队基地复活，不出现在对方基地；验证：Dedicated Server + 2 客户端。

## 9. 里程碑 M8：交互、拾取与 UI

- [ ] 9.1 将交互输入键位改为 F（修改 ShooterCore 的输入映射资产，Tag 沿用 `InputTag.Ability.Interact`）；验证：需要 Unreal Editor，PIE 确认按 F 触发交互。
- [ ] 9.2 配置可拾取物品资产（继承 ShooterCore 的可拾取基类，使用能力授予交互者模式）；验证：需要 Unreal Editor，PIE 确认拾取进背包。
- [ ] 9.3 实现带 GAS 的机关 Actor，使用目标侧执行模式（`TargetAbilitySystem` + `TargetInteractionAbilityHandle`），响应能力在机关自身 ASC 上由服务器执行；验证：编译通过（若需新 C++ 基类）+ 需要 Unreal Editor，PIE 确认触发。
- [ ] 9.4 配置交互提示 UI（复用 `W_InteractionPrompt`），确认进入/离开范围时提示正确出现与消失；验证：需要 Unreal Editor，PIE 覆盖 `interaction-and-pickup` 的提示展示场景。
- [ ] 9.5 双客户端验收拾取竞争：两名玩家几乎同时拾取同一物品，该物品最多结算一次；验证：Dedicated Server + 2 客户端。
- [ ] 9.6 双客户端验收机关：一名玩家触发机关，效果复制到另一名玩家；同时验证机关不可交互状态下不执行响应能力；验证：Dedicated Server + 2 客户端。
- [ ] 9.7 配置按 I 开关背包与装备栏的输入与能力（复用 `GA_ToggleInventory` 与 `InputTag.Ability.ToggleInventory`）；验证：需要 Unreal Editor。
- [ ] 9.8 配置背包界面（复用 `W_InventoryScreen`/`W_InventoryGrid`/`W_InventoryTile`），订阅背包变更消息；验证：需要 Unreal Editor。
- [ ] 9.9 创建装备栏界面与其逻辑基类（`W_QuickBar` 是纯蓝图无 C++ 基类，需新建而非继承），订阅 7.9 的装备槽变更消息；验证：需要 Unreal Editor。
- [ ] 9.10 在 TypeScript 实现背包/装备栏/局时的 Presenter，输出不可变 ViewState 并接收用户意图；界面不做乐观更新，提交后等待复制回传再刷新；验证：`npm run typecheck` + Presenter contract tests 覆盖「操作被拒绝后回到权威状态」。
- [ ] 9.11 通过 `HUD.Slot.*` 插槽与 Add Widgets Action 挂载背包、装备栏与局时元素，不修改 `ALyraHUD`；验证：需要 Unreal Editor。
- [ ] 9.12 验收界面开关幂等：连续两次开关背包不产生重复界面实例或重复订阅；验证：PIE，对应 `inventory-equipment-ui` 的开关场景。
- [ ] 9.13 验收 Listen Server 本地界面绑定 Owning Local Player，远端客户端各自展示自身复制状态；验证：Listen Server + 1 远端客户端。
- [ ] 9.14 验收局时展示：计时模式展示与服务器一致的剩余局时，自由模式不展示倒计时元素；验证：两种 Experience 各启动一次，需要 Unreal Editor。
- [ ] 9.15 在 `LyraGame/Inventory` 新增通用世界拾取 Actor 与可诊断丢弃结果，并在 `ULyraInventoryManagerComponent` 实现 `RequestDropItem` + owning-client Server RPC：服务器二次校验物品归属与 Authority，成功生成后再移除背包条目，失败时保持背包不变；验证：编译通过 + `LyraGame.Inventory.DropItem` Automation 覆盖成功、非归属、生成失败与重复请求。**（2026-08-13 已实现并通过 UHT、三个受影响源码单元及生成代码单元的 MSVC 编译；完整 UBT/Automation 因当前 Editor Live Coding 会话占用而未验证，故暂不勾选。）**
- [ ] 9.16 加固 `AddItemInstance` 的跨 Actor Outer 路径：目标背包 Owner 与传入实例 Outer 不同时复制实例到目标 Actor，并保持 ItemDef/StatTags；同 Outer 路径保持原实例；验证：扩展 `LyraGame.Inventory.AddItemInstance` Automation。**（2026-08-13 已实现跨 Outer 复制与 Automation 用例，受影响源码单元编译通过；完整 Automation 因当前 Editor Live Coding 会话占用而未运行，故暂不勾选。）**
- [x] 9.17 在 `TypeScript/Inventory/` 实现不可变 ViewState、Presenter、UE Gateway 与 `W_InventoryTile` 的 `blueprint.mixin` 拖放接线；丢弃请求不做乐观删除，等待 `Lyra.Inventory.Message.StackChanged` 后刷新；`TypeScript/Main.ts` 只增加一次最小 bootstrap，不恢复已删除的 TS GameFeature 生命周期；验证：`npm run typecheck` + contract tests 覆盖成功回传、拒绝保持、重复 bootstrap 与重复意图。**（2026-08-13 已实施：typecheck 通过；Inventory contract tests 6/6 通过，额外覆盖异步服务器拒绝后可重试。）**
- [ ] 9.18 在 ShooterExplorer 配置通用世界拾取 Actor 的 Blueprint 子类（碰撞、视觉、`GA_Interaction_Collect`），并把允许丢弃的 Inventory Manager/Experience 指向该类；验证：需要 Unreal Editor，资产重启后引用有效。
- [ ] 9.19 完成单客户端闭环验收：拾取世界物品 → 背包 UI 展示 → 拖出界面丢到角色附近地面 → 再次拾取；验证：PIE + Standalone，确认 ItemDef/StatTags 保持且界面只随权威复制刷新。
- [ ] 9.20 完成双客户端 Authority 与竞争验收：客户端不能丢弃他人物品，同一物品重复请求最多生成一次，另一玩家可拾取掉落物；验证：Dedicated Server + 2 客户端。

## 10. 里程碑 M9：最终验证与交付

- [ ] 10.1 执行完整 TypeScript 验证；验证：在项目根执行 `npm run typecheck`、`npm run build` 与全部 contract tests，并确认 `Content/JavaScript/GameFeatures` 下脚本产物存在。
- [ ] 10.2 执行完整 C++ 编译；验证：`D:/UnrealEngine/UE_5.7/Engine/Build/BatchFiles/Build.bat LyraEditor Win64 Development D:/MatrixTA/LyraRPGGameplayAbility/LyraStarterGame.uproject -WaitMutex`。
- [ ] 10.3 执行全部 Automation 测试；验证：`D:/UnrealEngine/UE_5.7/Engine/Binaries/Win64/UnrealEditor-Cmd.exe D:/MatrixTA/LyraRPGGameplayAbility/LyraStarterGame.uproject -NullRHI -ExecCmds="Automation RunTests LyraGame.Inventory+ShooterCore;Quit" -unattended -nopause`。
- [ ] 10.4 执行 Development Cook/Stage，确认 Stage 目录同时包含 PuerTS runtime 包、`Main` 脚本与搜打撤玩法脚本产物；验证：`RunUAT.bat BuildCookRun -project=D:/MatrixTA/LyraRPGGameplayAbility/LyraStarterGame.uproject -noP4 -platform=Win64 -clientconfig=Development -build -cook -stage -pak -skiparchive`，无缺失 Primary Asset 或 GameplayTag 日志。
- [ ] 10.5 完成搜打撤完整联机验收：Host/Join、Feature 激活、Warmup 至 MatchEnd、区域传送、分队伤害、装备属性、死亡掉落与按队伍复活、晚加入、Feature 停用清理全部通过；验证：Dedicated Server + 2 客户端。
- [ ] 10.6 完成原 Shooter 三件套最终回归：Elimination 与 ControlPoint 两个 Experience 各完成一局，伤害与出生点行为与本变更前一致；验证：Dedicated Server + 2 客户端，记入验收矩阵。
- [ ] 10.7 完成验收矩阵填写，未运行项显式标注为未验证；验证：矩阵评审。
- [ ] 10.8 编写资产交接文档，逐项标记必须创建、可替换、已验证或已回退的资产，并附 Phase、PawnData、装备栏、传送点的引用位置；验证：用户无需阅读 C++ 即可完成视觉资产替换。
- [ ] 10.9 在文档中记录本变更沿用的已知限制：交互能力缓存只增不减（`UAbilityTask_GrantNearbyInteraction`）、背包无格子/重量/堆叠上限；验证：文档评审。
