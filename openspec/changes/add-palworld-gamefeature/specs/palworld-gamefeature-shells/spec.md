## Purpose

定义 Palworld 玩法所需的三个 GameFeature 插件的可发现结构、Tag 命名空间隔离和 Experience 装配契约，使 Palworld 与原 Shooter 玩法能够互不干扰地共存、独立启停并各自通过 Cook 验证。

## ADDED Requirements

### Requirement: 三插件独立边界

系统 SHALL 提供名称分别为 PalworldCore、PalworldExplorer 和 PalworldMaps 的三个显式加载 GameFeature。PalworldExplorer 与 PalworldMaps SHALL 声明对 PalworldCore 的依赖；任一 GameFeature 停用时 SHALL 释放其在该 GameInstance 中注册的全部输入映射、UI 挂载、组件、计时器和玩法监听器。

#### Scenario: 仅启用 Palworld 玩法

- **WHEN** Experience 只请求启用 PalworldCore、PalworldExplorer 与 PalworldMaps
- **THEN** 系统加载 Palworld 的配置与脚本，而不激活 ShooterCore、ShooterExplorer 或 ShooterMaps 的任何输入、组件或 UI

#### Scenario: 停用 GameFeature

- **WHEN** 已激活的 Palworld GameFeature 被停用或其所属 World 被销毁
- **THEN** 系统释放该功能注册的运行时资源，且不访问已销毁的 UObject

### Requirement: 原 Shooter 玩法不回归

复制行为 MUST NOT 修改 ShooterCore、ShooterExplorer 或 ShooterMaps 的任何资产、源码或配置。原 Shooter Experience SHALL 在 Palworld 插件存在的前提下保持可独立启动和游玩。

#### Scenario: 原 Shooter Experience 仍可运行

- **WHEN** 用户在三个 Palworld 插件已安装的项目中启动原 ShooterCore 的 Elimination Experience
- **THEN** 该 Experience 正常加载并可完成一局对战，行为与复制前一致

#### Scenario: Tag 命名空间不冲突

- **WHEN** 编辑器启动并同时加载 Shooter 与 Palworld 两套插件的 Tag 配置
- **THEN** 不产生重复定义或缺失 GameplayTag 的日志，Palworld 玩法专属 Tag 使用 `Palworld.` 前缀，跨玩法通用 Tag 不被重复注册

### Requirement: Experience 配置实例

系统 SHALL 为 Palworld 玩法保留可被 Asset Manager 扫描的 GameFeatureData、ExperienceDefinition、UserFacingExperience 和 PawnData 资产实例。这些实例 SHALL 只保存配置、标签和软引用，不包含玩法事件图逻辑。

#### Scenario: 通过会话选择玩法

- **WHEN** 房主选择 Palworld 的 UserFacingExperience 并创建房间
- **THEN** Hosting Request 携带对应地图、Experience 和人数配置，并在服务器 Travel 后解析到同一玩法

#### Scenario: 缺少必需资产

- **WHEN** Experience 引用缺失的 PawnData、地图或 GameFeature
- **THEN** 加载流程明确失败并输出可定位的资产标识，而不是静默回退到另一种玩法

### Requirement: 地图承载方式

Palworld SHALL 使用单一 World Partition 持久地图承载主基地与全部可探索区域，并 SHALL 依赖引擎的距离流送使不同玩家可同时处于不同区域。系统 MUST NOT 依赖传统 Streaming Sublevel 的全局加载状态来隔离玩家所在区域。

#### Scenario: 玩家分散在不同区域

- **WHEN** 一名玩家位于副本区域而另一名玩家位于其队伍基地
- **THEN** 两名玩家各自加载所在区域的内容，且任一方的区域加载状态不强制另一方加载相同内容
