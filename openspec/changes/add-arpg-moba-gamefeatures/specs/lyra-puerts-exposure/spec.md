## Purpose

定义 Lyra 与 PuerTS 之间最小且安全的运行时契约，使 TypeScript 能观察 GameFeature 生命周期并执行服务器玩法编排，同时保留 Unreal 的权限、复制和对象生命周期约束。

## ADDED Requirements

### Requirement: GameFeature 生命周期可观察
系统 SHALL 按 GameInstance 和 World 上下文向 PuerTS 暴露 GameFeature 激活与停用状态，并允许脚本启动后重放当前已激活状态。

#### Scenario: 脚本晚于 GameFeature 启动
- **WHEN** PuerTS VM 在 GameFeature 已激活后完成初始化
- **THEN** 脚本查询到当前激活集合并且每个模块只执行一次激活逻辑

#### Scenario: PIE 多实例
- **WHEN** 编辑器启动服务器和多个 PIE 客户端
- **THEN** 每个 GameInstance 只接收属于自身 World 的生命周期状态，不共享脚本实例或 UObject 引用

### Requirement: 生命周期操作幂等
系统 SHALL 使重复激活、重复停用、Travel 和 VM 重启保持幂等，并 SHALL 为每次脚本注册提供对称释放路径。

#### Scenario: VM 热重启
- **WHEN** gameplay VM 在同一 GameInstance 中重启
- **THEN** 旧脚本监听器被释放，新 VM 从当前激活状态重建一次模块状态

#### Scenario: 重复停用
- **WHEN** 同一功能因 World 清理和功能停用收到多次清理请求
- **THEN** 清理操作安全完成且不访问已销毁 UObject

### Requirement: 服务器写入保护
所有改变 Phase、阵营、个人积分或队伍积分的暴露接口 MUST 在原生边界校验服务器 Authority、目标有效性和参数范围，并返回可诊断的结果。

#### Scenario: 客户端直接写阵营
- **WHEN** 非 Authority 的客户端脚本调用阵营写接口
- **THEN** 系统拒绝修改、返回非 Authority 结果并保持复制状态不变

#### Scenario: 服务器写入有效阵营
- **WHEN** Authority 为有效 PlayerState 分配已存在的队伍
- **THEN** 队伍状态更新并通过 Lyra 既有复制路径传播给客户端

### Requirement: 不提供通用 RPC 后门
系统 MUST NOT 暴露按字符串调用任意服务器函数或绕过 GAS/现有会话验证的通用 RPC；客户端战斗意图 SHALL 继续使用 GAS 输入、预测和服务器校验路径。

#### Scenario: 客户端请求玩法动作
- **WHEN** 客户端触发受预测支持的技能输入
- **THEN** 请求通过该技能既有的 GAS 网络策略处理，而不是通过 PuerTS 通用服务器调用

