## Purpose

定义 ALS-Community 与 GASPALS 接入 ARPG 前的隔离评估流程，使第三方移动和动画系统只有在满足 UE 5.7、Lyra Pawn、Cook 与多人复制要求后才会进入正式依赖。

## ADDED Requirements

### Requirement: 第三方模板不属于基线依赖
ARPG 基线 SHALL 能在未导入 ALS-Community 或 GASPALS 的情况下编译、Cook 和运行；本变更 SHALL 只记录适配点和验证计划。

#### Scenario: 完成 ARPG 基线
- **WHEN** 第三方 locomotion 尚未选择或验证
- **THEN** ARPG 仍使用可替换的 Pawn/动画接口完成会话、Phase、阵营和 GAS 基础流程

### Requirement: 隔离兼容性评估
每个候选模板 SHALL 在独立试验范围验证引擎版本、许可证、模块依赖、输入、Pawn/CharacterMovement、动画层、GAS、Cook 和多人复制，不得直接覆盖 ARPG 基线资产。

#### Scenario: 候选编译但网络失败
- **WHEN** 候选模板通过 UE 5.7 编译但双客户端移动、转向或蒙太奇不同步
- **THEN** 候选不得进入正式 ARPG 依赖，并记录失败点和可回退接口

### Requirement: 显式采用决策
只有在候选通过规定验证且用户确认后，方案 SHALL 创建单独的接入变更；不得同时把两个候选设为 ARPG 必需依赖。

#### Scenario: 选择一个候选
- **WHEN** 某候选通过验证且用户批准采用
- **THEN** 后续变更只接入该候选，并保留返回 ARPG 基础 Pawn 的回退路径

