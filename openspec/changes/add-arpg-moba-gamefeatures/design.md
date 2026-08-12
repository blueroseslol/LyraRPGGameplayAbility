## Context

见 [proposal.md](proposal.md)。Lyra 当前已经提供 CommonSession、Experience、GameFeature Action、GamePhase、TeamSubsystem、PlayerState GameplayTagStack 和 CommonUI；项目 PuerTS runtime 为每个 `UGameInstance` 创建独立 VM，并从 `Content/JavaScript/Main.js` 启动。生成的类型声明已经覆盖 UserFacingExperience、Experience、PawnData、GamePhaseSubsystem、PlayerState 和 TeamSubsystem 的大部分 API，但 GameFeature 的逐 World 激活/停用状态及 `ChangeTeamForActor` 尚未作为安全的 PuerTS 契约暴露。

PuerTS 同时存在三种容易混淆的模式：运行时 `makeUClass`、`blueprint.mixin` 和保存为资产的 TypeScript Blueprint。前者已废弃且不适合作为持久软引用；mixin 依赖一个已有 native/Blueprint class；只有保存并通过 Asset Manager/Cook 验证的 TypeScript Blueprint class 才能候选用于 Phase GA 或 Widget 父类。GameFeatureData、Experience、UserFacingExperience 和 PawnData 是资产实例，不能被一个运行时 TS class 取代。

## Goals / Non-Goals

**Goals:**

- 只创建 ARPG、Moba 两个 GameFeature，不创建桥接插件。
- 以无玩法规则的 LyraGame C++ 暴露层连接 GameFeature 生命周期和服务器队伍写入。
- 让会话、回合、计分、GAS 选择和 UI 编排留在 TypeScript，并保证多 GameInstance/Travel/停用时可释放。
- 把逻辑型 Blueprint 降到最低；保留 UE 资产系统要求的配置实例和视觉资产。
- 把 Editor、Cook、Standalone、Dedicated Server 和双客户端验证明确拆开。

**Non-Goals:**

- 不创建通用客户端到服务器 RPC 网关。
- 不重写 CommonSession、ExperienceManager、GamePhase、TeamSubsystem 或 AbilitySystemComponent。
- 不制作最终地图、UMG 布局、模型、材质、贴图、动画状态机或 GameplayCue 视觉资产。
- 不开发 Editor 资产批量生成工具。
- 不在本变更中导入 ALS-Community/GASPALS，也不一次性实现全部 GAS 功能。

## Decisions

### 1. ARPG/Moba 是内容型 GameFeature，逻辑不需要各自的 C++ Runtime 模块

两个 `.uplugin` 采用 `ExplicitlyLoaded=true`、`BuiltInInitialFeatureState=Registered` 和 `CanContainContent=true`，声明所需的 GameplayAbilities、ModularGameplay、CommonUI、EnhancedInput 等插件依赖。若没有不可替代的 native 类型，不创建 `ARPGRuntime` 或 `MobaRuntime` 模块；GameFeature 特有代码放在各自 TypeScript 目录，资产留在各自 Content 根。

替代方案是照搬 ShooterCore/TopDownArena 的空壳 Runtime 模块。该方案增加 Build.cs、模块启动和依赖维护，却不提供本项目需要的行为，因此暂不采用；未来第三方 locomotion 确实需要 native adapter 时再单独论证。

### 2. TypeScript 源码属于 GameFeature，编译产物统一进入项目脚本根

目录约定：

```text
Plugins/GameFeatures/ARPG/
  ARPG.uplugin
  Content/ARPG/GameFeatureData.uasset
  TypeScript/index.ts
  TypeScript/session/...
  TypeScript/match/...
  TypeScript/ui/...
Plugins/GameFeatures/Moba/
  Moba.uplugin
  Content/Moba/GameFeatureData.uasset
  TypeScript/index.ts
  TypeScript/session/...
  TypeScript/match/...
  TypeScript/ui/...
Developer/TypeScript/tsconfig.gamefeatures.json
Content/JavaScript/GameFeatures/ARPG/...
Content/JavaScript/GameFeatures/Moba/...
```

新增独立 `tsconfig.gamefeatures.json`，以两个插件的 TypeScript 目录为输入，以 `Content/JavaScript/GameFeatures` 为输出；同时把它加入 `DefaultPuerts.ini` 和 npm build/typecheck。`LyraGame.Build.cs` 负责将该目录下 `.js/.json` 作为 NonUFS 递归 staging，避免改变 PuerTS runtime 的通用职责。Gameplay TS 禁止 Node API。

项目 `TypeScript/Main.ts` 只安装一次 `GameFeatureScriptRegistry`，不直接导入并永久激活两个玩法。实施时保留用户对 Main.ts 的现有修改，只增加最小 bootstrap 调用。

