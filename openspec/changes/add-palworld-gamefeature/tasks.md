## 0. 约定

- 引擎路径：项目 `EngineAssociation` 为 `5.7`，下文命令使用 `D:/UnrealEngine/UE_5.7`；若在源码引擎下工作，替换为 `D:/UnrealEngine/UnrealEngine5`。
- Node 未加入当前 shell PATH，执行 npm 命令前需 `export PATH="/c/nvm4w/nodejs:$PATH"`（Bash）或使用完整路径 `C:/nvm4w/nodejs/npm`。
- 每个里程碑结束前，把该里程碑的静态验证（编译、typecheck）与运行时验收（Editor、Cook、PIE、联机）分别记入 1.3 的验收矩阵；未运行项必须显式标注为未验证。
- 「需要 Unreal Editor」的任务不得以编译通过替代验收。

## 1. 里程碑 M0：基线与实施护栏

- [ ] 1.1 在 `D:/MatrixTA/LyraRPGGameplayAbility` 记录主仓库及嵌套插件仓库（`Plugins/Puerts`、`Plugins/EasyEditorPlugin` 为符号链接，需单独确认）的 `git status --short`，建立 `TypeScript/Main.ts`、`openspec/config.yaml`、`Docs/` 等用户既有修改的不可覆盖清单；验证：再次运行 `git status --short` 比对，无需 Unreal Editor。
- [ ] 1.2 将 `openspec/changes/add-arpg-moba-gamefeatures` 标记为被本变更取代（在其 `proposal.md` 顶部加入取代说明并注明本变更名），不执行 archive（其 delta 规格从未实施，归档会污染主规格）；验证：文件内容评审，无需 Unreal Editor。
- [ ] 1.3 在 `Docs/04_Lyra/` 建立本变更的验收矩阵，列出 C++ 编译、TypeScript typecheck、Automation、Editor 资产、Cook/Stage、Standalone、Dedicated Server、双客户端八列，并为 Palworld 与原 Shooter 回归各留一行；验证：矩阵结构评审。
- [ ] 1.4 在 `Docs/04_Lyra/` 记录实施边界矩阵：C++（必须）、TypeScript（编排与 UI）、Primary Data Asset、视觉资产、第三方模板各自的职责与不越界规则，依据 design.md 决策 8；验证：文档评审。

## 2. 里程碑 M1：Lyra 基线缺陷修复（阻塞后续全部里程碑）

- [ ] 2.1 在 `Source/LyraGame/Inventory/LyraInventoryManagerComponent.cpp` 实现 `FLyraInventoryList::AddEntry(ULyraInventoryItemInstance*)`，与既有 `AddEntry(ItemDef, StackCount)` 保持一致的子对象注册、`MarkItemDirty` 与消息广播语义；验证：编译通过 + 新增 `LyraGame.Inventory.AddItemInstance` Automation 测试覆盖「加入后可查询到实例」「StatTags 保持」两个断言。
- [ ] 2.2 在 `Source/LyraGame/Inventory/LyraInventoryManagerComponent.cpp` 补齐 `AddItemInstance` 的公开入口，使 `UPickupableStatics::AddPickupToInventory` 的 `Instances` 分支不再走到未实现路径；验证：扩展同组 Automation 测试。
- [ ] 2.3 在 `Source/LyraGame/System/LyraGameInstance.cpp:93` 将 `GameScript->WaitDebugger()` 改为由配置控制且默认关闭（新增配置项或复用 `Config/DefaultPuerts.ini` 的 `DebugEnable` 语义）；验证：编译通过，并在无调试器环境下启动 Dedicated Server 观察不阻塞（联机验收，记入矩阵）。
- [ ] 2.4 修正 `Config/DefaultPuerts.ini`：移除或修正指向不存在的 `Developer/TypeScript/tsconfig.json` 的注册项，并把项目根 `tsconfig.json`（实际编译 `TypeScript/Main.ts` 者）加入 `TypeScriptConfigPaths`；验证：INI 解析成功，编辑器启动无缺失路径告警，需要 Unreal Editor。
- [ ] 2.5 同步 `TypeScript/Main.ts` 与 `Content/JavaScript/Main.js`：确认源码为期望状态后重新构建，使产物不再执行源码中已注释的 `GameplayRuntime` 实例化；验证：在 `Developer/TypeScript` 执行 `npm run typecheck` 与 `npm run build`，比对产物内容。
- [ ] 2.6 编译 LyraGame 完整变更；验证：`D:/UnrealEngine/UE_5.7/Engine/Build/BatchFiles/Build.bat LyraEditor Win64 Development D:/MatrixTA/LyraRPGGameplayAbility/LyraStarterGame.uproject -WaitMutex`，不以 Live Coding 结果替代完整编译。
- [ ] 2.7 运行 M1 的 Automation 测试；验证：`D:/UnrealEngine/UE_5.7/Engine/Binaries/Win64/UnrealEditor-Cmd.exe D:/MatrixTA/LyraRPGGameplayAbility/LyraStarterGame.uproject -NullRHI -ExecCmds="Automation RunTests LyraGame.Inventory;Quit" -unattended -nopause`。

