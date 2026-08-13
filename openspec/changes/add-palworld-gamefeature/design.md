> **方向修订（2026-08-13）**：本 design.md 写于「复制 Shooter→Palworld 三平行插件」方案下，该方案已废弃（见 proposal.md 顶部）。命名重定向如下，正文中的旧名请按下表理解：`PalworldCore`/`PalworldCoreRuntime` → `ShooterCore`/`ShooterCoreRuntime`；`Palworld.*` Tag → `ShooterGame.*`；`Pal*`/`UPal*` 类前缀 → `Lyra*`/`ULyra*`（避开已存在的 `ULyraAttributeSet` 基类 / `ULyraHealthSet` / `ULyraCombatSet` / `ULyraDamageExecution`，具体新类名以 tasks.md 为准）；`Palworld Experience` → ShooterCore 上的搜打撤 Experience。除决策 1（平行插件）与命名外，其余技术决策（PlayerState 挂槽、FFastArraySerializer、Phase Tag 父子语义、C++/TS 切分等）仍然有效。

## Context

见 [proposal.md](proposal.md) 的 Why 与 Impact。以下是塑造本设计的既有代码事实（均已在实施前核实）：

**Lyra 背包与装备现状**

- `ULyraInventoryItemDefinition` 是通用物品定义，行为由 Fragment 组合决定（`InventoryFragment_EquippableItem` / `SetStats` / `QuickBarIcon` / `PickupIcon`）。"只能存武器"是 ShooterCore 只写了枪的资产实例所致，不是系统限制。
- `FLyraInventoryList` 是 `FFastArraySerializer`；`ULyraInventoryItemInstance` 是需要显式注册的可复制子对象，其 Outer 必须是 Owner Actor 而非 Component（UE-127172）。
- `FLyraInventoryList::AddEntry(ULyraInventoryItemInstance*)` 函数体是 `unimplemented()`（`Source/LyraGame/Inventory/LyraInventoryManagerComponent.cpp:110`），而 `UPickupableStatics::AddPickupToInventory` 的 `Instances` 分支正走这条路径。
- `ULyraEquipmentManagerComponent` 是 `UPawnComponent`（随 Pawn 销毁），`ULyraQuickBarComponent` 是 `UControllerComponent`。二者均无按 Tag 寻址的穿戴槽概念，QuickBar 固定 3 格。
- 装备只 `GiveToAbilitySystem` 授予 AbilitySet 并 spawn Actor，不施加数值型 GameplayEffect。

**Lyra 战斗与队伍现状**

- 属性仅 `ULyraHealthSet`（Health/MaxHealth）与 `ULyraCombatSet`（BaseDamage/BaseHeal），无攻击、防御。
- `ULyraDamageExecution` 公式为 `BaseDamage × 距离衰减 × 材质衰减 × 队伍许可乘数`，队伍许可来自 `ULyraTeamSubsystem::CanCauseDamage`；该函数对同队恒返回 false（`Source/LyraGame/Teams/LyraTeamSubsystem.cpp:369`），这正是本变更需要的分队语义。
- 死亡链路完整：`HandleOutOfHealth` → `GameplayEvent.Death` → `GA_Hero_Death` → `GA_AutoRespawn` → `ALyraGameMode::RequestPlayerRestartNextFrame`。
- 出生点由 `ULyraPlayerSpawningManagerComponent::OnChoosePlayerStart` 虚函数决定；ShooterCore 的 `UTDM_PlayerSpawningManagmentComponent` 实现的是"离敌人最远"，与本变更的"回本队基地"语义冲突。
- `ALyraPlayerStart` 已有 `StartPointTags`（`FGameplayTagContainer`）可用于按队伍过滤。

**交互与 HUD 现状**

- `FInteractionOption` 支持两种执行位置：`InteractionAbilityToGrant`（能力授予交互者）与 `TargetAbilitySystem` + `TargetInteractionAbilityHandle`（能力在交互目标自身 ASC 上执行）。
- ShooterExplorer 已提供完整交互与背包 UI 范例：`GA_Interact`、`GA_Interaction_Collect`、`B_InteractableRock`、`W_InventoryScreen/Grid/Tile`、`GA_ToggleInventory`，输入 Tag 为 `InputTag.Ability.Interact` 与 `InputTag.Ability.ToggleInventory`。
- `UAbilityTask_GrantNearbyInteraction::InteractionAbilityCache` 只增不减，靠近过的交互 GA 会驻留在玩家 ASC 上直至 Task 销毁。
- HUD 挂载是数据驱动三段式：HUD Layout 内的 `UUIExtensionPointWidget` 声明 `HUD.Slot.*` 插槽 → `UGameFeatureAction_AddWidgets` 配 SlotID→WidgetClass → `UUIExtensionSubsystem` 撮合。不应修改 `ALyraHUD`。
- UI 与逻辑通过 `GameplayMessageSubsystem` 解耦（`Lyra.Inventory.Message.StackChanged` 等）。

