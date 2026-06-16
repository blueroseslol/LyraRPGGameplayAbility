# Lyra GAS 使用指南

## 一、ASC 的位置与架构

| 持有者 | ASC 实例 | 用途 |
|---|---|---|
| `ALyraPlayerState` | `ULyraAbilitySystemComponent` | 玩家专属，持有玩家所有能力/属性/效果 |
| `ALyraGameState` | `ULyraAbilitySystemComponent` | 全局，用于游戏阶段能力（GamePhase）和全局效果 |

`ALyraCharacter` 实现 `IAbilitySystemInterface`，返回 PlayerState 上的 ASC，Avatar 为 Character 本身。  
`ULyraGlobalAbilitySystem`（WorldSubsystem）可将全局能力/效果批量应用给场景中所有注册的 ASC。

---

## 二、AbilitySet：能力集数据资产

`ULyraAbilitySet`（`UPrimaryDataAsset`）是打包授予的核心单元，包含：

| 字段 | 类型 | 说明 |
|---|---|---|
| `GrantedGameplayAbilities` | `TArray<FLyraAbilitySet_GameplayAbility>` | 能力类 + 等级 + 绑定 InputTag |
| `GrantedGameplayEffects` | `TArray<FLyraAbilitySet_GameplayEffect>` | 效果类 + 等级（授予时立即应用） |
| `GrantedAttributes` | `TArray<FLyraAbilitySet_AttributeSet>` | 属性集类（自动实例化并注册） |

**授予：**
```cpp
FLyraAbilitySet_GrantedHandles OutHandles;
AbilitySet->GiveToAbilitySystem(LyraASC, &OutHandles, SourceObject);
```

**撤销：**
```cpp
OutHandles.TakeFromAbilitySystem(LyraASC);
```

通过 `GameFeatureAction_AddAbilities` 自动调用，GameFeature 卸载时自动撤销。

---

## 三、GameplayAbility

### 基类层级

```
UGameplayAbility
  └─ ULyraGameplayAbility          ← 所有 Lyra 能力的基类
       ├─ ULyraGameplayAbility_Death
       ├─ ULyraGameplayAbility_Jump
       ├─ ULyraGameplayAbility_Reset
       ├─ ULyraGameplayAbility_FromEquipment   ← 装备能力基类
       │    └─ ULyraGameplayAbility_RangedWeapon
       └─ ULyraGameplayAbility_Interact
```

### 激活策略（ActivationPolicy）

| 策略 | 触发时机 |
|---|---|
| `OnInputTriggered` | 按键按下时激活 |
| `WhileInputActive` | 持续按住时每帧尝试激活 |
| `OnSpawn` | ASC 关联 Avatar 时服务器自动激活 |

### 激活组（ActivationGroup）

| 组 | 行为 |
|---|---|
| `Independent` | 不受其他能力限制，自由运行 |
| `Exclusive_Replaceable` | 有 Blocking 能力运行时被阻止；被新的 Exclusive 能力替换 |
| `Exclusive_Blocking` | 阻止其他所有 Exclusive 能力激活 |

同一时刻最多只有一个 Exclusive 能力在运行（`ensure` 强制保证）。

---

## 四、AttributeSet

| 类 | 属性 | 备注 |
|---|---|---|
| `ULyraHealthSet` | Health、MaxHealth、Healing（元属性）、Damage（元属性） | 提供 `OnHealthChanged`、`OnOutOfHealth` 委托 |
| `ULyraCombatSet` | BaseDamage、BaseHeal | 供 DamageExecution / HealExecution 读取基础值 |
| `UTopDownArenaAttributeSet` | 自定义属性（TopDownArena 插件） | 示例：如何在 GameFeature 中扩展属性 |

属性修改规则：
- Healing / Damage 是**元属性**（无 Replication），仅在 `PostGameplayEffectExecute` 中读取并转为 Health 变化
- 所有 Final 属性变化都在服务器发生，通过 `OnRep` 同步给客户端

---

## 五、GameplayEffect 与执行计算

### 伤害执行（DamageExecution）