## 3. 里程碑 M2：三插件复制与命名空间迁移

- [ ] 3.1 复制 `Plugins/GameFeatures/ShooterCore/` 为 `Plugins/GameFeatures/PalworldCore/`，重命名 `.uplugin`、`Source/ShooterCoreRuntime/` 为 `Source/PalworldCoreRuntime/`，同步修改 `Build.cs` 模块名、`IMPLEMENT_MODULE` 与所有 `SHOOTERCORERUNTIME_API` 宏；验证：`Build.bat LyraEditor Win64 Development ... -WaitMutex` 编译通过。
- [ ] 3.2 复制 `Plugins/GameFeatures/ShooterExplorer/` 为 `Plugins/GameFeatures/PalworldExplorer/`（纯内容插件，无 Source），`.uplugin` 依赖改为 `PalworldCore`；验证：JSON 解析成功，Plugin Browser 可识别，需要 Unreal Editor。
- [ ] 3.3 复制 `Plugins/GameFeatures/ShooterMaps/` 为 `Plugins/GameFeatures/PalworldMaps/`（纯内容插件），`.uplugin` 依赖改为 `PalworldCore`；验证：同 3.2。
- [ ] 3.4 在三个插件的 `Config/Tags/*.ini` 中把玩法专属 Tag 由 `ShooterGame.*` 迁移为 `Palworld.*`；`InputTag.*`、`HUD.Slot.*` 等跨玩法通用 Tag 沿用 ShooterCore 既有定义，不重复注册；验证：启动 Editor 检查无重复定义/缺失 GameplayTag 日志，需要 Unreal Editor。
- [ ] 3.5 在 Unreal Editor 中对三个 Palworld 插件的 Content 执行资产重定向与 Fix Up Redirectors，确保 Palworld 资产不再引用 ShooterCore/ShooterExplorer/ShooterMaps；验证：引用审计（Reference Viewer 或 `-run=ResavePackages` 报告）显示零跨插件引用，需要 Unreal Editor。
- [ ] 3.6 回归验证原 Shooter 三件套未被破坏：启动原 ShooterCore Elimination Experience 完成一局；验证：单客户端 PIE + Standalone，记入验收矩阵的「原 Shooter 回归」行，需要 Unreal Editor。
- [ ] 3.7 验证 Palworld 插件可独立运行：停用 Shooter 三插件后启动 Palworld Experience；验证：需要 Unreal Editor，对应 `palworld-gamefeature-shells` 的「仅启用 Palworld 玩法」场景。

## 4. 里程碑 M3：GameFeature TypeScript 构建与生命周期

- [ ] 4.1 在 `Developer/TypeScript/` 新增 GameFeature TypeScript 配置，以 Palworld 插件的 TypeScript 目录为输入、`Content/JavaScript/GameFeatures` 为输出，并在 `Config/DefaultPuerts.ini` 注册；验证：JSON/INI 解析成功。
- [ ] 4.2 更新 `Developer/TypeScript/package.json` 的 `build` 与 `typecheck` 脚本纳入新配置，且不改变根 `tsconfig.json` 的既有产出；验证：在 `Developer/TypeScript` 执行 `npm run typecheck` 与 `npm run build`。
- [ ] 4.3 在 `Source/LyraGame/LyraGame.Build.cs` 将 `Content/JavaScript/GameFeatures/**/*.js|json` 作为 NonUFS RuntimeDependencies 递归 staging；验证：编译通过，并在 M9 的 Stage 目录检查中确认产物存在。
- [ ] 4.4 实现 GameFeature 脚本模块的注册、激活状态重放、幂等激活与对称释放（含 DisposableScope 释放委托、Timer 与弱 World 引用）；验证：`npm run typecheck` + TypeScript contract tests 覆盖「重复激活」「重复停用」「VM 重启后重建一次」。
- [ ] 4.5 以最小方式接入 `TypeScript/Main.ts`（保留用户既有代码，只增加一次 bootstrap 调用）；验证：`npm run typecheck`，并在 PIE 多实例下确认每个 GameInstance 独立启动一次，需要 Unreal Editor。
- [ ] 4.6 在两个 Palworld 内容插件的 TypeScript 目录建立只含 activate/deactivate 的入口与服务组装根；验证：`npm run typecheck`，停用后作用域内无残留注册。

