> **状态：方向修订（2026-08-12）**
>
> 原「复制 Shooter→Palworld 三插件」方案实施后，Palworld 复制资产与 Shooter 原版**同名**（Experience/Blueprint/地图等资产名与 PrimaryAssetId 相同），两个插件同时加载时生成类冲突、AssetManager Duplicate PrimaryAssetID，导致 ShooterGame 无法正常使用。经决策：**废弃 Palworld 三插件，改为直接在 ShooterGame 上开发**（保留原「搜打撤 + 分队对抗」的玩法目标，但直接在 ShooterCore/ShooterExplorer/ShooterMaps 上实现，不复制平行插件）。
>
> 已执行：删除 `Plugins/GameFeatures/PalworldCore`（含 `PalworldCoreRuntime` C++ 模块）、`PalworldExplorer`、`PalworldMaps`；从 `LyraStarterGame.uproject` 移除三个条目；`LyraEditor` 重新编译通过。Shooter 三件套与 TopDownArena 保持原样（git 无改动）。OpenSpec 原 M3-M9 任务按新方向**重定向**（以 tasks.md 为准），不再作废。
>
> 保留并已并入 ShooterGame 的改进：M1 基线缺陷修复——`FLyraInventoryList::AddEntry(ULyraInventoryItemInstance*)` 实现、`LyraGameInstance.cpp` 注释 `WaitDebugger()`、`LyraGame.Inventory.AddItemInstance` Automation 测试、`LyraGameInstance::Shutdown()` 释放 PuerTS FJsEnv 的 GC 泄漏修复。
>
> 教训记录：复制 GameFeature 时不得保留与源插件同名的资产/类（UClass FName 冲突、PrimaryAssetId 重复），若需平行插件必须先做完整命名空间迁移。
>
> 不要 archive 本变更——归档会把 delta 规格写入主规格；本变更作为「方案调整」的记录保留，后续里程碑任务在此更新。

## Why

项目需要一个「搜打撤 + 分队对抗」原型（工作代号 Palworld）：玩家在单一持久世界内从各队基地出发、探索副本区域、拾取与装备物品、在全局局时结束时被强制撤离。Lyra 现有的 ShooterCore/ShooterExplorer/ShooterMaps 已经提供了武器、交互、Phase、队伍、出生点和 HUD 装配的完整骨架，复制这三个插件比从零搭建更快且可回退。

现有变更 `add-arpg-moba-gamefeatures`（ARPG + Moba 两套玩法）尚未开始实施，且与本次玩法方向冲突，由本变更取代。

## What Changes

**插件与资产**

- 复制 ShooterCore/ShooterExplorer/ShooterMaps 为三个平行 GameFeature：`PalworldCore`（含 `PalworldCoreRuntime` C++ 模块）、`PalworldExplorer`、`PalworldMaps`；原 Shooter 三件套保持可独立运行，不被破坏。
- Gameplay Tag 命名空间由 `ShooterGame.*` 迁移为 `Palworld.*`；`InputTag.*`、`HUD.Slot.*` 等跨插件通用 Tag 沿用现有定义，不重复注册。
- 沿用 `L_Expanse` 的 World Partition 地图，通过距离流送承载「玩家分散在世界不同区域」；不新增传统 Streaming Sublevel 状态机。

**前置修复（阻塞项，必须先做）**

- 实现 `FLyraInventoryList::AddEntry(ULyraInventoryItemInstance*)`（`LyraInventoryManagerComponent.cpp:110` 当前是 `unimplemented()`）；死亡掉落的尸包拾取依赖该路径。
- 移除或配置化 `LyraGameInstance.cpp:93` 的 `GameScript->WaitDebugger()`，该调用在 Init 阶段阻塞等待调试器，Dedicated Server 无法启动。
- 修正 `Config/DefaultPuerts.ini` 中指向不存在的 `Developer/TypeScript/tsconfig.json` 的注册项，并把真正编译 `TypeScript/Main.ts` 的根 `tsconfig.json` 纳入 watch（**2026-08-12 已恢复**：移除 EasyEditorPlugin 迭代加入的 TypeScriptConfigPaths，回落原生 `tsconfig.json`）。
- 同步 `TypeScript/Main.ts` 与 `Content/JavaScript/Main.js`（源码已注释掉 `GameplayRuntime` 实例化，编译产物仍在运行旧版本）。

**玩法能力**

- 区域传送：服务器权威的传送接口与传送点/传送交互物；玩家所在区域通过 PlayerState 复制。
- 全局局时：基于 `ULyraGamePhaseSubsystem` 的 Warmup → Playing → Extract → MatchEnd 流程；自由模式与计时模式为两套 UserFacingExperience 配置。
- 撤离：Extract Phase 将各队玩家分别传送回**各自队伍的基地**（非单一主基地）。
- PVP：沿用 Lyra 分队对抗语义（同队零伤害由 `ULyraTeamSubsystem::CanCauseDamage` 提供），主基地不设安全区。
- 死亡与复活：背包物品掉落为可拾取尸包，装备槽物品保留；复活点按队伍基地过滤。
- 交互：按 F 拾取物品与触发机关；机关使用 `FInteractionOption.TargetAbilitySystem` 在交互物自身 ASC 上执行能力。
- 装备槽与属性：新增按 GameplayTag 寻址的装备槽组件（头/身/腿/饰品），装备时施加 GameplayEffect 增减属性、卸下时移除。新增血量以外的攻击、防御属性。
- 伤害公式：新增 `UPalDamageExecution` 承载攻防计算，不修改 `ULyraDamageExecution`，避免破坏原 Shooter 三件套。
- UI：按 I 打开背包与装备栏；沿用 UIExtension 数据驱动装配，不修改 `ALyraHUD`。

