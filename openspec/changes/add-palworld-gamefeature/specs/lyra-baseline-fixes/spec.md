## Purpose

修复 Lyra 基线与 PuerTS 接入中阻塞 Palworld 玩法实施的四处缺陷，使物品实例可加入背包、Dedicated Server 可无人值守启动、TypeScript 变更可被正确编译并进入运行时。

## ADDED Requirements

### Requirement: 物品实例可加入背包

背包 SHALL 支持将一个已存在的物品实例加入背包并正确复制其 StatTags；该路径 MUST NOT 保持未实现状态。

#### Scenario: 拾取携带实例的容器

- **WHEN** 玩家拾取一个内含物品实例（而非仅物品定义模板）的可拾取容器
- **THEN** 这些实例进入玩家背包，其 StatTags 数值保持拾取前的状态，并复制到该玩家客户端

#### Scenario: 实例加入后的复制注册

- **WHEN** 服务器将物品实例加入背包
- **THEN** 该实例作为可复制子对象注册，客户端可解析到同一实例并读取其定义与 StatTags

### Requirement: 无人值守启动

脚本运行时 MUST NOT 在 GameInstance 初始化阶段无条件阻塞等待外部调试器。是否等待调试器 SHALL 由配置控制，且默认关闭。

#### Scenario: Dedicated Server 启动

- **WHEN** 在未附加任何调试器的环境中启动 Dedicated Server
- **THEN** 服务器完成初始化并进入可接受连接状态，不停留在等待调试器的阻塞点

#### Scenario: 开发者显式开启调试等待

- **WHEN** 开发者在配置中开启调试等待并启动客户端
- **THEN** 运行时等待调试器附加后继续初始化

### Requirement: TypeScript 构建配置一致

脚本构建配置 MUST NOT 引用不存在的配置文件路径。承载玩法脚本入口的 TypeScript 配置 SHALL 被注册进编辑器 watch 列表，使源码变更能产出对应的运行时脚本。

#### Scenario: 编辑器内修改脚本

- **WHEN** 开发者在编辑器运行期间修改玩法 TypeScript 源码并保存
- **THEN** 对应的运行时脚本产物被重新生成，无需手工执行外部构建命令

#### Scenario: 配置解析

- **WHEN** 引擎加载 PuerTS 配置
- **THEN** 所有注册的 TypeScript 配置路径均可解析到实际存在的文件，不产生缺失路径告警

### Requirement: 脚本源码与产物一致

脚本入口的源码与其运行时产物 SHALL 保持一致；运行时 MUST NOT 执行源码中已被移除或禁用的逻辑。

#### Scenario: 启动脚本入口

- **WHEN** 游戏启动并执行脚本入口
- **THEN** 实际执行的行为与当前源码一致，不执行源码中已注释或删除的初始化流程
