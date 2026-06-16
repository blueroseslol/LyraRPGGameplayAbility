# Lyra GameFeature 使用指南

## 一、GameFeature 在 Lyra 中的作用

GameFeature 插件是 Lyra 实现"游戏类型分离"的核心机制。每种游戏玩法（射击、竞技场等）以独立插件形式存在，通过 **Experience** 系统按需激活，彼此不干扰。

**设计目标：**
- 不同游戏类型的代码/资产完全隔离在各自插件中
- 同一基础框架（LyraGame）可承载多种玩法
- 运行时动态加载/卸载，支持无缝切换玩法

---

## 二、现有 GameFeature 插件

路径：`Plugins/GameFeatures/`

| 插件 | 包含 C++ | 主要内容 |
|---|---|---|
| **ShooterCore** | ✓ | 射击核心系统：瞄准辅助、积分、消灭连击、控制点、多个 Experience 定义 |
| **ShooterExplorer** | ✗ | 探索模式蓝图/资产 |
| **ShooterMaps** | ✗ | 射击地图资产 |
| **ShooterTests** | ✓ | 自动化测试 |
| **TopDownArena** | ✓ | 俯视角竞技场：自定义 AttributeSet、移动组件、相机模式 |

### ShooterCore 核心资产

| 资产 | 路径 | 说明 |
|---|---|---|
| `B_ShooterGame_Elimination` | `Content/Experiences/` | 消灭战 Experience 定义 |
| `B_LyraShooterGame_ControlPoints` | `Content/Experiences/` | 控制点模式 Experience 定义 |
| `LAS_ShooterGame_StandardHUD` | `Content/Experiences/` | 标准 HUD ActionSet（可复用） |
| `LAS_ShooterGame_SharedInput` | `Content/Experiences/` | 共享输入 ActionSet（可复用） |
| `LAS_ShooterGame_StandardComponents` | `Content/Experiences/` | 标准组件 ActionSet（可复用） |

---

## 三、Experience → GameFeature 加载链

```
地图加载
  ↓
ALyraGameMode::InitGame
  ↓
SetCurrentExperience(PrimaryAssetId)        ← 从地图的 WorldSettings 或命令行获取
  ↓
ULyraExperienceManagerComponent（在 GameState 上）
  ├─ 1. 异步加载 Experience 数据资产
  ├─ 2. Bundle 加载（Server/Client 资产分离）
  ├─ 3. LoadAndActivateGameFeaturePlugin(url)  ← 激活每个 GameFeature 插件
  └─ 4. GameFeatureAction::OnGameFeatureActivating
              ├─ AddAbilities    → 向指定 Actor 注入能力/属性集
              ├─ AddWidget       → 向 HUD 注入 UI
              ├─ AddInputContextMapping → 注入输入上下文
              └─ AddGameplayCuePath    → 注册 Cue 搜索路径
  ↓
OnExperienceLoaded 委托广播
  ├─ HighPriority（子系统初始化）
  ├─ Normal（通用逻辑）
  └─ LowPriority（UI、设置）
```

**客户端同步：** `CurrentExperience` 属性通过网络复制，客户端收到后触发相同加载流程（`OnRep_CurrentExperience`）。

---

## 四、Experience 数据资产（ULyraExperienceDefinition）

```
B_ShooterGame_Elimination (ULyraExperienceDefinition)
  ├─ GameFeaturesToEnable: ["ShooterCore"]
  ├─ DefaultPawnData: DA_HeroPawnData
  ├─ Actions:
  │    ├─ GameFeatureAction_AddAbilities（对 ALyraPlayerState 授予基础能力集）
  │    └─ GameFeatureAction_AddWidget（添加血条、准星等）
  └─ ActionSets:
       ├─ LAS_ShooterGame_StandardHUD
       ├─ LAS_ShooterGame_SharedInput
       └─ LAS_ShooterGame_StandardComponents
```

**ULyraExperienceActionSet：** 可复用的 Action 组合，多个 Experience 可共享同一 ActionSet（如 SharedInput）。

---

## 五、GameFeatureAction 子类

位于 `Source/LyraGame/GameFeatures/`

