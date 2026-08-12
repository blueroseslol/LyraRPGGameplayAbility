> **状态：已被取代（Superseded）**
>
> 本变更由 [`add-palworld-gamefeature`](../add-palworld-gamefeature/proposal.md) 取代，全部任务未开始实施，其 delta 规格从未同步进 `openspec/specs/` 主规格。
>
> 取代原因：玩法方向由 ARPG + Moba 两套 GameFeature 改为「搜打撤 + 分队对抗」的 Palworld 原型（复制 ShooterCore/ShooterExplorer/ShooterMaps 为三个平行插件）。
>
> 本变更中仍然有效、并已被新变更吸收的设计结论：GameFeature 生命周期向 PuerTS 暴露的契约、Authority 安全写接口的窄接口模式、Primary Data Asset 保持为配置实例、Phase GA 采用「TypeScript 优先、Blueprint 配置壳回退」、可替换 UMG 的 Presenter 边界。
>
> 不要 archive 本变更——归档会把从未实施的 delta 规格写入主规格。

## Why

项目需要在 Lyra 现有基础设施之上建立 ARPG 第三人称与 Moba TopDown 两套可扩展 GameFeature，并复用会话、Experience、GamePhase、队伍、计分、GAS 和 CommonUI。为了提高代码可审查性与 AI 自动化程度，玩法编排应尽量使用 PuerTS；C++ 只补足 Unreal 反射、GameFeature 生命周期、服务器权限和当前类型声明未暴露的能力，资产只保留 Asset Manager、Cook 和视觉表现必需的配置实例。

## What Changes

- 创建 `ARPG` 与 `Moba` 两个 GameFeature 插件骨架，参照 ShooterCore 与 TopDownArena，但不新增共享桥接插件，也不复制其玩法实现。
- 在现有 `LyraGame` 模块中增加 PuerTS 可调用的 GameFeature 生命周期状态、服务器 Authority 和队伍写入接口；优先扩展既有 GameInstance、Subsystem 和 BlueprintFunctionLibrary。
- 由项目级 PuerTS 入口注册 ARPG/Moba 模块，订阅 GameFeature 激活/停用状态，并成对清理委托、Timer 和 World 引用。
- 使用保存后的 PuerTS TypeScript Blueprint 或 `blueprint.mixin` 编写 Phase GA、UMG Presenter/逻辑基类及其他允许稳定生成类资产的逻辑；不使用已废弃的运行时 `makeUClass` 作为持久软引用目标。
- 保留 GameFeatureData、ExperienceDefinition、UserFacingExperience、PawnData 等 Primary Data Asset 实例，将其限制为配置和软引用，不承载蓝图事件图逻辑。
- 封装 `UCommonSessionSubsystem` 的创建、搜索、加入、失败恢复与清理流程，并通过可替换 UMG 页面展示状态。
- 复用 `ULyraGamePhaseAbility` 与 `ULyraGamePhaseSubsystem`，实现服务器权威的 Warmup、Playing、RoundEnd、MatchEnd 回合流程。
- 复用 Lyra 队伍子系统、PlayerState 与 Gameplay Tag Stack，实现阵营、个人积分、队伍积分及复制后的 UI 展示。
- 输出 Lyra GAS 功能分类和分阶段接入选择，不在本次变更中一次性接入所有 GAS 子系统。
- ALS-Community 与 GASPALS 仅作为 ARPG 后续隔离兼容性试验；本次不导入第三方模板。
- 不建设 Editor 侧资产生成工具；视觉资产和必需配置资产由用户在 Unreal Editor 中创建或保存并验证。

## Capabilities

### New Capabilities

- `gamefeature-experience-shells`: ARPG/Moba 插件结构、必需 Primary Data Asset 实例、PuerTS 生成类与 Experience 装配契约。
- `lyra-puerts-exposure`: 现有 LyraGame 模块中的 GameFeature 生命周期、Authority、队伍和 PuerTS 调用边界。
- `multiplayer-match-lifecycle`: 会话创建/加入、Experience Travel 和服务器权威的回合 Phase 流程。
- `teams-scoring-and-ui`: 阵营、个人/队伍积分、复制语义及可替换 UMG 的 TypeScript Presenter 契约。
- `lyra-gas-adoption`: Lyra GAS 功能分类、选择门、接入顺序和人工资产步骤。
- `arpg-locomotion-evaluation`: ALS-Community/GASPALS 的后续兼容性验证边界、验收条件和回退策略。

### Modified Capabilities

无。当前仓库没有需要修改的 OpenSpec 主规格。

## Impact

- GameFeature：新增 `Plugins/GameFeatures/ARPG/` 和 `Plugins/GameFeatures/Moba/`，不新增其他插件。
- C++：仅修改/扩展 `Source/LyraGame/` 下的 GameFeature、GameInstance/Subsystem、Team BlueprintFunctionLibrary 等合适边界；不得把回合、计分或 UI 业务规则写入 C++。
- PuerTS：使用现有 `TypeScript/Main.ts` 和每 GameInstance VM，新增 ARPG/Moba gameplay 模块、会话服务、回合协调器、计分服务与 UI Presenter。
- 资产：GameFeatureData、Experience、UserFacingExperience、PawnData 仍为可扫描、可软引用的 `.uasset` 实例；Phase GA 和 Widget 逻辑可使用已保存并通过 Cook 验证的 TypeScript Blueprint 类。最终 UMG 布局、模型、材质、贴图、动画蓝图和地图由用户提供。
- 网络：服务器拥有 Phase、队伍、计分与 Travel 决策；Owning Client 只提交已有会话/GAS 输入意图；PlayerState 复制玩家阵营和个人分，GameState/队伍子系统复制全局 Phase 与队伍分。所有 C++ 写接口必须二次校验 Authority，不增加任意函数名式通用 RPC。