## 5. 里程碑 M4：区域传送与玩家区域状态

- [ ] 5.1 在 `Plugins/GameFeatures/PalworldCore/Source/PalworldCoreRuntime/` 实现传送目标点 Actor，携带区域 Tag，基地点另带队伍标识；验证：编译通过 + 新增 `PalworldCore.Travel.Destination` Automation 测试覆盖「按 Tag 查找」「按队伍查找」。
- [ ] 5.2 在同模块实现 Authority 安全的传送接口，函数体内校验 World、目标 Actor、Authority、目标点存在性与队伍归属，返回可诊断枚举（Success/NotAuthority/InvalidTarget/UnknownDestination/NoTeam）；验证：新增 `PalworldCore.Travel.Authority` Automation 测试覆盖非 Authority 拒绝、未知目标、无队伍三条失败路径。
- [ ] 5.3 在 PlayerState 侧扩展玩家当前区域 Tag 的复制状态（挂载于 Palworld 的 PlayerState 组件，不修改 `ALyraPlayerState`）；验证：编译通过 + Automation 测试覆盖「Pawn 更换后区域标识保持」。
- [ ] 5.4 在 TypeScript 实现传送编排服务：判定谁能传、传到哪，并调用 5.2 的 C++ 接口；验证：`npm run typecheck` + contract tests 覆盖非 Authority 快速失败与 C++ 返回码分支。
- [ ] 5.5 实现交互式传送入口（继承 PalworldCore 的可交互基类），使用与拾取相同的交互输入；验证：需要 Unreal Editor，PIE 单客户端确认按 F 触发传送。
- [ ] 5.6 在 `PalworldMaps` 的 World Partition 地图中布置两队基地与至少两个可探索区域的传送点，并确认服务器端流送配置允许按各客户端位置流送；验证：需要 Unreal Editor。
- [ ] 5.7 双客户端验收区域隔离与位置复制：A 传送进副本区域、B 留在其队伍基地；验证：Dedicated Server + 2 客户端，确认双方位置正确复制、无 CharacterMovement 回弹、任一方的区域加载不强制另一方加载，对应 `world-zone-travel` 与 `palworld-gamefeature-shells` 的分散区域场景。

## 6. 里程碑 M5：局内 Phase 与全局局时

- [ ] 6.1 在 Palworld 插件 `Config/Tags/` 定义 Phase Tag 层级：`Palworld.GamePhase.Warmup`、`.Playing`、`.Playing.Free`、`.Extract`、`.MatchEnd`（Extract 为 Playing 的兄弟）；验证：Editor 启动无 Tag 冲突，需要 Unreal Editor。
- [ ] 6.2 创建继承 `ULyraGamePhaseAbility` 的 Phase 类探针（优先保存型 TypeScript Blueprint），验证父类、`GamePhaseTag` CDO 默认值、类软引用与编辑器重启后引用有效；验证：保存后关闭并重启 Unreal Editor，需要 Unreal Editor。
- [ ] 6.3 对 6.2 探针执行 Development Cook/Stage 并在 Standalone 与 Dedicated Server 加载；验证：`D:/UnrealEngine/UE_5.7/Engine/Build/BatchFiles/RunUAT.bat BuildCookRun -project=D:/MatrixTA/LyraRPGGameplayAbility/LyraStarterGame.uproject -noP4 -platform=Win64 -clientconfig=Development -build -cook -stage -pak -skiparchive`。
- [ ] 6.4 若 6.3 失败，改用无 Event Graph 的 Phase GA Blueprint 配置壳（只填 `GamePhaseTag`），规则保留在 TypeScript Coordinator；验证：重复 6.2-6.3 并在验收矩阵记录最终采用路径。
- [ ] 6.5 在 TypeScript 实现回合协调器，仅 Authority 驱动 Warmup→Playing→Extract→MatchEnd，并按模式配置决定是否注册局时计时器；验证：`npm run typecheck` + contract tests 覆盖正常流程、重复结束、客户端请求推进被拒三条路径。
- [ ] 6.6 在 GameState 侧复制「局时结束的服务器时间戳」，客户端按该时间戳本地插值显示剩余时间；验证：编译通过 + Automation 测试覆盖时间戳复制。
- [ ] 6.7 实现 Extract 阶段的按队伍分流撤离：遍历所有 PlayerState，各自传送回本队基地；验证：`npm run typecheck` + contract tests。
- [ ] 6.8 创建自由模式与计时模式两套 ExperienceDefinition 与 UserFacingExperience 配置实例；验证：Asset Manager 可解析 Primary Asset ID 且无缺失引用，需要 Unreal Editor。
- [ ] 6.9 双客户端验收阶段顺序与局时一致性：两名玩家分处不同区域时观察到一致的阶段顺序与剩余局时；验证：Dedicated Server + 2 客户端，对应 `match-phase-lifecycle` 的全局局时复制场景。
- [ ] 6.10 双客户端验收撤离分流：计时模式局时耗尽后两队玩家各自被传回本队基地；验证：Dedicated Server + 2 客户端（两队各一名）。
- [ ] 6.11 验收自由模式不触发强制撤离，且界面不展示局时倒计时；验证：Standalone + PIE。
- [ ] 6.12 验收晚加入恢复：客户端在 Playing 阶段加入后展示当前阶段与剩余局时，不在本地重启 Warmup；验证：Dedicated Server + 至少 2 客户端。