**PuerTS 现状**

- 每个 `ULyraGameInstance` 创建一个 `FJsEnv`（`Source/LyraGame/System/LyraGameInstance.cpp:93`），模块根为 `Content/JavaScript`。
- 同一位置调用 `GameScript->WaitDebugger()`，在 Init 阶段同步阻塞等待调试器。
- `Config/DefaultPuerts.ini` 曾注册不存在的 `Developer/TypeScript/tsconfig.json`（EasyEditorPlugin 迭代加入）；2026-08-12 已恢复原生设置，回落默认 `tsconfig.json`（项目根，编译 `TypeScript/Main.ts`）。
- `TypeScript/Main.ts` 已注释掉 `GameplayRuntime` 实例化，但 `Content/JavaScript/Main.js` 仍是含实例化的旧版本。
- `Typing/ue/ue.d.ts` 已覆盖 `LyraInventoryManagerComponent`、`LyraGamePhaseSubsystem`、`LyraTeamSubsystem`、`CommonSessionSubsystem` 等 Lyra 类型。

**地图现状**

- `PalworldMaps` 复制自 ShooterMaps，其 `L_Expanse` 是 World Partition 地图，配有 DataLayer 分组。

## Goals / Non-Goals

**Goals:**

- 让 Palworld 与原 Shooter 三件套在同一项目内共存，任一方的改动不影响另一方。
- 把新增玩法 C++ 收敛在 `PalworldCoreRuntime` 模块内，`LyraGame` 只接受"缺陷修复"级别的最小改动。
- 明确 C++ 与 TypeScript 的职责切分，使切分依据是技术必要性而非偏好。
- 让装备槽的生命周期归属与"死亡保留装备"的规格要求在结构上自洽。
- 把需要 Unreal Editor 的资产步骤与可用命令行验证的代码步骤分开记录。

**Non-Goals:**

- 不重写 Lyra 的背包复制模型、装备管理器、队伍子系统、GamePhase 子系统或 CommonSession。
- 不为 Palworld 建立通用的客户端到服务器 RPC 网关。
- 不在本变更内引入第三方 locomotion、AI 或背包插件。
- 不建设 Editor 侧资产批量生成工具。

## Decisions

### 1. 三个平行插件，PalworldCore 保留 C++ 模块

`PalworldCore` 复制 ShooterCore 并保留其 `Source/` 目录，重命名为 `PalworldCoreRuntime`。这不是可选项：`ALyraWorldCollectable`（尸包与可拾取物的基类，同时实现 `IInteractableTarget` 与 `IPickupable`）和 `UTDM_PlayerSpawningManagmentComponent` 都在该模块内，纯内容复制会留下悬空的类引用。

`PalworldExplorer` 与 `PalworldMaps` 保持纯内容插件，与其源插件一致。

新增的 Palworld 玩法 C++（装备槽、属性、伤害 Execution、传送、掉落、出生点）全部落在 `PalworldCoreRuntime`，而非 `LyraGame`。理由：`LyraGame` 是上游 Lyra 代码，改动越少未来合并成本越低；且玩法类放在 GameFeature 模块内可随插件停用而整体失效，符合 `palworld-gamefeature-shells` 的停用释放要求。

`LyraGame` 只接受四项缺陷修复（见决策 2），不接受任何 Palworld 玩法规则。

替代方案是合并成单个 Palworld 插件。该方案减少一次资产重定向，但会失去"地图与玩法分离迭代"的边界，且与用户已确认的三插件结构不符，故不采用。

### 2. LyraGame 的改动限定为四项缺陷修复

| 位置 | 改动 | 为何必须在 LyraGame |
|---|---|---|
| `Inventory/LyraInventoryManagerComponent.cpp:110` | 实现 `AddEntry(ItemInstance*)` | 该函数是 Lyra 私有实现，无法从外部模块补齐；尸包拾取路径依赖它 |
| `System/LyraGameInstance.cpp:93` | `WaitDebugger()` 配置化 | FJsEnv 的创建点在此，无法从 GameFeature 覆盖 |
| `Config/DefaultPuerts.ini` | 修正 tsconfig 注册路径 | 项目级配置 |
| `TypeScript/Main.ts` + 产物 | 源码与产物同步 | 项目级脚本入口 |

