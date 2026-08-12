# Palworld GameFeature 实施边界矩阵

> 所属变更：`openspec/changes/add-palworld-gamefeature`，对应 tasks.md 1.4。
> 依据：design.md 决策 8（C++ 与 TypeScript 的职责切分依据）。
> 原则：切分依据是**技术必要性**，不是偏好。以下每个单元格都回答「某层必须做什么」与「某层禁止做什么」。

## 职责矩阵

| 层 | 归属位置 | 职责（必须做） | 不越界规则（禁止） |
|---|---|---|---|
| **C++ 玩法** | `PalworldCoreRuntime`（新增 Palworld 玩法 C++ 全部落于此，不落 `LyraGame`） | ① `FFastArraySerializer` 复制结构与 `UPROPERTY` 反射（装备槽、背包）；② `UAttributeSet` 与 `UGameplayEffectExecutionCalculation`（攻防与伤害）；③ 可复制子对象的注册（物品实例，Outer 为 Actor）；④ Authority 安全边界的函数体校验（传送、装备写入）；⑤ 引擎虚函数覆写（出生点选择、交互接口）。PuerTS 无法提供以上能力，故为**必须**。 | 不承载 Phase 编排、撤离分流、计分、UI 业务规则（这些是 TS 职责）。不以"方便起见"把可写进 TS 的玩法逻辑下沉到 C++。 |
| **TypeScript** | GameFeature 脚本模块（按 GameFeature 组织，每模块持有可集中释放的作用域） | ① Phase 流程编排与局时计时器管理；② 撤离时玩家遍历与分流决策；③ 传送入口的业务判定；④ 装备/卸下意图提交与前置校验；⑤ UI Presenter 与不可变 ViewState 生成。 | 不直接改写复制状态；不做乐观更新（提交后等复制回传）。`GetLocalRole() != ROLE_Authority` 的提前返回只是**快速失败**，不是安全边界——最终写入必须过 C++ Authority 校验。不经通用 RPC 按字符串调用任意服务器函数。 |
| **LyraGame** | `Source/LyraGame/` | 仅四项缺陷修复：`AddEntry(ItemInstance*)`（Inventory/LyraInventoryManagerComponent.cpp:110）、`WaitDebugger()` 配置化（System/LyraGameInstance.cpp:93）、`DefaultPuerts.ini` tsconfig 注册、`Main.ts` 与产物同步。 | 不接受任何 Palworld 玩法规则。行为缺陷可以修，功能扩展不允许。 |
| **Primary Data Asset** | Palworld 插件 `Content/` | `GameFeatureData`、`ExperienceDefinition`、`UserFacingExperience`、`PawnData` 等作为配置实例与软引用存在，可被 Asset Manager 扫描。 | 不承载蓝图事件图逻辑；不作为持久软引用目标以外的用途。 |
| **视觉资产** | Palworld 插件 `Content/` | UMG 布局、模型、材质、贴图、动画蓝图、地图等由用户创建/提供，实现本变更定义的视图契约。 | 替换视觉资产不得要求改动会话、阶段、队伍、背包或装备服务；界面不得直接持有这些服务的权威写入路径。 |
| **第三方模板** | 无 | 本变更不引入第三方 locomotion / AI / 背包插件。 | 不导入 ALS-Community / GASPALS（仅 ARPG 后续隔离兼容性试验中评估，不在本变更）。 |

## 网络职责（来源：proposal Impact）

- **服务器**持有 Phase、队伍、计分与 Travel 决策。
- **Owning Client** 只提交既有会话/GAS 输入意图（交互、装备、拾取）。
- 所有 C++ 写接口必须二次校验 Authority，不增加任意函数名式通用 RPC。
- `PlayerState` 复制玩家区域与装备槽状态；`GameState`/队伍子系统复制全局 Phase 与局时结束时间戳。
- World Partition 以每个客户端为独立 streaming source，天然承载"玩家分散在不同区域"；服务器端流送配置需允许按各客户端位置流送。

## 判定口诀（提交代码前自查）

1. 需要 `FFastArraySerializer` / `UPROPERTY` 反射 / AttributeSet / Execution / 可复制子对象 / 引擎虚函数 → **C++**。
2. 其余玩法编排、UI、意图提交 → **TypeScript**。
3. 改 `LyraGame` 前先对照「四项缺陷修复」清单，不在清单内 → 驳回。
4. 在 TS 里做 Authority 判断后仍必须走 C++ 校验接口 → 双保险，不是二选一。