```
GE 触发 ULyraDamageExecution::Execute_Implementation
  → 读取 LyraCombatSet.BaseDamage（SetByCaller 或 Magnitude Calculation）
  → 调用 ILyraAbilitySourceInterface 获取物理材质/距离衰减系数
  → 输出到 LyraHealthSet.Damage（元属性）
  → PostGameplayEffectExecute: Health -= Damage，广播 OnHealthChanged
  → Health <= 0：广播 OnOutOfHealth → 触发死亡能力 GA_Death
```

### SetByCaller 标签

| 标签 | 用途 |
|---|---|
| `SetByCaller.Damage` | 伤害量（由能力或 GE 外部设置） |
| `SetByCaller.Heal` | 治疗量 |

---

## 六、GameplayCue

- `ULyraGameplayCueManager` 继承 `UGameplayCueManager`，管理 GameplayCue 异步加载
- GameplayCue 资产存放在 GameFeature 插件的 Content 目录（如 `ShooterCore/Content/GameplayCues/`）
- `UGameFeatureAction_AddGameplayCuePath`：GameFeature 激活时动态注册 GameplayCue 搜索路径

```cpp
// 在 GE 或能力中触发 GameplayCue
FGameplayCueParameters Params;
Params.RawMagnitude = DamageAmount;
ASC->ExecuteGameplayCue(TAG_GameplayCue_Death, Params);
```

---

## 七、GamePhase 系统

游戏阶段通过 **GAS 的父子能力机制** 实现状态隔离：

- `ULyraGamePhaseAbility`：特殊能力，只能在 **GameState** 的全局 ASC 上运行
- `ULyraGamePhaseSubsystem`（WorldSubsystem）：
  - `StartPhase(PhaseAbility)`：在全局 ASC 上激活阶段能力（自动取消父阶段的同级/子阶段）
  - `WhenPhaseStartsOrIsActive` / `WhenPhaseEnds`：注册阶段监听委托

示例阶段资产（ShooterCore）：`Phase_Warmup` → `Phase_Playing` → `Phase_PostGame`

---

## 八、网络同步与专用服务器

### 核心原则

| 规则 | 说明 |
|---|---|
| **能力仅在服务器授予** | `AddActorAbilities` 首行检查 `Actor->HasAuthority()`，客户端不授予 |
| **ASC 自动同步给客户端** | `UAbilitySystemComponent` 通过网络复制同步已授予的能力列表 |
| **属性仅在服务器修改** | GE 执行和属性计算仅在服务器发生，通过 `OnRep` 推送给客户端 |
| **输入预测** | 客户端本地预测激活，服务器确认；使用 `InvokeReplicatedEvent` 而非直接输入复制 |

### InputPressed/Released 复制

```cpp
// LyraAbilitySystemComponent.cpp
void ULyraAbilitySystemComponent::AbilitySpecInputPressed(FGameplayAbilitySpec& Spec)
{
    Super::AbilitySpecInputPressed(Spec);
    // 使用 InvokeReplicatedEvent 而非 bReplicateInputDirectly
    // 确保 WaitInputPress/Release AbilityTask 在预测窗口内正确工作
    if (Spec.IsActive())
    {
        InvokeReplicatedEvent(EAbilityGenericReplicatedEvent::InputPressed, ...);
    }
}
```

### 能力激活失败通知

```cpp
// 服务器 → 客户端 RPC（Unreliable）
UFUNCTION(Client, Unreliable)
void ClientNotifyAbilityFailed(const UGameplayAbility* Ability, const FGameplayTagContainer& FailureReason);
```

客户端收到后调用 `OnAbilityFailedToActivate`（可在蓝图中重写以显示 UI 提示）。

### 专用服务器要点

1. **Bundle 加载分离**：`StartExperienceLoad` 根据 NetMode 仅加载对应平台的资产 Bundle（`ServerBundles` / `ClientBundles`）
2. **客户端 Experience 同步**：`CurrentExperience` 属性通过 `OnRep_CurrentExperience` 在客户端触发相同的加载流程
3. **Bot 使用相同 ASC**：`ALyraPlayerBotController` 使用与玩家相同的 GAS 基础设施，确保 AI 行为与玩家能力系统一致
4. **ReplicationGraph**：项目启用 `ReplicationGraph` 插件（`LyraReplicationGraph`），按区域/队伍过滤复制，减少服务器带宽

