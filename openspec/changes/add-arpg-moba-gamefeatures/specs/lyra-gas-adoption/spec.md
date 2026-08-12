## Purpose

建立 Lyra GAS 能力的分类、选择门和接入验收模板，使后续技能开发可以按玩法价值分批实施，而不会把未选择的系统提前耦合进 ARPG 或 Moba 基线。

## ADDED Requirements

### Requirement: GAS 功能目录
方案 SHALL 把可选 GAS 能力至少分类为技能授予与输入、属性与 GameplayEffect、Tag/消耗/冷却、GameplayCue、装备与物品、交互、死亡复活、全局 Phase，以及网络预测与服务器校验。

#### Scenario: 用户评估功能
- **WHEN** 用户准备选择下一批 GAS 功能
- **THEN** 文档为每类功能列出 Lyra 复用点、所需代码、所需资产、网络语义和验证方式

### Requirement: 选择后实施
除本变更必需的 Phase 和积分 Tag Stack 外，系统 MUST NOT 在用户选择前接入可选 GAS 功能；每个被选功能 SHALL 形成独立任务范围和验收场景。

#### Scenario: 尚未选择装备系统
- **WHEN** ARPG/Moba 基线实现期间用户尚未确认装备接入
- **THEN** 基线不新增装备数据、授予流程或 UI 依赖

#### Scenario: 选择预测技能
- **WHEN** 用户选择需要客户端预测的主动技能
- **THEN** 后续规格明确预测策略、服务器校验、失败回滚、AbilitySet/InputTag 和用户资产步骤

### Requirement: 人工资产步骤
每个被选择的 GAS 功能 SHALL 提供用户可执行的 Unreal Editor 步骤，并区分代码可自动完成的部分与需要视觉或数据调试的资产部分。

#### Scenario: 需要 GameplayCue 视觉资产
- **WHEN** 技能需要粒子、声音或摄像机反馈
- **THEN** 方案提供 Tag、类和引用位置，用户只需创建并验证对应视觉资产

