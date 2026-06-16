# UE GameFeature 插件系统

> 引擎版本：UE 5.x  
> 相关模块：`GameFeatures`、`ModularGameplay`

## 一、概述

GameFeature 插件系统允许将游戏功能（玩法逻辑、UI、资产）封装为独立的插件，在运行时**按需动态加载和激活**，无需修改核心游戏代码。适用于：
- 多游戏模式（DLC、限时活动、不同玩法）
- 模块化内容（可选功能、平台差异）
- 编辑器/PIE 下的快速迭代

---

## 二、插件状态机

一个 GameFeature 插件在运行时经历以下状态：

```
Uninitialized
    ↓ 引擎发现插件
Registered          ← BuiltInInitialFeatureState 通常设为此状态
    ↓ 请求加载
Loaded              ← 资产可用，但 Action 未执行
    ↓ 请求激活
Active              ← GameFeatureAction 完整执行
    ↓ 请求停用
（回到 Loaded 或 Registered）
```

| 状态 | 含义 |
|---|---|
| `Registered` | 插件已被引擎发现，Content 目录已扫描，资产路径可寻址，但代码/逻辑未初始化 |
| `Loaded` | 插件代码模块已加载，资产已异步加载，但 `OnGameFeatureActivating` 未调用 |
| `Active` | 所有 `GameFeatureAction` 已执行，功能完全可用 |

---

## 三、.uplugin 关键配置

```json
{
  "ExplicitlyLoaded": true,
  "EnabledByDefault": false,
  "BuiltInInitialFeatureState": "Registered",
  "CanContainContent": true,
  "Modules": [
    {
      "Name": "MyFeatureRuntime",
      "Type": "Runtime",
      "LoadingPhase": "Default"
    }
  ]
}
```

| 字段 | 说明 |
|---|---|
| `ExplicitlyLoaded` | `true`：不随引擎自动激活，必须通过代码/子系统显式加载 |
| `EnabledByDefault` | `false`：默认关闭，通过 `.ini` 或代码开启 |
| `BuiltInInitialFeatureState` | 引擎启动后的初始状态，通常 `"Registered"` |
| `CanContainContent` | `true`：插件包含 `.uasset` 资产 |

---

## 四、UGameFeaturesSubsystem

核心管理类，全局单例，通过 `UGameFeaturesSubsystem::Get()` 访问。

### 常用 API

```cpp
// 通过插件名获取 URL
FString PluginURL;
UGameFeaturesSubsystem::Get().GetPluginURLByName(TEXT("ShooterCore"), PluginURL);

// 加载并激活
UGameFeaturesSubsystem::Get().LoadAndActivateGameFeaturePlugin(
    PluginURL,
    FGameFeaturePluginLoadComplete::CreateLambda([](const UE::GameFeatures::FResult& Result) {
        // 激活完成回调
    })
);

// 停用
UGameFeaturesSubsystem::Get().DeactivateGameFeaturePlugin(PluginURL, Callback);

// 卸载
UGameFeaturesSubsystem::Get().UnloadGameFeaturePlugin(PluginURL, Callback);
```

### 插件 URL 格式

```
/Game/Plugins/GameFeatures/ShooterCore/ShooterCore.uplugin
```

或通过 `GetPluginURLByName` 从友好名称解析。

---

## 五、GameFeatureAction 生命周期

所有 `UGameFeatureAction` 子类按以下顺序被调用：

| 方法 | 调用时机 | 用途 |
|---|---|---|
| `OnGameFeatureRegistering()` | 插件进入 Registered 状态 | 注册类型、标签等轻量初始化 |
| `OnGameFeatureUnregistering()` | 离开 Registered 状态 | 清理注册 |
| `OnGameFeatureLoading()` | 插件进入 Loaded 状态 | 异步资产预加载 |
| `OnGameFeatureActivating(Context)` | 插件进入 Active 状态 | **核心逻辑**：注入组件、绑定委托、添加 Widget |
| `OnGameFeatureDeactivating(Context)` | 插件离开 Active 状态 | 撤销所有 `Activating` 中的操作 |

