## Purpose

定义从创建或加入 Lyra 会话，到服务器选择 Experience、切换地图、运行多轮 Phase 并结束比赛的完整联机生命周期及失败恢复行为。

## ADDED Requirements

### Requirement: 创建房间
系统 SHALL 使用所选 UserFacingExperience 构造 Hosting Request，并通过 CommonSession 流程创建离线、LAN 或配置的在线房间。

#### Scenario: 成功创建监听服务器房间
- **WHEN** 本地用户选择有效玩法并发起创建房间
- **THEN** 系统创建会话、携带地图和 Experience 参数执行服务器 Travel，并向 UI 报告可区分的进行中与成功状态

#### Scenario: 创建失败
- **WHEN** 会话创建或 Travel 准备失败
- **THEN** 系统解除忙碌状态、释放临时委托并向 UI 返回可重试错误，不残留半创建会话

### Requirement: 搜索和加入房间
系统 SHALL 支持搜索可加入会话、展示结果并通过 CommonSession Join 流程进入选定房间。

#### Scenario: 成功加入
- **WHEN** Owning Local Player 选择仍可加入的搜索结果
- **THEN** 系统解析连接地址、执行绝对 ClientTravel，并在目标服务器加载相同 Experience

#### Scenario: 过期结果
- **WHEN** 用户加入已关闭、已满或无法解析地址的会话
- **THEN** 系统保留前端可交互状态并给出可重新搜索的错误

### Requirement: 服务器权威回合状态机
比赛 SHALL 由服务器依次驱动 Warmup、Playing、RoundEnd 和 MatchEnd Phase；客户端 SHALL 通过复制和观察接口展示状态，不得自行推进权威 Phase。

#### Scenario: 正常完成一轮
- **WHEN** Warmup 条件满足并且 Playing 达到配置的时间、目标或比分结束条件
- **THEN** 服务器进入 RoundEnd、结算本轮，并根据比赛条件开始下一轮或进入 MatchEnd

#### Scenario: 客户端尝试推进 Phase
- **WHEN** 非 Authority 客户端请求直接启动下一 Phase
- **THEN** 请求被拒绝且服务器当前 Phase 不改变

### Requirement: Travel 与重连状态恢复
系统 SHALL 在 Travel、晚加入和支持的重连场景中从服务器复制状态恢复当前 Experience、Phase、阵营和积分展示。

#### Scenario: Playing 阶段晚加入
- **WHEN** 客户端在 Playing 阶段完成加入
- **THEN** 客户端恢复当前 Phase、剩余可展示时间、玩家阵营和比分，而不在本地重启 Warmup

