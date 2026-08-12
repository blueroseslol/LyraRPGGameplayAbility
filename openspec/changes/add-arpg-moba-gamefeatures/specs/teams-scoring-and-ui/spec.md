## Purpose

定义服务器权威的阵营与积分模型，以及主菜单、房间列表、HUD 和计分板使用可替换视觉资产时必须保持的 TypeScript 展示契约。

## ADDED Requirements

### Requirement: 服务器分配阵营
系统 SHALL 由服务器为有效 PlayerState 分配阵营；默认策略 SHALL 在现有队伍之间进行人数平衡，并允许具体玩法选择服务器侧策略。

#### Scenario: 玩家首次进入比赛
- **WHEN** 未分队玩家完成服务器 PlayerState 初始化且队伍已创建
- **THEN** 服务器将其分配到有效队伍并向所有相关客户端复制结果

#### Scenario: 玩家 Pawn 重生
- **WHEN** 已分队玩家更换或重生 Pawn
- **THEN** 阵营身份继续来自 PlayerState，不因 Pawn 实例变化而丢失

### Requirement: 个人和队伍积分
系统 SHALL 通过可配置 Gameplay Tag Stack 分别维护个人积分与队伍积分，并 SHALL 由服务器决定增加、扣减和结算。

#### Scenario: 服务器记录得分事件
- **WHEN** 权威玩法规则确认一次有效得分
- **THEN** 对应玩家和队伍的配置积分 Tag 更新并复制到观察客户端

#### Scenario: 无效重复得分
- **WHEN** 同一带唯一标识的得分事件被重复处理
- **THEN** 系统最多结算一次并记录重复事件诊断

### Requirement: 回合与比赛重置策略
系统 SHALL 区分回合计数和整场累计计数，并依据玩法配置在 RoundEnd 或 MatchEnd 执行明确的重置策略。

#### Scenario: 开始下一轮
- **WHEN** RoundEnd 决定继续比赛
- **THEN** 回合临时状态按配置清零，整场累计比分保持不变

#### Scenario: 比赛结束
- **WHEN** 服务器进入 MatchEnd
- **THEN** 最终比分被冻结用于结算展示，直到退出比赛或开始新的 Match

### Requirement: 可替换 UI 契约
主菜单、房间列表、HUD 和计分板 SHALL 通过 TypeScript Presenter 接收不可变视图状态和提交用户意图；替换 UMG 视觉资产不得改变会话、Phase、队伍或计分服务。

#### Scenario: 替换主菜单布局
- **WHEN** 用户提供实现同一视图接口的新 UMG 视觉子类
- **THEN** 创建、搜索和加入房间功能继续工作而无需复制玩法服务逻辑

#### Scenario: Listen Server 本地 UI
- **WHEN** Listen Server 同时拥有 Authority 和本地玩家
- **THEN** UI 以 Owning Local Player 绑定输入和页面，不把 Authority 或 Local Player Index 当作网络玩家身份