前两项是行为缺陷（一个使规格无法满足，一个使 Dedicated Server 无法启动），不是功能扩展。`AddEntry` 的实现应与既有 `AddEntry(ItemDef, StackCount)` 保持一致的子对象注册与消息广播语义。

`WaitDebugger` 采用配置开关而非直接删除，保留开发者显式开启的能力，符合 `lyra-baseline-fixes` 的两个场景。

### 3. 装备槽组件挂 PlayerState，与 QuickBar 平行共存

规格 `combat-teams-and-death` 要求"死亡保留装备"，`equipment-slots-and-attributes` 要求"跨 Pawn 存活"。这直接排除了把装备槽挂在 Pawn 上——Lyra 的 `ULyraEquipmentManagerComponent` 是 `UPawnComponent`，Pawn 销毁即随之销毁。

选择 PlayerState 而非 Controller：PlayerState 在 Lyra 中已承载队伍 ID 与 StatTag 栈，且在支持的重连场景中可被保留；Controller 上已有 QuickBar，再叠加装备槽会使两套槽位系统的生命周期不一致。

新组件与 `ULyraQuickBarComponent` 平行共存，互不替代：QuickBar 管快捷武器切换（沿用 Lyra 既有链路），装备槽管穿戴与属性。物品可通过不同 Fragment 分别声明"可进入 QuickBar"与"可进入某穿戴槽"。

槽位状态使用 `FFastArraySerializer` 复制，物品实例作为子对象注册，与 `FLyraInventoryList` 的模式一致。槽位以 `FGameplayTag` 寻址（`ShooterGame.Equip.Slot.Head` 等），而非固定索引，使新增槽位不破坏既有存档与复制布局。

**属性效果的重建时机**：装备产生的 `FActiveGameplayEffectHandle` 是服务器侧状态且不复制（与 Lyra 的 `GrantedHandles` 一致）。Pawn 重生后 ASC 重新初始化，服务器需按当前槽位内容重新施加一次效果。设计要求这一步幂等——先移除已记录的旧句柄再施加，避免规格中"不出现重复叠加"的失败场景。

替代方案是把装备槽做成 `ULyraEquipmentManagerComponent` 的子类。该方案能复用其 AbilitySet 授予与 Actor spawn 逻辑，但继承了 `UPawnComponent` 的生命周期，与"死亡保留装备"直接冲突，故不采用；确需装备附带能力时，由装备槽组件在写入后调用 Pawn 侧的既有装备管理器。

### 4. 新建攻击防御 Execution，不修改 LyraDamageExecution

规格 `combat-teams-and-death` 同时要求"攻防参与结算"与"原 Shooter 伤害不受影响"。修改 `ULyraDamageExecution` 会同时改变 ShooterCore 所有 `GE_Damage_*` 的行为，违反后者。

因此在 `ShooterCoreRuntime` 新建 `UPalWorldAttackDefenseExecution`（复制 `Source/LyraGame/AbilitySystem/Executions/LyraDamageExecution.*` 后重命名修改），捕获攻击（Source）与防御（Target）属性，并沿用 Lyra 的队伍许可乘数与距离/材质衰减语义。新增/配置的 `GE_Damage_*` 资产改指向新 Execution；原 Shooter 的资产保持指向 `ULyraDamageExecution`。

攻防属性放在新的 `UPalWorldAttackDefenseSet`（`ShooterCoreRuntime`，复制 `Source/LyraGame/AbilitySystem/Attributes/LyraCombatSet.*` 后重命名修改），只含攻击与防御两项；生命值继续使用 `ULyraHealthSet`，不重复定义。

**伤害下限**：规格要求"防御高于攻击时最终伤害为零而非负值"。Execution 内在输出前对最终值取 `Max(..., 0)`，与 Lyra 现有做法一致。具体的攻防合成公式（减法、除法或曲线）留待实施时确定，不影响本设计的模块边界与规格可验证性。

### 5. 传送：服务器权威窄接口 + TypeScript 编排

传送执行必须在服务器（规格 `world-zone-travel`）。采用与 `ULyraTeamStatics` 一致的窄接口模式：

