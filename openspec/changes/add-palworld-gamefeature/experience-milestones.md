# 新 Experience → PuerTS/C++ 接入 里程碑计划书

> 所属变更：`openspec/changes/add-palworld-gamefeature`
> 状态：方案调整后的里程碑重锚定（2026-08-13）。取代被删除的 TS 生命周期方案，GameFeature 控制改走 UE 原生 Experience 系统。

## 0. 架构定调

- **GameFeature 控制 = UE 原生链路**（替换已删除的 TS 生命周期状态机）：
  `ULyraExperienceDefinition`（资产）→ `ULyraExperienceManagerComponent`（GameState 组件）→ `UGameFeaturesSubsystem.LoadAndActivateGameFeaturePlugin` → 插件 `UGameFeatureData.Actions` → 各 `UGameFeatureAction` 子类干活。
- **PuerTS 职责重定位**：TS 不再重造生命周期，只做两类事——① 经 `ULyraGameFeatureStatics` 驱动「何时激活哪个 GameFeature」；② 业务编排（Phase 流程、撤离分流、装备意图、UI Presenter）。
- **C++/TS 判定口诀**（沿用 design.md 决策 8）：`FFastArraySerializer`/`UPROPERTY` 反射/`AttributeSet`/`Execution`/可复制子对象/引擎虚函数/Authority 校验 → **C++**；其余编排/UI/意图提交 → **TS**。
- **落点**：玩法 C++ 全部在 `ShooterCoreRuntime`（GameFeature 模块）；`LyraGame` 只保留已完成的四项缺陷修复，不新增玩法规则。
- **关键事实**：UE 5.7 的 `UGameFeaturesSubsystem` 激活/停用方法**不是 UFUNCTION**（纯 C++ `UE_API`），PuerTS/蓝图无法直接调用，必须经 `ULyraGameFeatureStatics` 薄包装；也不要继承 `UGameFeaturesSubsystem` 再补 UFUNCTION（会与基类单例数据分叉，见 `GameFeaturesSubsystem.h:445` 硬编码 `Get()`）。

## 里程碑划分（M2–M9）

### M2 — Experience 基座与 GameFeature 原生控制

> 状态：部分完成（`ULyraGameFeatureStatics` + `ULyraGameFeatureData` 已提交于 `2a39a4b`）

| 层 | 内容 |
|---|---|
| C++ | ① `ULyraGameFeatureStatics`（BlueprintCallable 薄包装 ✅）；② `ULyraGameFeatureData`（具名 DataAsset 类 ✅）；③ 重新设计 `UGameFeatureAction_TravelSetup`（上版已删，待定形态）；④ `ShooterCoreRuntime.Build.cs` 加 `GameFeatures` 依赖（✅） |
| PuerTS | 驱动层：`ULyraGameFeatureStatics.ActivateGameFeature("ShooterCore")` + `puerts.argv.getByName("GameInstance")` 取上下文 |
| 资产 | `LyraGameFeatureData` 实例（`ShooterCore/Content/GameFeatureData/ShooterCore`），`Actions` 挂 TravelSetup；Palworld 的 `ExperienceDefinition` 在 `GameFeaturesToEnable` 填 `ShooterCore` |
| 验收 | 停用 Experience 后 ShooterGame 仍可启动；激活后 Actions 逐一执行；PuerTS 可驱动开/关 |

**阻塞待办（已由 `B_Teleport` 取代）**：~~`UGameFeatureAction_TravelSetup` 形态——传送点是「地图布置」还是「Action 按配置刷出」~~；区域传送改复用 Lyra 现成 `B_Teleport`，接入由用户处理。

### M3 — PuerTS 职责重定位

| 层 | 内容 |
|---|---|
| PuerTS | 目录收敛为「驱动层 + 业务编排层」，无 `Lifecycle`/`Scopes`/`RebuildGuard`；谁建谁释放（定时器/事件订阅直接持有句柄） |
| C++ | 不新增（控制已归 Experience 系统） |
| 验收 | `npm run typecheck` + contract tests 仍绿；TS 模块无 UE 生命周期状态残留 |