### 3. GameFeature 生命周期通过 LyraGame 状态契约暴露，不让 C++ 直接调用任意 JS

在 `Source/LyraGame/GameFeatures/` 新增：

- `UGameFeatureAction_RegisterPuerTSModule : UGameFeatureAction_WorldActionBase`
- `ULyraGameFeatureScriptSubsystem : UGameInstanceSubsystem`

Action 只有 `FName ScriptModuleName` 配置。`AddToWorld` 按 GameInstance/ChangeContext 登记模块；停用时撤销登记。Subsystem 保存带引用计数的激活集合，暴露：

- `GetActiveScriptModules()`
- `OnScriptModuleActivated`
- `OnScriptModuleDeactivated`

PuerTS bootstrap 先绑定委托，再读取当前集合并去重激活，解决 VM 晚启动和热重启丢事件问题。TypeScript 模块统一实现：

```ts
interface GameFeatureModule {
  activate(context: GameFeatureContext): void;
  deactivate(context: GameFeatureContext): void;
}
```

每个模块持有 `DisposableScope`，集中释放 Unreal delegate、手动释放代理、Timer 和弱 World 引用。Subsystem/Action 不依赖玩法规则，也不接受任意 JS 模块路径之外的函数调用。

替代方案是让 Action 直接依赖 Puerts VM 并调用 JS 函数。该方案把 VM 启动顺序、热重启和异常传播耦合到 GameFeature Action，故不采用。

### 4. Authority 和队伍只补当前暴露缺口

现有 `ALyraPlayerState::AddStatTagStack`、`ULyraTeamSubsystem::AddTeamTagStack`、读取积分和 Phase K2 API 已进入 PuerTS 类型，不重复包装。扩展 `ULyraTeamStatics`，增加一个服务器安全的队伍变更函数：

- 输入为 WorldContext、目标 Actor/PlayerState 和 TeamId。
- 校验 World、GameState、目标 Actor、Authority、TeamId 范围和 `DoesTeamExist`。
- 内部调用 `ULyraTeamSubsystem::ChangeTeamForActor`。
- 返回枚举结果（Success、NotAuthority、InvalidTarget、UnknownTeam），而非只有日志或断言。

TypeScript 仍须在服务入口先判断 net role，但 C++ 再校验是安全边界。客户端技能意图继续走 GAS；会话创建/加入属于 Owning Local Player 的前端流程，不经过该队伍接口。Local Player Index 只用于选择本机 UI owner，不作为网络身份。

### 5. Primary Data Asset 保持原生配置实例

每个玩法至少需要：

| 实例 | 建议职责 |
|---|---|
| GameFeatureData | 注册 PuerTS lifecycle Action、输入/UI/能力等 Feature Actions |
| ExperienceDefinition | GameFeaturesToEnable、PawnData、Actions/ActionSets |
| UserFacingExperience | 地图、Experience、人数、LAN/在线附加参数和前端展示元数据 |
| PawnData | PawnClass、AbilitySets、InputConfig、CameraMode |

这些资产不创建 TypeScript 子类，除非后续出现必须覆盖的虚函数；当前字段已经暴露给 PuerTS，额外子类只增加 Cook 和类加载风险。用户在 Editor 中创建/填写资产实例，代码侧提供明确的路径、字段清单和验证日志。

### 6. Phase GA 和 UMG 使用“TypeScript 优先、资产壳回退”

Phase 采用 `Warmup -> Playing -> RoundEnd -> MatchEnd` 的 Gameplay Tags。优先试验保存的 TypeScript Blueprint class 继承 `ULyraGamePhaseAbility`，类中实现激活/结束的轻量转发，具体条件、Timer 和结算由 `RoundCoordinator` 管理。验收必须覆盖：类引用保存、编辑器重启、Cook、Standalone、Dedicated Server、双客户端启动/结束委托。

若 TypeScript Generated Class 的 CDO 默认 Tag、加载顺序或 Cook 不稳定，用户创建无 Event Graph 的 Phase GA Blueprint 壳，只配置 `GamePhaseTag`；TS 使用 `blueprint.mixin` 或外部 Coordinator 保持全部规则在代码中。该回退不改变行为规格。

UMG 采用 TypeScript 逻辑父类/Presenter 与用户视觉 Widget 子类。Presenter 输出序列化友好的 ViewState，并接收 Host、Refresh、Join、Leave 等用户意图；Widget 不直接持有 Session/Phase/Team 服务。

### 7. CommonSession 流程由单一 TypeScript 服务封装

`SessionService` 从当前 GameInstance 获取 `UCommonSessionSubsystem`：