- 接口输入为 WorldContext、目标玩家、目标点标识（区域 Tag，基地点另带队伍 ID）。
- 函数体内校验 World、目标有效性、Authority 与目标点存在性。
- 返回可诊断枚举（Success / NotAuthority / InvalidTarget / UnknownDestination / NoTeam），而非仅日志或断言。
- 内部执行 Pawn 移动。

TypeScript 侧负责"何时传送谁到哪"的编排（撤离流程、交互入口的业务判定），但每次写入都经过上述 C++ 边界二次校验。TS 内先判断 net role 只是快速失败，不构成安全边界。

不新增按字符串调用任意服务器函数的通用 RPC，与既有 `lyra-puerts-exposure` 方向一致。

**World Partition 的作用**：规格要求"玩家可分散在不同区域"。WP 的距离流送以每个客户端为独立 streaming source，天然满足该要求，无需手写 `LoadStreamLevel` 状态机。传统 Streaming Sublevel 的加载状态是 World 全局的，做不到玩家间隔离——这是选择沿用 `L_Expanse` 而非新建传统流送地图的决定性理由。服务器端需确认流送配置允许服务器按各客户端位置流送。

### 6. Phase 采用 Lyra 父子 Tag 语义，撤离与进行互斥

`ULyraGamePhaseSubsystem` 的语义是：新 Phase 若不是当前 Phase 的后代，则取消当前 Phase（`MatchesTag` 判定）。据此设计 Tag 层级：

```text
ShooterGame.GamePhase.Warmup
ShooterGame.GamePhase.Playing
ShooterGame.GamePhase.Playing.Free   // 自由模式，与 Playing 共存
ShooterGame.GamePhase.Extract        // Playing 的兄弟，启动时自动取消 Playing 及其子 Phase
ShooterGame.GamePhase.MatchEnd
```

把 Extract 设为 Playing 的兄弟而非子级，是为了让"撤离阶段启动 → 进行阶段结束"由子系统的既有语义自动保证，无需在 TS 中手工取消，减少漏取消的失败模式。

自由模式与计时模式的差异由 UserFacingExperience 配置承载：自由模式启动 `Playing.Free` 且不注册局时计时器；计时模式启动 `Playing` 并注册计时器。两种模式共用同一套 Phase GA 类，不分叉实现。

**局时复制**：规格要求全局共享而非每玩家独立。GameState 复制"局时结束的服务器时间戳"，客户端本地按该时间戳插值显示，避免每秒复制剩余秒数。晚加入客户端读到同一时间戳即可得到正确的剩余时间，满足"晚加入状态恢复"场景。

Phase GA 类的承载方式沿用既有方向：优先尝试保存型 TypeScript Blueprint，若其在 Cook 或 Dedicated Server 上加载不稳定，回退为无事件图的 Blueprint 配置壳（只填 `GamePhaseTag`），规则仍留在 TS 的 Coordinator。该回退不改变任何规格行为。

### 7. 复活点按队伍基地过滤，替换而非修改 TDM 组件

ShooterCore 已有的 `UTDM_PlayerSpawningManagmentComponent` 实现的是"离敌人最远"，与"回本队基地"冲突。设计为在 `ShooterCoreRuntime` 新建出生点组件，覆写 `OnChoosePlayerStart`：按 `ALyraPlayerStart::StartPointTags` 中的队伍标记过滤出本队基地点位，再在其中选择未被占用者。

不修改已有的 TDM 组件，而是新建并在 ShooterCore 的搜打撤 Experience 中挂载不同组件——保持两种选点策略并存，便于对照调试。

玩家无队伍时的处理与 TDM 组件一致：返回 nullptr 交由上游回退随机未占用点，避免早期登录阶段（队伍尚未分配）无法出生。

### 8. C++ 与 TypeScript 的职责切分依据

切分依据是技术必要性，不是偏好。以下能力**必须**是 C++，因为 PuerTS 无法提供：

- `FFastArraySerializer` 复制结构与 `UPROPERTY` 反射（装备槽、背包）
- `UAttributeSet` 与 `UGameplayEffectExecutionCalculation`（攻防与伤害）
- 可复制子对象的注册（物品实例）
- Authority 安全边界的函数体校验（传送、装备写入）
- 引擎虚函数覆写（出生点选择）

以下留在 TypeScript：

- Phase 流程编排与局时计时器管理
- 撤离时的玩家遍历与分流决策
- 传送入口的业务判定
- 装备/卸下的意图提交与前置校验
- UI Presenter 与 ViewState 生成