**明确不在范围内**

- 不实现宠物/怪物 AI、捕获、养成。
- 不实现背包格子、重量上限、堆叠上限、排序（`CanAddItemDefinition` 维持恒真）。
- 不实现跨服 travel、多 server 实例编排或跨局存档持久化。
- 不实现组队邀请 UI 与动态建队（队伍由 `B_TeamSetup_TwoTeams` 人数平衡分配）。
- 不制作最终美术资产（模型、材质、动画、UMG 视觉布局、地图美术）。

## Capabilities

### New Capabilities

- `palworld-gamefeature-shells`: PalworldCore/Explorer/Maps 三插件结构、Tag 命名空间迁移、Experience 与必需配置资产装配契约、原 Shooter 插件不回归。
- `lyra-baseline-fixes`: 阻塞后续实施的 Lyra/PuerTS 基线缺陷修复（`AddItemInstance` 空实现、`WaitDebugger` 阻塞、tsconfig 注册错误、TS 产物不同步）。
- `world-zone-travel`: 单世界 World Partition 下的区域传送、服务器权威传送接口、玩家区域状态复制与传送失败处理。
- `match-phase-lifecycle`: Warmup/Playing/Extract/MatchEnd 全局局时状态机、自由与计时两种模式、撤离时按队伍分流传送、晚加入状态恢复。
- `combat-teams-and-death`: 分队对抗伤害语义、攻防属性与伤害公式、死亡掉背包保装备、尸包生成与拾取、按队伍基地复活。
- `interaction-and-pickup`: 按 F 拾取物品与触发带 GAS 的机关、交互能力授予与目标侧执行两种模式、交互提示 UI。
- `equipment-slots-and-attributes`: 按 Tag 寻址的装备槽复制模型、装备/卸载的 GameplayEffect 应用与移除、跨 Pawn 生命周期的槽位归属。
- `inventory-equipment-ui`: 背包与装备栏 UI 的数据驱动装配、消息订阅契约、TypeScript Presenter 与可替换 UMG 视觉层边界。

### Modified Capabilities

无。`openspec/specs/` 下当前没有已归档的主规格；`add-arpg-moba-gamefeatures` 的 delta 规格从未同步进主规格，本变更取代该变更而非修改其规格。

## Impact

**GameFeature 插件**

- 新增 `Plugins/GameFeatures/PalworldCore/`（含 `Source/PalworldCoreRuntime/`）、`Plugins/GameFeatures/PalworldExplorer/`、`Plugins/GameFeatures/PalworldMaps/`。
- `Plugins/GameFeatures/ShooterCore|ShooterExplorer|ShooterMaps/` 只读，不修改；验收需确认其仍可独立启动。

**C++**

- `Source/LyraGame/Inventory/LyraInventoryManagerComponent.cpp`：实现 `AddEntry(ItemInstance*)`。
- `Source/LyraGame/System/LyraGameInstance.cpp`：`WaitDebugger()` 配置化。
- `Plugins/GameFeatures/PalworldCore/Source/PalworldCoreRuntime/`：装备槽组件、装备 Fragment、AttributeSet、DamageExecution、传送点/传送接口、掉落组件、出生点选择组件。新增玩法类集中在此模块，不写入 `LyraGame`。
- 若传送与队伍写入需要新的 Authority 安全接口，按现有 `ULyraTeamStatics` 的窄接口模式扩展，函数体内二次校验 Authority 并返回可诊断枚举；不新增按字符串调用的通用 RPC。

**TypeScript / PuerTS**

- `TypeScript/Main.ts`（保留用户现有修改，只增加最小 bootstrap）、新增 GameFeature 脚本模块目录（`TypeScript/GameFeatures/`）、根 `tsconfig.json` 与项目根 `package.json`（原生 PuerTS 布局，EasyEditorPlugin 已移除）。
- TS 承担范围：Phase 编排、局时与撤离流程、传送判定编排、装备操作意图提交、UI Presenter。
- TS 不承担范围：`FFastArraySerializer` 复制结构、`UPROPERTY` 反射、AttributeSet、GameplayEffect Execution、子对象复制注册——这些必须是 C++。

**资产（需 Unreal Editor）**

- GameFeatureData、ExperienceDefinition、UserFacingExperience、PawnData、Phase GA、AbilitySet、InputConfig/IMC、装备与物品 ItemDefinition、尸包与机关 BP、背包/装备栏 UMG、队伍基地 PlayerStart 与传送点布点。
- 资产复制需在 Editor 内完成重定向与 Fix Up Redirectors；代码侧不生成 `.uasset`。

**网络职责**

- 服务器：Phase 推进、局时计时、传送执行、队伍分配、伤害结算、掉落生成、装备槽写入、复活点选择。
- Owning Client：仅提交传送/交互/装备意图；战斗输入继续走 GAS 既有预测与服务器校验路径。
- 复制：`PlayerState` 承载队伍 ID、当前区域 Tag、装备槽（跨 Pawn 存活）；`GameState` 承载 Phase 与局时终点；背包 `InventoryList` 与装备槽均通过 `FFastArraySerializer` 复制，ItemInstance 作为子对象注册。
- 不使用 `LocalPlayerIndex` 作为网络玩家身份；Listen Server 的本地 UI 绑定 Owning Local Player。