### 输入阻断标签

```
Gameplay.AbilityInputBlocked
```
若 ASC 持有此标签，`ProcessAbilityInput` 会跳过所有输入处理。可用于 UI 打开时屏蔽技能输入。

---

## 九、动态标签（Dynamic Tag GE）

```cpp
// 运行时授予一个临时 Gameplay Tag
LyraASC->AddDynamicTagGameplayEffect(TAG_Status_Crouching);
// 移除
LyraASC->RemoveDynamicTagGameplayEffect(TAG_Status_Crouching);
```

内部通过 `ULyraGameData.DynamicTagGameplayEffect` 配置的 GE 类实现，无需手动创建 GE 资产。

---

## 十、Tag 关系映射（AbilityTagRelationshipMapping）

`ULyraAbilityTagRelationshipMapping` 数据资产，配置能力标签之间的阻断/取消关系：

```
配置示例：
  标签 A（冲刺）阻断 标签 B（蹲伏）
  标签 C（眩晕）取消 标签 A（冲刺）
```

ASC 在 `ApplyAbilityBlockAndCancelTags` 和 `GetAdditionalActivationTagRequirements` 中查询此映射，设计师可在不修改代码的情况下调整能力之间的互斥关系。

---

## 十一、资产使用快速参考

| 资产类型                          | 路径示例                                                 | 说明                              |
| ----------------------------- | ---------------------------------------------------- | ------------------------------- |
| AbilitySet                    | `ShooterCore/Content/AbilitySet_ControlPoint.uasset` | 打包授予的能力集                        |
| GameplayAbility               | `ShooterCore/Content/Abilities/GA_Melee.uasset`      | 蓝图能力实现                          |
| GameplayEffect                | 各 Content 目录                                         | GE 资产，配置 Modifiers 和 Executions |
| AttributeSet                  | C++ 类（`LyraHealthSet`、`LyraCombatSet`）               | 通常由 AbilitySet 授予               |
| GameplayCue                   | `ShooterCore/Content/GameplayCues/GCNL_Death.uasset` | 网络通知特效/音效                       |
| AbilityTagRelationshipMapping | 项目 Content 目录                                        | 配置 Tag 互斥关系                     |

### 11.1 资产清单（层级视图）

#### AbilitySet（`UPrimaryDataAsset` → `ULyraAbilitySet`）

- **C++ 基类**
    - `ULyraAbilitySet` (`Source/LyraGame/AbilitySystem/LyraAbilitySet.h`) — 非可变数据资产，打包授予能力/效果/属性集
- **蓝图资产**（按模块）
    - **ShooterCore（游戏核心）**
        - `AbilitySet_ShooterHero` (`Plugins/GameFeatures/ShooterCore/Content/Game/`) — 射击者英雄基础能力集
        - `AbilitySet_Elimination` (`Plugins/GameFeatures/ShooterCore/Content/Elimination/`) — 淘汰模式能力集
        - `AbilitySet_ControlPoint` (`Plugins/GameFeatures/ShooterCore/Content/ControlPoint/`) — 控制点模式能力集
        - `AbilitySet_ShooterRifle` (`Plugins/GameFeatures/ShooterCore/Content/Weapons/Rifle/`) — 步枪武器能力集
        - `AbilitySet_ShooterShotgun` (`Plugins/GameFeatures/ShooterCore/Content/Weapons/Shotgun/`) — 霰弹枪武器能力集
        - `AbilitySet_ShooterPistol` (`Plugins/GameFeatures/ShooterCore/Content/Weapons/Pistol/`) — 手枪武器能力集
        - `AbilitySet_ShooterNetShooter` (`Plugins/GameFeatures/ShooterCore/Content/Weapons/NetShooter_PROTO/`) — NetShooter 武器能力集
        - `AbilitySet_HealPickup` (`Plugins/GameFeatures/ShooterCore/Content/Items/HealthPickup_Unused/`) — 治疗拾取能力集
    - **ShooterExplorer（探索玩法）**
        - `AbilitySet_InventoryTest` (`Plugins/GameFeatures/ShooterExplorer/Content/Input/Abilities/`) — 背包系统测试能力集
    - **TopDownArena（俯视角竞技）**
        - `AbilitySet_Arena` (`Plugins/GameFeatures/TopDownArena/Content/Game/`) — 竞技场英雄能力集
    - **项目主 Content**
        - `ShootingTarget_AbilitySet` (`Content/Weapons/Tests/`) — 射击靶子测试能力集

