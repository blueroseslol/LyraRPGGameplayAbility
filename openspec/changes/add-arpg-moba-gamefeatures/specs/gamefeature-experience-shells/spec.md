## Purpose

定义 ARPG 与 Moba GameFeature 的可发现结构、Experience 装配方式和最小资产边界，使两种玩法能够独立启停、Cook 和验证，同时将可维护的玩法逻辑集中在 TypeScript。

## ADDED Requirements

### Requirement: 独立 GameFeature 边界
系统 SHALL 提供名称分别为 ARPG 和 Moba 的两个显式加载 GameFeature；任一功能停用时不得遗留其输入、UI、计时器或玩法监听器，也不得要求新增第三个共享插件。

#### Scenario: 独立启用 ARPG
- **WHEN** Experience 只请求启用 ARPG
- **THEN** 系统加载 ARPG 的第三人称配置和脚本，而不激活 Moba 的 TopDown 配置或脚本

#### Scenario: 停用功能
- **WHEN** 已激活的 GameFeature 被停用或对应 World 销毁
- **THEN** 系统释放该 GameFeature 在该 GameInstance 中注册的全部运行时资源

### Requirement: Experience 配置实例
系统 SHALL 为每种玩法保留可被 Asset Manager 扫描的 GameFeatureData、ExperienceDefinition、UserFacingExperience 和 PawnData 资产实例；这些实例 SHALL 只保存配置、标签和软引用，不包含玩法事件图逻辑。

#### Scenario: 通过会话选择玩法
- **WHEN** 房主选择 ARPG 或 Moba 的 UserFacingExperience
- **THEN** Hosting Request 包含对应地图、Experience 和人数配置，并能在服务器 Travel 后解析到同一玩法

#### Scenario: 缺少必需资产
- **WHEN** Experience 引用缺失的 PawnData、地图或 GameFeature
- **THEN** 加载流程明确失败并输出可定位的资产标识，而不是回退到另一种玩法

### Requirement: PuerTS 生成类验收
系统 SHALL 只把已保存、可重新加载且通过 Cook 验证的 TypeScript Blueprint 类用于持久类引用；运行时临时生成类不得作为 Experience、PawnData、Phase 或 UI 的持久软引用目标。

#### Scenario: 编辑器重启后恢复引用
- **WHEN** Phase GA 或 Widget 使用 TypeScript Blueprint 类并重新启动编辑器
- **THEN** 引用仍能解析到相同类且其父类、默认属性和 TypeScript 实现保持有效

#### Scenario: TypeScript Blueprint 验证失败
- **WHEN** 生成类无法通过 Cook、Standalone 或 Dedicated Server 加载
- **THEN** 系统使用无事件图的 Blueprint 配置壳作为回退，玩法逻辑仍由 TypeScript 提供