## 7. 里程碑 M6：装备槽、属性与伤害

- [ ] 7.1 在 `PalworldCoreRuntime` 实现装备槽组件（挂载于 PlayerState），槽位以 GameplayTag 寻址，状态使用 `FFastArraySerializer` 复制，物品实例作为子对象注册；验证：编译通过 + 新增 `PalworldCore.Equipment.Slots` Automation 测试。
- [ ] 7.2 在 Palworld 插件 `Config/Tags/` 定义槽位 Tag：`Palworld.Equip.Slot.Head`、`.Body`、`.Legs`、`.Accessory1`、`.Accessory2`；验证：Editor 启动无 Tag 冲突，需要 Unreal Editor。
- [ ] 7.3 在 `PalworldCoreRuntime` 实现装备槽 Inventory Fragment，声明物品可进入的槽位 Tag 与其属性效果类；验证：编译通过 + Automation 测试覆盖「装备到不匹配槽位被拒绝」。
- [ ] 7.4 在 `PalworldCoreRuntime` 实现 `UPalAttributeSet`，仅含攻击与防御两项属性（生命值继续用 `ULyraHealthSet`，不重复定义）；验证：编译通过 + Automation 测试覆盖属性复制。
- [ ] 7.5 实现 Authority 安全的装备/卸下写入：装备时施加属性效果并记录句柄，卸下时按句柄精确移除；写入前二次校验 Authority 与槽位合法性并返回可诊断枚举；验证：新增 `PalworldCore.Equipment.Authority` Automation 测试覆盖非 Authority 拒绝、槽位不匹配、已占用槽位更替三条路径。
- [ ] 7.6 实现 Pawn 重生后按当前槽位内容重新施加属性效果，且施加前先移除已记录旧句柄以保证幂等；验证：Automation 测试覆盖「连续重建三次后属性数值不累积」。
- [ ] 7.7 在 `PalworldCoreRuntime` 实现 `UPalDamageExecution`，捕获攻击（Source）与防御（Target）属性，沿用队伍许可乘数与距离/材质衰减，最终值取 `Max(..., 0)`；验证：编译通过 + 新增 `PalworldCore.Damage.Execution` Automation 测试覆盖攻击提升、防御提升、防御高于攻击取零三个场景。
- [ ] 7.8 将 PalworldCore 复制来的 `GE_Damage_*` 资产改指向 `UPalDamageExecution`；ShooterCore 的资产保持指向 `ULyraDamageExecution`；验证：需要 Unreal Editor。
- [ ] 7.9 新增装备槽变更的 GameplayMessage Tag 与消息结构，供 UI 订阅；验证：编译通过。
- [ ] 7.10 在 TypeScript 实现装备操作意图提交与前置校验，写入经 7.5 的 C++ 边界；验证：`npm run typecheck` + contract tests。
- [ ] 7.11 双客户端验收装备属性：装备后属性提升并复制、卸下后精确还原、多件装备互不干扰；验证：Dedicated Server + 2 客户端，对应 `equipment-slots-and-attributes` 全部场景。
- [ ] 7.12 回归验收原 Shooter 伤害不变：在 ShooterCore Experience 中射击命中，伤害结算与本变更前一致；验证：需要 Unreal Editor，记入验收矩阵的「原 Shooter 回归」行。