#### GameplayAbility（`UGameplayAbility` → `ULyraGameplayAbility` → ...）

- **C++ 类层级**
    - `ULyraGameplayAbility` (`Source/LyraGame/AbilitySystem/Abilities/LyraGameplayAbility.h`) — 所有 Lyra 能力的基类（自定义激活策略/激活组/成本系统）
        - `ULyraGameplayAbility_Death` (`Source/LyraGame/AbilitySystem/Abilities/LyraGameplayAbility_Death.h`) — 死亡能力
        - `ULyraGameplayAbility_Jump` (`Source/LyraGame/AbilitySystem/Abilities/LyraGameplayAbility_Jump.h`) — 跳跃能力
        - `ULyraGameplayAbility_Reset` (`Source/LyraGame/AbilitySystem/Abilities/LyraGameplayAbility_Reset.h`) — 重置能力
        - `ULyraGameplayAbility_FromEquipment` (`Source/LyraGame/Equipment/LyraGameplayAbility_FromEquipment.h`) — 装备能力基类（关联装备实例）
            - `ULyraGameplayAbility_RangedWeapon` (`Source/LyraGame/Weapons/LyraGameplayAbility_RangedWeapon.h`) — 远程武器能力
        - `ULyraGameplayAbility_Interact` (`Source/LyraGame/Interaction/Abilities/LyraGameplayAbility_Interact.h`) — 交互能力