- Host：由 UserFacingExperience 创建 HostingRequest，然后 HostSession。
- Search：创建 SearchRequest、绑定结果和错误委托、执行 FindSessions。
- Join：使用 Owning Local Player 选择结果并 JoinSession。
- Leave/Retry：清理会话、解除委托、恢复明确的 UI 状态。

服务状态为 Idle、Hosting、Searching、Joining、Traveling、Failed。一次只允许一个互斥操作；每次操作拥有独立 disposer/token，迟到回调不能覆盖新操作。ServerTravel/ClientTravel 继续由 CommonSession/UE 完成，不在 TS 拼接未验证的连接 URL。

### 8. Match、队伍和计分按服务器服务分层

- `RoundCoordinator`：只在 Authority 驱动 Phase、回合计时和胜负条件。
- `TeamService`：在 TeamCreation 完成后执行默认人数平衡或玩法策略，并调用安全队伍接口。
- `ScoreService`：消费服务器已确认的 gameplay message/event，使用事件唯一键去重，写 PlayerState/TeamSubsystem Tag Stack。
- `MatchViewModel`：所有实例只读 Phase、队伍和积分复制状态，生成 UI ViewState。

配置 Tags 区分 `Score.Round.*` 与 `Score.Match.*`。RoundEnd 清除回合临时 Tag/内存状态；MatchEnd 冻结累计结果直到 Travel/新 Match。具体得分来源由后续玩法规格扩展，本变更只提供可验证骨架。

### 9. GAS 采用目录和选择门

本变更交付 GAS 分类文档，逐类列出 AbilitySet/InputTag、AttributeSet/GameplayEffect、TagRelationship、Cost/Cooldown、GameplayCue、Equipment/Inventory、Interaction、Death/Respawn、Phase 与网络预测。除 Phase 和现有积分 Tag Stack 外，不自动创建未选择的能力资产。用户选择某类后，另建小范围 OpenSpec 或扩展当前任务，明确预测策略、资源、输入和视觉资产步骤。

### 10. locomotion 只建立试验接口

ARPG PawnData 引用可替换的 PawnClass、CameraMode 和 Anim Layer，不直接继承第三方基类。ALS-Community/GASPALS 后续分别在隔离范围验证 UE 5.7 编译、Lyra Pawn Extension、Enhanced Input、GAS montage、移动复制、ragdoll、Cook 和双客户端。用户确认一个候选后再创建独立接入变更。

## Risks / Trade-offs

- [TypeScript Blueprint 在 Asset Manager/Cook 或 Dedicated Server 上加载不稳定] → 先完成小型 Phase/Widget 探针；失败时使用无逻辑 Blueprint 壳和 mixin/Coordinator。
- [GameFeature 激活早于 PuerTS VM，事件丢失] → Subsystem 保存引用计数集合，脚本绑定后主动重放。
- [Travel/PIE 多 World 泄漏委托和 UObject] → 按 GameInstance 隔离 VM，Action 按 ChangeContext 登记，TS 强制 DisposableScope 和弱引用。
- [BlueprintAuthorityOnly 只限制蓝图 UI，不足以构成安全边界] → 新写接口在 C++ 函数体再次检查 Authority；现有写接口只从 Authority service 调用并纳入网络测试。
- [内容型 GameFeature 缺少 native 模块导致未来第三方模板难接入] → 当前保持最小结构；只有候选 locomotion 验证后才为 ARPG 增加有依据的 native adapter。
- [项目脚本没有进入 Shipping] → 独立 tsconfig、npm build 和 LyraGame RuntimeDependencies 同时纳入验收；Cook 前检查 JS 产物存在。
- [直接修改 LyraGame 增加未来合并成本] → 新增类集中在 GameFeatures/System，TeamStatics 只增加窄接口，不修改 Lyra 核心算法。

## Migration Plan

1. 先加入 LyraGame 生命周期 Subsystem/Action 和队伍窄接口，通过 C++ 单元/自动化测试。
2. 加入 GameFeature TypeScript 编译与 staging，但暂不创建资产引用；通过 typecheck 和打包文件检查。
3. 创建 ARPG/Moba 内容型插件骨架和必需配置资产，由用户在 Editor 填写引用。
4. 接入 SessionService 和替代 UI Presenter，在前端地图验证 Host/Search/Join。
5. 接入 Phase、Team、Score 骨架，完成 Dedicated Server/双客户端验证。
6. TypeScript Blueprint 探针失败时仅切换到 Blueprint 配置壳，不回滚 TS 服务架构。
7. 每个里程碑都保持 ARPG/Moba 可单独停用；回滚时先从 Experience 移除 Feature，再移除对应脚本与 C++ 暴露。

## Open Questions

- 用户在 GAS 分类完成后选择哪些功能作为首批接入范围。
- ALS-Community 与 GASPALS 完成隔离验证后是否选择其中一个，或继续使用基础 Lyra Pawn。