### 实现自定义 Action

```cpp
UCLASS()
class UMyGameFeatureAction : public UGameFeatureAction_WorldActionBase
{
    GENERATED_BODY()
protected:
    virtual void AddToWorld(const FWorldContext& WorldContext,
                            const FGameFeatureStateChangeContext& ChangeContext) override;
};

void UMyGameFeatureAction::AddToWorld(const FWorldContext& WorldContext,
                                      const FGameFeatureStateChangeContext& ChangeContext)
{
    UWorld* World = WorldContext.World();
    // 向 World 中注入逻辑
    // 使用 ChangeContext 隔离 PIE 多世界数据
}
```

---

## 六、世界上下文（FGameFeatureStateChangeContext）

`FGameFeatureStateChangeContext` 限定 Action 的生效范围：

```cpp
// 检查是否应用于某个 World
Context.ShouldApplyToWorldContext(WorldContext)
```

在 PIE 多世界场景下，同一 GameFeature 的 Action 数据通过 `TMap<FGameFeatureStateChangeContext, FPerData>` 分别存储，确保不同 PIE 实例互不影响。

---

## 七、UGameFeatureAction_WorldActionBase

大多数 Lyra Action 继承此抽象基类：

```
UGameFeatureAction
  └─ UGameFeatureAction_WorldActionBase （abstract）
       ├─ UGameFeatureAction_AddAbilities
       ├─ UGameFeatureAction_AddWidget
       ├─ UGameFeatureAction_AddInputContextMapping
       └─ ...
```

**核心机制：**  
`OnGameFeatureActivating` 注册 `FWorldDelegates::OnStartGameInstance`，使 Action 能感知新的 World 上线。对已存在的 World，立即调用 `AddToWorld()`。

---

## 八、与 ModularGameplay 的协作

`ModularGameplay` 插件提供 `UGameFrameworkComponentManager`，GameFeature Action 通过它向 Actor 注入扩展：

```cpp
// 注册：当 TargetActor 类的实例出现时，触发回调
UGameFrameworkComponentManager::AddReceiver(TargetActor, ...);

// 动态添加组件到 Actor
UGameFrameworkComponentManager::AddComponentRequest(Actor, ComponentClass);

// 发送扩展事件
UGameFrameworkComponentManager::SendExtensionEvent(Actor, EventName);
```

| 事件名 | 含义 |
|---|---|
| `NAME_ExtensionAdded` | Actor 注册为接收者 |
| `NAME_ExtensionRemoved` | Actor 注销 |
| `NAME_ReceiverRemoved` | 同上（移除） |
| `NAME_GameActorReady` | Actor 准备好接受扩展 |
| `LyraAbilityReady`（自定义） | PlayerState ASC 就绪，可授予能力 |
| `BindInputsNow`（自定义） | HeroComponent 输入绑定完成 |

---

## 九、资产 Bundle 与内容加载

GameFeature 内容通过 **Primary Asset Bundle** 管理加载：

- `Equipped` Bundle：当前装备/激活状态下需要的资产
- `Server` Bundle：仅服务器需要的资产
- `Client` Bundle：仅客户端需要的资产

在 `DefaultGame.ini` 中配置 `PrimaryAssetTypesToScan`，将 GameFeature 内容目录纳入资产管理器扫描范围。

---

## 十、常见问题

| 问题 | 原因与解决 |
|---|---|
| GameFeature 激活后 Action 未生效 | 检查 Actor 是否实现了正确的 Receiver 注册；确认 `HasAuthority()` 检查 |
| PIE 下多个世界 Action 互相干扰 | 使用 `FGameFeatureStateChangeContext` 作为 Map Key 隔离数据 |
| 插件卸载后资产仍被引用 | `OnGameFeatureDeactivating` 中确保撤销所有硬引用 |
| 客户端未触发 Action | 检查 `UGameFeatureAction_WorldActionBase::ShouldApplyToWorldContext` 的 NetMode 判断 |
| 插件 URL 解析失败 | 插件需先处于 Registered 状态才能通过 `GetPluginURLByName` 获取 URL |