- **蓝图资产**（按模块）
    - **项目主 Content**
        - `GA_Hero_Death` (`Content/Characters/Heroes/Abilities/`) — 英雄死亡
        - `GA_Hero_Heal` (`Content/Characters/Heroes/Abilities/`) — 英雄治疗
        - `GA_Hero_Jump` (`Content/Characters/Heroes/Abilities/`) — 英雄跳跃
        - `GA_AbilityWithWidget` (`Content/Characters/Heroes/Abilities/`) — 带 UI 的能力示例
        - `GA_Weapon_Fire` (`Content/Weapons/`) — 武器开火
        - `GA_Weapon_ReloadMagazine` (`Content/Weapons/`) — 弹匣换弹
        - `GA_Weapon_AutoReload` (`Content/Weapons/`) — 自动换弹
        - `GA_Weapon_Reload_Pistol` (`Content/Weapons/Pistol/`) — 手枪换弹
    - **ShooterCore**
        - `GA_AutoRespawn` (`Plugins/GameFeatures/ShooterCore/Content/Game/Respawn/`) — 自动重生
        - `GA_SpawnEffect` (`Plugins/GameFeatures/ShooterCore/Content/Game/Respawn/`) — 出生特效
        - `GA_Melee` (`Plugins/GameFeatures/ShooterCore/Content/Game/Melee/`) — 近战攻击
        - `GA_Hero_Dash` (`Plugins/GameFeatures/ShooterCore/Content/Game/Dash/`) — 冲刺
        - `GA_Emote` (`Plugins/GameFeatures/ShooterCore/Content/Game/Emote/`) — 表情动作
        - `GA_QuickbarSlots` (`Plugins/GameFeatures/ShooterCore/Content/Game/`) — 快捷栏槽位
        - `GA_ADS` (`Plugins/GameFeatures/ShooterCore/Content/Input/Abilities/`) — 瞄准（ADS）
        - `GA_Grenade` (`Plugins/GameFeatures/ShooterCore/Content/Input/Abilities/`) — 投掷手雷
        - `GA_DropWeapon` (`Plugins/GameFeatures/ShooterCore/Content/Input/Abilities/`) — 丢弃武器
        - `GA_Weapon_Fire_Pistol` (`Plugins/GameFeatures/ShooterCore/Content/Weapons/Pistol/`) — 手枪开火
        - `GA_Weapon_Fire_Rifle_Auto` (`Plugins/GameFeatures/ShooterCore/Content/Weapons/Rifle/`) — 步枪自动开火
        - `GA_Weapon_Fire_Shotgun` (`Plugins/GameFeatures/ShooterCore/Content/Weapons/Shotgun/`) — 霰弹枪开火
        - `GA_Weapon_Reload_Rifle` (`Plugins/GameFeatures/ShooterCore/Content/Weapons/Rifle/`) — 步枪换弹
        - `GA_Weapon_Reload_Shotgun` (`Plugins/GameFeatures/ShooterCore/Content/Weapons/Shotgun/`) — 霰弹枪换弹
        - `GA_Weapon_Reload_NetShooter` (`Plugins/GameFeatures/ShooterCore/Content/Weapons/Shotgun/`) — NetShooter 换弹
        - `GA_WeaponNetShooter` (`Plugins/GameFeatures/ShooterCore/Content/Weapons/NetShooter_PROTO/`) — NetShooter 武器
        - `GA_HealPickup` (`Plugins/GameFeatures/ShooterCore/Content/Items/HealthPickup_Unused/`) — 治疗拾取
        - `GA_ShowLeaderboard_CP` (`Plugins/GameFeatures/ShooterCore/Content/ControlPoint/`) — 显示控制点计分板
        - `GA_ShowLeaderboard_TDM` (`Plugins/GameFeatures/ShooterCore/Content/Elimination/`) — 显示 TDM 计分板
    - **ShooterExplorer**
        - `GA_Interact` (`Plugins/GameFeatures/ShooterExplorer/Content/Input/Abilities/`) — 交互
        - `GA_ToggleInventory` (`Plugins/GameFeatures/ShooterExplorer/Content/Input/Abilities/`) — 切换背包
        - `GA_ToggleMap` (`Plugins/GameFeatures/ShooterExplorer/Content/Input/Abilities/`) — 切换地图
        - `GA_ToggleMarkerInWorld` (`Plugins/GameFeatures/ShooterExplorer/Content/Input/Abilities/`) — 切换世界标记
        - `GA_Interaction_Collect` (`Plugins/GameFeatures/ShooterExplorer/Content/Interact/`) — 收集交互
        - `GA_Interaction_Sit` (`Plugins/GameFeatures/ShooterExplorer/Content/Interact/`) — 坐下交互
    - **TopDownArena**
        - `GA_ArenaHero_Death` (`Plugins/GameFeatures/TopDownArena/Content/Game/`) — 竞技场英雄死亡
        - `GA_DropBomb` (`Plugins/GameFeatures/TopDownArena/Content/Game/Bombs/`) — 放置炸弹

#### GameplayEffect（`UGameplayEffect`）

- **C++ 上下文/执行器**
    - `ULyraGameplayEffectContext` (`Source/LyraGame/AbilitySystem/LyraGameplayEffectContext.h`) — 扩展 GE Context（携带物理材质/距离衰减信息）
    - `ULyraDamageExecution` (`Source/LyraGame/AbilitySystem/Executions/LyraDamageExecution.h`) — 伤害 Calculation 执行器