| Action 类 | 功能 |
|---|---|
| `UGameFeatureAction_AddAbilities` | 向指定 Actor 类注入能力、属性集、能力集 |
| `UGameFeatureAction_AddWidget` | 向 UIExtension 插槽注入 Widget |
| `UGameFeatureAction_AddInputContextMapping` | 添加 Enhanced Input 上下文映射（IMC） |
| `UGameFeatureAction_AddInputBinding` | 添加输入绑定配置（ULyraInputConfig） |
| `UGameFeatureAction_AddGameplayCuePath` | 注册 GameplayCue 搜索目录 |
| `UGameFeatureAction_SplitscreenConfig` | 配置分屏参数 |

### GameFeatureAction_AddAbilities 详解

```yaml
ActorClass: ALyraPlayerState          # 目标 Actor 类
GrantedAbilities:
  - AbilityType: GA_Jump
    InputTag: InputTag.Jump
GrantedAttributes:
  - AttributeSetType: ULyraHealthSet
    InitializationData: DT_HealthInit  # 可选：DataTable 初始化属性值
GrantedAbilitySets:
  - DA_AbilitySet_ShooterHero          # 整包授予
```

**执行时机：**
1. `AddToWorld`：GameFeature 激活时，向 `UGameFrameworkComponentManager` 注册 Actor 扩展监听
2. Actor 生成触发 `ExtensionAdded` 或 `LyraAbilityReady` 事件
3. `AddActorAbilities`（**仅服务器执行**）：调用 `GiveAbility` / `GiveToAbilitySystem`

---

## 六、.uplugin 关键配置

```json
{
  "FriendlyName": "ShooterCore",
  "ExplicitlyLoaded": true,        // 必须由 Experience 显式激活，不自动加载
  "EnabledByDefault": false,
  "BuiltInInitialFeatureState": "Registered",  // 启动时注册但不激活
  "CanContainContent": true
}
```

| 字段 | 含义 |
|---|---|
| `ExplicitlyLoaded: true` | 插件不随引擎自动激活，需由 `LoadAndActivateGameFeaturePlugin` 显式加载 |
| `BuiltInInitialFeatureState: "Registered"` | 引擎启动时处于 Registered 状态（资产目录已扫描，但逻辑未执行） |
| `EnabledByDefault: false` | 默认未启用 |

---

## 七、如何创建新的游戏类型

1. **新建 GameFeature 插件**  
   在 `Plugins/GameFeatures/` 下新建 `.uplugin`，设置 `ExplicitlyLoaded=true`、`EnabledByDefault=false`

2. **创建 Experience 数据资产**  
   新建 `ULyraExperienceDefinition` 蓝图资产：
   - 填写 `GameFeaturesToEnable`（引用新插件名）
   - 配置 `DefaultPawnData`
   - 添加 `GameFeatureAction_AddAbilities` 等 Action

3. **配置地图**  
   在地图的 `ALyraWorldSettings` 中指定 `DefaultGameplayExperience`（指向新 Experience 资产）

4. **在插件 Content 中添加资产**  
   能力蓝图、UI、音效等全部放在插件 Content 目录内，保持解耦

5. **（可选）添加 C++ 扩展**  
   若需要自定义 AttributeSet、移动组件等，在插件内新建 Runtime 模块，依赖 `LyraGame`

---

## 八、TopDownArena：扩展示例

TopDownArena 展示了如何在 GameFeature 中扩展 GAS：

```
TopDownArena 插件
  └─ Source/TopDownArenaRuntime/
       ├─ TopDownArenaAttributeSet.h    ← 自定义属性集
       ├─ TopDownArenaMovementComponent.h ← 自定义移动
       └─ LyraCameraMode_TopDownArenaCamera.h ← 自定义相机模式
```

通过 `UGameFeatureAction_AddAbilities`：
- `GrantedAttributes` 中引用 `TopDownArenaAttributeSet`
- 属性集随 GameFeature 激活授予，随 GameFeature 卸载撤销

---

## 九、PIE 多世界支持

`ULyraExperienceManager`（EngineSubsystem）管理 PIE 下多个世界共享同一 GameFeature 插件的引用计数：

```
World A 激活 ShooterCore → count = 1
World B 激活 ShooterCore → count = 2
World A 结束 → count = 1（插件仍激活）
World B 结束 → count = 0 → 实际卸载插件
```

`GameFeatureActivatingContext` 的世界作用域确保每个 PIE 实例的 Action 数据独立存储（`TMap<FGameFeatureStateChangeContext, FPerContextData>`）。