## 8. 里程碑 M7：PVP、死亡掉落与按队伍复活

- [ ] 8.1 在 Palworld Experience 中挂载队伍创建组件（复用 `B_TeamSetup_TwoTeams` 的人数平衡策略）与队伍显示资产；验证：需要 Unreal Editor，2-4 名玩家场景中队伍人数差不超过 1。
- [ ] 8.2 在 `PalworldCoreRuntime` 实现死亡掉落：监听死亡开始，读取背包全部物品实例，生成可拾取容器并清空背包，装备槽不变；背包为空时不生成容器；验证：编译通过 + 新增 `PalworldCore.Death.Drop` Automation 测试覆盖「有物品掉落」「空背包不生成」「装备槽保留」。
- [ ] 8.3 配置尸包容器资产（继承 PalworldCore 的可拾取基类），使其可被其他玩家拾取；验证：需要 Unreal Editor。
- [ ] 8.4 在 `PalworldCoreRuntime` 实现按队伍基地过滤的出生点选择组件，覆写 `OnChoosePlayerStart`：按 `ALyraPlayerStart::StartPointTags` 的队伍标记过滤本队基地点位，再选未占用者；玩家无队伍时返回 nullptr 交由上游回退；验证：编译通过 + 新增 `PalworldCore.Spawn.TeamBase` Automation 测试覆盖「按队伍过滤」「无队伍回退」。
- [ ] 8.5 在 Palworld Experience 中挂载 8.4 的出生点组件（替代复制来的 TDM「离敌人最远」组件，两者并存不互相修改）；验证：需要 Unreal Editor。
- [ ] 8.6 为两队基地布置带队伍标记的 PlayerStart；验证：需要 Unreal Editor。
- [ ] 8.7 配置重生流程（复用 `GA_AutoRespawn` 与重生倒计时 UI）指向队伍基地；验证：需要 Unreal Editor，PIE 单客户端确认死亡后在本队基地重生。
- [ ] 8.8 双客户端验收 PVP 分队语义：队友互射零伤害、敌队正常伤害、基地内可交战（无免伤保护区）；验证：Dedicated Server + 2 客户端（两队各一名），对应 `combat-teams-and-death` 分队伤害语义全部场景。
- [ ] 8.9 双客户端验收风险回报闭环：A 击杀 B → B 尸包出现且 A 可拾取（物品 StatTags 保持）→ B 在本队基地重生且装备仍在；验证：Dedicated Server + 2 客户端。
- [ ] 8.10 双客户端验收两队复活隔离：分属两队的玩家先后死亡，各自在本队基地复活，不出现在对方基地；验证：Dedicated Server + 2 客户端。

## 9. 里程碑 M8：交互、拾取与 UI