- **蓝图资产**（按用途）
    - **伤害类（Damage）**
        - `GE_Damage_Basic_SetByCaller` (`Content/GameplayEffects/Damage/`) — 基于 SetByCaller 的伤害
        - `GE_Damage_Basic_Instant` (`Content/GameplayEffects/Damage/`) — 即时伤害
        - `GE_Damage_Basic_Periodic` (`Content/GameplayEffects/Damage/`) — 周期性伤害
        - `GE_Damage_Pistol` (`Content/Weapons/Pistol/`) — 手枪伤害
        - `GE_Damage_Melee` (`Plugins/GameFeatures/ShooterCore/Content/Weapons/`) — 近战伤害
        - `GE_Damage_Grenade` (`Plugins/GameFeatures/ShooterCore/Content/Weapons/Grenade/`) — 手雷伤害
        - `GE_Damage_RifleAuto` (`Plugins/GameFeatures/ShooterCore/Content/Weapons/Rifle/`) — 步枪伤害
        - `GE_Damage_Shotgun` (`Plugins/GameFeatures/ShooterCore/Content/Weapons/Shotgun/`) — 霰弹枪伤害
        - `GE_Damaged_By_Bomb` (`Plugins/GameFeatures/TopDownArena/Content/Game/Bombs/`) — 炸弹伤害
    - **治疗类（Heal）**
        - `GE_Heal_SetByCaller` (`Content/GameplayEffects/Heal/`) — 基于 SetByCaller 的治疗
        - `GE_Heal_Instant` (`Content/GameplayEffects/Heal/`) — 即时治疗
        - `GE_Heal_Periodic` (`Content/GameplayEffects/Heal/`) — 周期性治疗
        - `GE_InstantHeal_Big` (`Plugins/GameFeatures/ShooterCore/Content/Items/HealthPickup/`) — 大治疗包
        - `GE_InstantHeal_Part` (`Plugins/GameFeatures/ShooterCore/Content/Items/HealthPickup/`) — 部分治疗包
        - `GE_InstantHeal_Pickup` (`Plugins/GameFeatures/ShooterCore/Content/Items/HealthPickup/`) — 治疗拾取
    - **Tag 与状态控制类**
        - `GE_DynamicTag` (`Content/GameplayEffects/`) — 动态 Tag 授予（`ULyraGameData` 配置的具体 GE 类）
        - `GE_IsPlayer` (`Content/GameplayEffects/`) — 标记为玩家
        - `GE_BlockAbilityInput` (`Content/GameplayEffects/`) — 阻断能力输入
        - `GE_HeroDash_Cooldown` (`Content/GameplayEffects/`) — 冲刺冷却
    - **游戏阶段类（GamePhase）**
        - `GE_PregameLobby` (`Plugins/GameFeatures/ShooterCore/Content/Experiences/Phases/`) — 赛前大厅
        - `GE_DamageImmunity_FromGameMode` (`Plugins/GameFeatures/ShooterCore/Content/Experiences/Phases/`) — 游戏模式伤害免疫
        - `GE_SpawnIn` (`Plugins/GameFeatures/ShooterCore/Content/Game/Respawn/`) — 重生无敌
        - `GE_Warmup` (`Plugins/GameFeatures/TopDownArena/Content/Game/Modes/`) — 热身阶段
    - **道具/强化类（Pickup & Powerup）**
        - `GE_AdditionalHeart` (`Plugins/GameFeatures/TopDownArena/Content/Game/Pickups/`) — 额外生命
        - `GE_BombCountUp` (`Plugins/GameFeatures/TopDownArena/Content/Game/Pickups/`) — 炸弹数量增加
        - `GE_BombRangeUp` (`Plugins/GameFeatures/TopDownArena/Content/Game/Pickups/`) — 炸弹范围增加
        - `GE_MoveSpeedUp` (`Plugins/GameFeatures/TopDownArena/Content/Game/Pickups/`) — 移动速度增加
        - `GE_Stat_MoveSpeed` (`Plugins/GameFeatures/TopDownArena/Content/Game/Powerups/`) — 移动速度属性
        - `GE_Stat_BombCount` (`Plugins/GameFeatures/TopDownArena/Content/Game/Powerups/`) — 炸弹计数属性
        - `GE_Stat_FireRange` (`Plugins/GameFeatures/TopDownArena/Content/Game/Powerups/`) — 爆炸范围属性
        - `GE_DecrementBombsRemaining` (`Plugins/GameFeatures/TopDownArena/Content/Game/Bombs/`) — 炸弹剩余-1
        - `GE_IncrementBombsRemaining` (`Plugins/GameFeatures/TopDownArena/Content/Game/Bombs/`) — 炸弹剩余+1
        - `GE_Grenade_Cooldown` (`Plugins/GameFeatures/ShooterCore/Content/Weapons/Grenade/`) — 手雷冷却
    - **测试/环境类**
        - `GE_GameplayCueTest_Burst` (`Content/GameplayEffects/`) — GameplayCue 测试（Burst）
        - `GE_GameplayCueTest_BurstLatent` (`Content/GameplayEffects/`) — GameplayCue 测试（BurstLatent）
        - `GE_GameplayCueTest_Looping` (`Content/GameplayEffects/`) — GameplayCue 测试（Looping）
        - `GE_GameplayEffectPad_Damage` (`Content/Environments/Gameplay/`) — 效果垫（伤害）
        - `GE_GameplayEffectPad_Heal` (`Content/Environments/Gameplay/`) — 效果垫（治疗）
        - `GE_HugeHealthTarget` (`Content/Weapons/Tests/`) — 大血量靶子
        - `BP_GameplayEffectPad` (`Content/Environments/Gameplay/`) — 效果垫 Actor（BP）
        - `B_GameplayEffectPad_Child_Healing` (`Content/Environments/Gameplay/`) — 治疗效果垫子类（BP）
        - `BP_GameplayEffectPad_Forcefeedback` (`Plugins/GameFeatures/ShooterTests/Content/Blueprint/`) — 力反馈效果垫（测试）
    - **GameplayEffect 父类（用于子类继承配置）**
        - `GameplayEffectParent_Damage_Basic` (`Content/GameplayEffects/Damage/`) — 伤害 GE 父类
        - `GameplayEffectParent_Heal` (`Content/GameplayEffects/Heal/`) — 治疗 GE 父类