TS 模块按 GameFeature 组织，通过既有的 GameFeature 生命周期观察机制激活与释放，每个模块持有可集中释放的作用域以清理委托、计时器与弱 World 引用。多 GameInstance（PIE 多实例）下各 VM 独立，不共享脚本实例或 UObject 引用。

### 9. UI 沿用数据驱动装配，不修改 ALyraHUD

背包与装备栏通过 `HUD.Slot.*` 插槽 + `UGameFeatureAction_AddWidgets` 挂载，数据来源是 `GameplayMessageSubsystem` 广播。新增装备槽变更消息 Tag，与 Lyra 既有背包消息模式一致。

已知约束：`W_QuickBar` / `W_QuickBarSlot` 是纯蓝图，无 C++ 基类可继承。装备栏 Widget 需要新建逻辑基类（C++ 或 TypeScript Presenter）而非继承 QuickBar 的实现。

规格要求"装备操作被服务器拒绝时界面回到权威状态"。设计上界面不做乐观更新——提交意图后等待复制回传再刷新，使拒绝路径无需额外回滚逻辑。

## Risks / Trade-offs

- [资产复制后引用未完全重定向，Palworld 资产仍指向 ShooterCore] → 复制后在 Editor 内执行 Fix Up Redirectors 并做引用审计；验收包含"停用 Shooter 三插件后 Palworld Experience 仍可启动"。
- [Tag 重命名遗漏，导致运行时找不到 Phase 或 Slot] → 启动 Editor 检查 GameplayTag 缺失/冲突日志；Phase 与 Slot Tag 在联机验收中逐个走到。
- [`AddEntry(ItemInstance*)` 实现与既有 `AddEntry(ItemDef)` 的子对象注册语义不一致，导致客户端拿不到实例] → 双客户端验收明确覆盖"拾取尸包后客户端可读取物品定义与 StatTags"。
- [装备属性效果在 Pawn 重生后重复叠加] → 施加前先移除已记录句柄；验收覆盖"连续死亡重生三次后属性数值不累积"。
- [`InteractionAbilityCache` 只增不减，交互物种类多时玩家 ASC 上能力持续累积] → 本变更沿用 Lyra 现状，不修复；在文档中记录该限制，若 Palworld 的交互物种类显著多于 ShooterExplorer 再单独立项。
- [World Partition 服务器端流送配置不当，导致远处玩家所在区域未加载] → 传送验收明确覆盖"A 在副本、B 在基地"的双客户端场景，检查双方 Actor 可见性与位置复制。
- [TypeScript Blueprint 在 Cook 或 Dedicated Server 上加载不稳定] → 先做小型 Phase 探针；失败则回退无逻辑 Blueprint 壳，规则留在 TS，规格行为不变。
- [`WaitDebugger` 配置化后开发者本机调试流程改变] → 保留显式开启开关并在文档记录，默认关闭只影响无人值守启动。
- [修改 `LyraGame` 增加未来上游合并成本] → 改动限定为四项缺陷修复，不含任何玩法规则；玩法 C++ 全部在 `ShooterCoreRuntime`。
- [脚本产物未进入打包，Shipping 下玩法缺失] → Cook/Stage 后检查 Stage 目录中 Palworld 脚本产物存在，作为独立验收项。

## Migration Plan

1. 先完成基线修复（背包实例路径、启动阻塞、tsconfig 注册、脚本产物同步），通过编译与类型检查。
2. 复制三个插件并完成 Tag 迁移与资产重定向；验收原 Shooter 三件套不回归。
3. 加入传送与区域状态的 C++ 边界与 TS 编排，在单机与双客户端验证位置复制。
4. 加入 Phase 骨架与两套 Experience 配置，验证阶段顺序与晚加入恢复。
5. 加入装备槽、属性与伤害 Execution，验证属性增减与原 Shooter 伤害不变。
6. 加入死亡掉落与按队伍基地复活，完成双客户端风险回报闭环验收。
7. 最后接入 UI，替换视觉资产不影响前述服务。
8. 每个里程碑保持 Palworld 三插件可整体停用；回滚时先从 Experience 移除 Feature，再移除对应脚本与 C++。

## Open Questions

- 攻防合成的具体公式形态（减法、除法或曲线）与数值区间，需在实施阶段配合实际数值试玩确定；不影响模块边界与规格场景。
- 可探索区域的具体数量与在 `L_Expanse` 中的空间布局，由地图搭建阶段确定。
- Phase GA 是否最终采用 TypeScript Blueprint 或 Blueprint 配置壳，取决于探针在 Cook 与 Dedicated Server 上的实测结果。