- [ ] 9.1 将交互输入键位改为 F（修改 Palworld 的输入映射资产，Tag 沿用 `InputTag.Ability.Interact`）；验证：需要 Unreal Editor，PIE 确认按 F 触发交互。
- [ ] 9.2 配置可拾取物品资产（继承 PalworldCore 的可拾取基类，使用能力授予交互者模式）；验证：需要 Unreal Editor，PIE 确认拾取进背包。
- [ ] 9.3 实现带 GAS 的机关 Actor，使用目标侧执行模式（`TargetAbilitySystem` + `TargetInteractionAbilityHandle`），响应能力在机关自身 ASC 上由服务器执行；验证：编译通过（若需新 C++ 基类）+ 需要 Unreal Editor，PIE 确认触发。
- [ ] 9.4 配置交互提示 UI（复用 `W_InteractionPrompt`），确认进入/离开范围时提示正确出现与消失；验证：需要 Unreal Editor，PIE 覆盖 `interaction-and-pickup` 的提示展示场景。
- [ ] 9.5 双客户端验收拾取竞争：两名玩家几乎同时拾取同一物品，该物品最多结算一次；验证：Dedicated Server + 2 客户端。
- [ ] 9.6 双客户端验收机关：一名玩家触发机关，效果复制到另一名玩家；同时验证机关不可交互状态下不执行响应能力；验证：Dedicated Server + 2 客户端。
- [ ] 9.7 配置按 I 开关背包与装备栏的输入与能力（复用 `GA_ToggleInventory` 与 `InputTag.Ability.ToggleInventory`）；验证：需要 Unreal Editor。
- [ ] 9.8 配置背包界面（复用 `W_InventoryScreen`/`W_InventoryGrid`/`W_InventoryTile`），订阅背包变更消息；验证：需要 Unreal Editor。
- [ ] 9.9 创建装备栏界面与其逻辑基类（`W_QuickBar` 是纯蓝图无 C++ 基类，需新建而非继承），订阅 7.9 的装备槽变更消息；验证：需要 Unreal Editor。
- [ ] 9.10 在 TypeScript 实现背包/装备栏/局时的 Presenter，输出不可变 ViewState 并接收用户意图；界面不做乐观更新，提交后等待复制回传再刷新；验证：`npm run typecheck` + Presenter contract tests 覆盖「操作被拒绝后回到权威状态」。
- [ ] 9.11 通过 `HUD.Slot.*` 插槽与 Add Widgets Action 挂载背包、装备栏与局时元素，不修改 `ALyraHUD`；验证：需要 Unreal Editor。
- [ ] 9.12 验收界面开关幂等：连续两次开关背包不产生重复界面实例或重复订阅；验证：PIE，对应 `inventory-equipment-ui` 的开关场景。
- [ ] 9.13 验收 Listen Server 本地界面绑定 Owning Local Player，远端客户端各自展示自身复制状态；验证：Listen Server + 1 远端客户端。
- [ ] 9.14 验收局时展示：计时模式展示与服务器一致的剩余局时，自由模式不展示倒计时元素；验证：两种 Experience 各启动一次，需要 Unreal Editor。

## 10. 里程碑 M9：最终验证与交付

- [ ] 10.1 执行完整 TypeScript 验证；验证：在 `Developer/TypeScript` 执行 `npm run typecheck`、`npm run build` 与全部 contract tests，并确认 `Content/JavaScript/GameFeatures` 下 Palworld 脚本产物存在。
- [ ] 10.2 执行完整 C++ 编译；验证：`D:/UnrealEngine/UE_5.7/Engine/Build/BatchFiles/Build.bat LyraEditor Win64 Development D:/MatrixTA/LyraRPGGameplayAbility/LyraStarterGame.uproject -WaitMutex`。
- [ ] 10.3 执行全部 Automation 测试；验证：`D:/UnrealEngine/UE_5.7/Engine/Binaries/Win64/UnrealEditor-Cmd.exe D:/MatrixTA/LyraRPGGameplayAbility/LyraStarterGame.uproject -NullRHI -ExecCmds="Automation RunTests LyraGame.Inventory+PalworldCore;Quit" -unattended -nopause`。
- [ ] 10.4 执行 Development Cook/Stage，确认 Stage 目录同时包含 PuerTS runtime 包、`Main` 脚本与 Palworld GameFeature 脚本产物；验证：`RunUAT.bat BuildCookRun -project=D:/MatrixTA/LyraRPGGameplayAbility/LyraStarterGame.uproject -noP4 -platform=Win64 -clientconfig=Development -build -cook -stage -pak -skiparchive`，无缺失 Primary Asset 或 GameplayTag 日志。
- [ ] 10.5 完成 Palworld 完整联机验收：Host/Join、Feature 激活、Warmup 至 MatchEnd、区域传送、分队伤害、装备属性、死亡掉落与按队伍复活、晚加入、Feature 停用清理全部通过；验证：Dedicated Server + 2 客户端。
- [ ] 10.6 完成原 Shooter 三件套最终回归：Elimination 与 ControlPoint 两个 Experience 各完成一局，伤害与出生点行为与本变更前一致；验证：Dedicated Server + 2 客户端，记入验收矩阵。
- [ ] 10.7 完成验收矩阵填写，未运行项显式标注为未验证；验证：矩阵评审。
- [ ] 10.8 编写资产交接文档，逐项标记必须创建、可替换、已验证或已回退的资产，并附 Phase、PawnData、装备栏、传送点的引用位置；验证：用户无需阅读 C++ 即可完成视觉资产替换。
- [ ] 10.9 在文档中记录本变更沿用的已知限制：交互能力缓存只增不减（`UAbilityTask_GrantNearbyInteraction`）、背包无格子/重量/堆叠上限；验证：文档评审。