#### AttributeSet（`UAttributeSet` → `ULyraAttributeSet` → ...）

- **C++ 类层级**
    - `ULyraAttributeSet` (`Source/LyraGame/AbilitySystem/Attributes/LyraAttributeSet.h`) — Lyra 属性集基类（提供通用的 ASC 获取方法）
        - `ULyraHealthSet` (`Source/LyraGame/AbilitySystem/Attributes/LyraHealthSet.h`) — 生命属性集：`Health`、`MaxHealth`、`Healing`（元属性）、`Damage`（元属性）；提供 `OnHealthChanged`、`OnOutOfHealth` 委托
        - `ULyraCombatSet` (`Source/LyraGame/AbilitySystem/Attributes/LyraCombatSet.h`) — 战斗属性集：`BaseDamage`、`BaseHeal`，供 DamageExecution / HealExecution 使用
    - `UTopDownArenaAttributeSet` (`Plugins/GameFeatures/TopDownArena/Source/TopDownArenaRuntime/Private/TopDownArenaAttributeSet.h`) — 俯视角竞技场自定义属性集（GameFeature 插件示例）

#### GameplayCue（`UGameplayCueManager` → `ULyraGameplayCueManager` + 蓝图通知）

- **C++ 基础组件**
    - `ULyraGameplayCueManager` (`Source/LyraGame/AbilitySystem/LyraGameplayCueManager.h`) — 游戏级 GameplayCue 管理器（异步加载、延迟加载、预加载策略）
    - `UGameFeatureAction_AddGameplayCuePath` (`Source/LyraGame/GameFeatures/GameFeatureAction_AddGameplayCuePath.h`) — GameFeature 激活时动态注册 GameplayCue 搜索路径