### M4 — 区域传送（5.1–5.7，二次修订：复用 Lyra 现成传送门）

| 层 | 内容 |
|---|---|
| C++ | ~~`ALyraTravelDestination`/`ULyraTravelStatics`/`ELyraTravelResult`/`ULyraZoneStateComponent`/`ALyraTravelInteractionPoint`~~（已删除）→ 复用 Lyra 现成 `B_Teleport`（`ShooterCore/Content/Blueprint/B_Teleport`），**接入由用户处理** |
| PuerTS | ~~`TravelCoordinator`/`TravelGateway`/`TravelTypes`~~（已删除，纯逻辑模块）→ 是否仍需 TS 编排取决于 `B_Teleport` 接入方式 |
| 资产 | `B_Teleport` 布点（两队基地 + 可探索区域传送点） |
| 验收 | 编辑器 PIE 单客户端「触发传送」；双客户端 DS 区域隔离（A 副本、B 基地） |

### M5 — 局内 Phase 与全局局时（6.1–6.12）

| 层 | 内容 |
|---|---|
| C++ | GameState 复制「局时结束时间戳」；Phase GA 的 Blueprint 配置壳（Tag 层级沿用 decision 6：`Warmup/Playing/Playing.Free/Extract/MatchEnd`） |
| PuerTS | Phase 编排与计时器管理；撤离玩家遍历 + 按队伍分流（调 C++ 传送接口）；自由/计时两模式差异在 TS 侧 |
| 资产 | 两套 Experience（自由/计时）、Phase GA 资产 |
| 验收 | 阶段顺序正确；晚加入读同一时间戳恢复剩余时间 |

### M6 — 装备/属性/伤害（7.1–7.12）

| 层 | 内容 |
|---|---|
| C++ | 按 Tag 寻址的装备槽组件（挂 PlayerState，`FFastArraySerializer` 复制）；`UPalWorldAttackDefenseSet`（攻/防）；`UPalWorldAttackDefenseExecution`（攻防 + 队伍许可 + 距离/材质衰减，`Max(…,0)` 下限）；装备 Fragment |
| PuerTS | 装备/卸下意图提交 + 前置校验（快速失败，最终写入走 C++ Authority） |
| 资产 | 装备槽 ItemDefinition、GE 资产（指向新 Execution） |
| 验收 | 装备属性增减正确；原 Shooter 伤害不变；重生三次属性不累积 |

### M7 — PVP / 死亡 / 复活（8.1–8.10）

| 层 | 内容 |
|---|---|
| C++ | 掉落组件（尸包生成）；出生点覆写 `OnChoosePlayerStart`（按 `StartPointTags` 队伍过滤，替换而非修改 TDM 组件） |
| PuerTS | 死亡→掉落→复活流程编排 |
| 资产 | 尸包 BP、队伍基地 PlayerStart 布点 |
| 验收 | 同队零伤害；死亡掉包、装备保留；按队伍基地复活 |

### M8 — 交互 / 拾取 / UI（9.1–9.14）

| 层 | 内容 |
|---|---|
| C++ | 交互基类与拾取（沿用 `IInteractableTarget`/`IPickupable`）；`GameplayMessageSubsystem` 消息契约 |
| PuerTS | UI Presenter + 不可变 ViewState（不做乐观更新，等复制回传刷新） |
| 资产 | 背包/装备栏 UMG（`HUD.Slot.*` 插槽 + `UGameFeatureAction_AddWidgets`，不修改 `ALyraHUD`） |
| 验收 | 按 F 拾取、按 I 开背包；服务器拒绝后界面回权威状态 |

### M9 — 最终交付（10.1–10.9）

打包（脚本产物进 Stage/NonUFS）、原 Shooter 三件套回归、停用搜打撤 Feature 可整体回退、文档与 openspec 归档。

## 待拍板

1. ~~`UGameFeatureAction_TravelSetup` 形态：地图布置 vs Action 刷出~~（已由「复用 `B_Teleport`」取代，接入由用户处理，不再阻塞）。
2. 是否把本计划继续拆到任务级（对标 `tasks.md`）。