- **蓝图资产**（GCN = GameplayCueNotify，GCNL = GameplayCueNotify_Looping）
    - **项目主 Content（角色/武器基础反馈）**
        - `GCNL_Character_DamageTaken` (`Content/GameplayCueNotifies/`) — 角色受击（Looping）
        - `GCN_Character_Heal` (`Content/GameplayCueNotifies/`) — 角色治疗（Burst）
        - `GCN_Weapon_Impact` (`Content/GameplayCueNotifies/`) — 武器命中特效（Burst）
        - `GCNL_Widget_Base` (`Content/GameplayCueNotifies/`) — Widget 基础 GameplayCue（Looping）
        - `I_GameplayCueWidget` (`Content/GameplayCueNotifies/`) — GameplayCue Widget 接口
    - **ShooterCore（射击核心反馈）**
        - `GCNL_Death` (`Plugins/GameFeatures/ShooterCore/Content/GameplayCues/`) — 死亡特效（Looping）
        - `GCNL_Spawning` (`Plugins/GameFeatures/ShooterCore/Content/GameplayCues/`) — 出生特效（Looping）
        - `GCNL_Dash` (`Plugins/GameFeatures/ShooterCore/Content/GameplayCues/`) — 冲刺特效（Looping）
        - `GCNL_Launcher_Activate` (`Plugins/GameFeatures/ShooterCore/Content/GameplayCues/`) — 发射器激活（Looping）
        - `GCNL_Teleporter_Activate` (`Plugins/GameFeatures/ShooterCore/Content/GameplayCues/`) — 传送器激活（Looping）
        - `GCNL_WaitingForPlayers` (`Plugins/GameFeatures/ShooterCore/Content/GameplayCues/`) — 等待玩家（Looping）
        - `GCNL_MatchDecided` (`Plugins/GameFeatures/ShooterCore/Content/GameplayCues/`) — 比赛结果（Looping）
        - `GCN_InteractPickUp` (`Plugins/GameFeatures/ShooterCore/Content/GameplayCues/`) — 拾取交互（Burst）
        - `GCN_Weapon_Melee` (`Plugins/GameFeatures/ShooterCore/Content/GameplayCues/`) — 近战挥击（Burst）
        - `GCN_Weapon_MeleeImpact` (`Plugins/GameFeatures/ShooterCore/Content/GameplayCues/`) — 近战命中（Burst）
        - `GCN_Weapon_Rifle_Fire` (`Plugins/GameFeatures/ShooterCore/Content/Weapons/Rifle/`) — 步枪开火（Burst）
        - `GCN_Weapon_Shotgun_Fire` (`Plugins/GameFeatures/ShooterCore/Content/Weapons/Shotgun/`) — 霰弹枪开火（Burst）
        - `GCN_Weapon_Pistol_Fire` (`Plugins/GameFeatures/ShooterCore/Content/Weapons/Pistol/`) — 手枪开火（Burst）
        - `GCN_Grenade_Detonate` (`Plugins/GameFeatures/ShooterCore/Content/Weapons/Grenade/`) — 手雷爆炸（Burst）
    - **ShooterMaps**
        - `GC_Collect_Effect` (`Plugins/GameFeatures/ShooterMaps/Content/GameplayCues/`) — 收集效果
    - **TopDownArena**
        - `GCN_GetReady` (`Plugins/GameFeatures/TopDownArena/Content/GameplayCues/`) — 准备就绪（Burst）
        - `GCN_PickupAcquired` (`Plugins/GameFeatures/TopDownArena/Content/GameplayCues/`) — 拾取获得（Burst）
    - **测试类**
        - `GCNL_Test_Looping` (`Content/GameplayCueNotifies/`) — Looping 测试
        - `GCN_Test_Burst` (`Content/GameplayCueNotifies/`) — Burst 测试
        - `GCN_Test_BurstLatent` (`Content/GameplayCueNotifies/`) — BurstLatent 测试

#### AbilityTagRelationshipMapping（`UDataAsset` → `ULyraAbilityTagRelationshipMapping`）

- **C++ 类**
    - `ULyraAbilityTagRelationshipMapping` (`Source/LyraGame/AbilitySystem/LyraAbilityTagRelationshipMapping.h`) — 能力标签互斥/取消关系映射数据资产
    - `FLyraAbilityTagRelationship`（Struct）— 单条映射记录：`AbilityTag` → `AbilityTagsToBlock`、`AbilityTagsToCancel`、`ActivationRequiredTags`、`ActivationBlockedTags`
- **蓝图资产**
    - （当前项目中仅存在 C++ 类定义，蓝图实例由设计师在编辑器中按需创建，路径通常在 `Content/` 或对应 GameFeature 的 `Content/` 目录下）
