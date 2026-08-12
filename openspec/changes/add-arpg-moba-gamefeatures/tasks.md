## 1. 里程碑 M0：基线与实施护栏

- [ ] 1.1 在 `D:/MatrixTA/LyraRPGGameplayAbility` 记录主仓库及嵌套插件仓库的 `git status --short`，确认 `TypeScript/Main.ts`、`openspec/config.yaml` 等用户现有修改并建立不可覆盖清单；验证：再次运行 `git status --short`，无需 Unreal Editor。
- [ ] 1.2 在 `Docs/04_Lyra/` 新增实施边界说明，列出 C++、PuerTS、Primary Data Asset、视觉资产和第三方模板的职责矩阵；验证：文档评审，无需 Unreal Editor。
- [ ] 1.3 为本变更建立验收矩阵，分别记录 C++ 编译、TypeScript typecheck、Automation、Editor 资产、Cook、Standalone、Dedicated Server 和双客户端结果；验证：矩阵包含 ARPG/Moba 两行和独立验收列。

## 2. 里程碑 M1：LyraGame 最小 PuerTS 暴露层

- [ ] 2.1 在 `Source/LyraGame/GameFeatures/` 实现 `ULyraGameFeatureScriptSubsystem`，提供激活集合查询、引用计数、激活/停用动态委托及 GameInstance 隔离；验证：新增 `LyraGame.GameFeatureScriptSubsystem` Automation 测试，使用 `UnrealEditor-Cmd.exe ... -ExecCmds="Automation RunTests LyraGame.GameFeatureScriptSubsystem;Quit"`，无需视觉 Editor。
- [ ] 2.2 在 `Source/LyraGame/GameFeatures/` 实现 `UGameFeatureAction_RegisterPuerTSModule`，按 World/ChangeContext 对称登记和撤销脚本模块，并验证空模块名和重复生命周期；验证：扩展同组 Automation 测试。
- [ ] 2.3 在 `Source/LyraGame/Teams/LyraTeamStatics.*` 增加 Authority 安全的队伍变更函数和可诊断结果枚举，内部校验 World、目标、队伍存在性和服务器权限；验证：新增 `LyraGame.Teams.PuerTSExposure` Automation 测试。
- [ ] 2.4 重新生成/刷新 PuerTS 声明并确认新 Subsystem、Action、委托、枚举和队伍函数出现在 `Typing/ue/ue.d.ts`；验证：`rg -n "LyraGameFeatureScriptSubsystem|RegisterPuerTSModule|TeamChangeResult" Typing/ue/ue.d.ts`。
- [ ] 2.5 编译 C++ 暴露层；验证：`D:/UnrealEngine/UnrealEngine5/Engine/Build/BatchFiles/Build.bat LyraEditor Win64 Development D:/MatrixTA/LyraRPGGameplayAbility/LyraStarterGame.uproject -WaitMutex`，不以 Live Coding 结果替代完整编译。

## 3. 里程碑 M2：GameFeature TypeScript 构建与生命周期

- [ ] 3.1 在 `Developer/TypeScript/tsconfig.gamefeatures.json` 配置 ARPG/Moba 插件 TypeScript 输入和 `Content/JavaScript/GameFeatures` 输出，并在 `Config/DefaultPuerts.ini` 注册该配置；验证：配置 JSON/INI 解析成功，无需 Editor。
- [ ] 3.2 更新 `Developer/TypeScript/package.json` 的 build/typecheck，使其包含 gamefeatures 配置且不改变根 `tsconfig.json` 的 PuerTS 生成流程；验证：在 `Developer/TypeScript` 执行 `npm run typecheck` 和 `npm run build`。
- [ ] 3.3 在 `Source/LyraGame/LyraGame.Build.cs` staging `Content/JavaScript/GameFeatures/**/*.js|json`，并在构建前对缺失 JS 给出明确诊断；验证：C++ 编译成功，并在后续 Stage 目录检查 ARPG/Moba JS。
- [ ] 3.4 在 `TypeScript/GameFeatures/` 实现 `GameFeatureScriptRegistry`、`GameFeatureContext` 和 `DisposableScope`，支持状态重放、幂等激活、异常隔离和对称清理；验证：在 `Developer/TypeScript` 执行 `npm run typecheck`，并运行 TypeScript contract tests。
- [ ] 3.5 以最小方式接入 `TypeScript/Main.ts`，保留用户现有代码，只启动一次 registry；验证：`npm run typecheck`，PIE 多实例日志显示每个 GameInstance 独立启动一次。

## 4. 里程碑 M3：ARPG/Moba GameFeature 骨架

- [ ] 4.1 创建 `Plugins/GameFeatures/ARPG/ARPG.uplugin` 与目录骨架，设置 ExplicitlyLoaded、Registered、内容及依赖，不创建 ARPGRuntime 模块；验证：JSON 解析和 Unreal Editor Plugin Browser 可识别，需要 Unreal Editor。
- [ ] 4.2 创建 `Plugins/GameFeatures/Moba/Moba.uplugin` 与目录骨架，设置 ExplicitlyLoaded、Registered、内容及依赖，不创建 MobaRuntime 模块；验证：JSON 解析和 Unreal Editor Plugin Browser 可识别，需要 Unreal Editor。
- [ ] 4.3 在两个插件的 `TypeScript/index.ts` 实现只含 activate/deactivate 的入口和 feature-specific service composition root；验证：`npm run typecheck`，停用后 DisposableScope 为空。
- [ ] 4.4 在各插件 `Config/Tags/` 定义 Feature、Phase、Score 和 UI 所需 Gameplay Tags，避免跨插件重复定义；验证：启动 Editor 无 GameplayTag 冲突/缺失日志，需要 Unreal Editor。

## 5. 里程碑 M4：Experience 与必需资产装配

- [ ] 5.1 编写 `Docs/04_Lyra/ARPG-Moba-Asset-Setup.md`，为 ARPG/Moba 分别列出 GameFeatureData、ExperienceDefinition、UserFacingExperience、PawnData、地图、InputConfig、CameraMode、HUD 和 ActionSet 的建议路径与字段；验证：路径清单覆盖两个 Feature，代码侧不生成 `.uasset`。
- [ ] 5.2 用户在 Unreal Editor 创建 ARPG/Moba GameFeatureData，并各自添加 `RegisterPuerTSModule` Action 与模块名；验证：激活 Feature 时对应 TS activate 恰好一次、停用时 deactivate 恰好一次，需要 Unreal Editor/PIE。
- [ ] 5.3 用户在 Unreal Editor 创建并连接两套 ExperienceDefinition、UserFacingExperience 和 PawnData 配置实例；验证：Asset Manager 审计能找到 Primary Asset ID，且缺失引用检查为零，需要 Unreal Editor。
- [ ] 5.4 分别启动 ARPG/Moba 地图，验证 Map -> Experience -> GameFeature -> PawnData -> Input/Camera/HUD 加载顺序；验证：单客户端 PIE 和 Standalone，不在此步骤验证联机。

## 6. 里程碑 M5：TypeScript Blueprint 探针与资产回退

- [ ] 6.1 创建一个继承 `ULyraGamePhaseAbility` 的保存型 TypeScript Blueprint 探针，验证父类、GamePhaseTag CDO 默认值、类软引用和重启恢复；验证：保存、关闭并重启 Unreal Editor 后引用仍有效，需要 Unreal Editor。
- [ ] 6.2 创建一个 TypeScript Widget 逻辑父类和用户视觉 Widget 子类探针，验证 Blueprint 子类能够调用 TS Presenter/事件实现；验证：PIE 打开/关闭页面两次且无重复委托，需要 Unreal Editor。
- [ ] 6.3 对两个探针执行 Development Cook/Stage 并在 Standalone 与 Dedicated Server 加载；验证：`RunUAT.bat BuildCookRun -project=.../LyraStarterGame.uproject -noP4 -platform=Win64 -clientconfig=Development -build -cook -stage -pak -skiparchive`。
- [ ] 6.4 若任一探针失败，用户创建无 Event Graph 的 Phase GA/Widget Blueprint 配置壳，TypeScript 改用 mixin 或外部 Coordinator；验证：重复 6.1-6.3 并在验收矩阵记录采用路径。

## 7. 里程碑 M6：CommonSession 与可替换主菜单

- [ ] 7.1 在共享 GameFeature TypeScript 层实现 `SessionService`，封装 UserFacingExperience HostingRequest、Host、Search、Join、Cleanup 和操作 token；验证：TypeScript contract tests 覆盖成功、失败、迟到回调和重复点击。
- [ ] 7.2 实现 `MainMenuPresenter` 与 `SessionBrowserPresenter`，输出 Idle/Hosting/Searching/Joining/Traveling/Failed ViewState，不直接依赖具体 UMG 类；验证：`npm run typecheck` 和 Presenter contract tests。
- [ ] 7.3 用户创建/替换主菜单和房间列表 UMG 视觉子类，并按照文档绑定 Host、Refresh、Join、Cancel 意图；验证：单机离线与 LAN 两种 UI 流程，需要 Unreal Editor。
- [ ] 7.4 以两个进程验证创建和加入房间：Host 经 ServerTravel 进入选择的 Experience，Client 经 Join/ClientTravel 进入同一地图；验证：Development Standalone 或打包客户端，记录双方日志。
- [ ] 7.5 验证会话失败恢复：加入过期/已满会话、Host 失败和取消搜索后 UI 可再次操作，且委托没有重复触发；验证：两客户端联机验收。

## 8. 里程碑 M7：GamePhase 回合状态机

- [ ] 8.1 在 ARPG/Moba TypeScript 中实现可配置 `RoundCoordinator` 和 Warmup/Playing/RoundEnd/MatchEnd 状态转换，仅 Authority 可启动 Phase；验证：contract tests 覆盖正常轮次、重复结束和客户端拒绝路径。
- [ ] 8.2 用户为四种 Phase 配置经 M5 验证的 TypeScript Blueprint 类或无逻辑 Blueprint 壳，并填写 GamePhaseTag；验证：Editor 重启后类和 Tag 有效，需要 Unreal Editor。
- [ ] 8.3 在服务器启动一轮并由时间/测试目标推进至 RoundEnd，再根据配置进入下一轮或 MatchEnd；验证：双客户端 PIE/Standalone，两个客户端观察到一致 Phase 顺序。
- [ ] 8.4 验证 Playing 阶段晚加入/支持的重连恢复当前 Phase，而不在客户端本地重启 Warmup；验证：Dedicated Server + 至少两个客户端。

## 9. 里程碑 M8：阵营、计分与 HUD

- [ ] 9.1 在 TypeScript 实现 `TeamService`，等待 TeamCreation 完成后按默认人数平衡策略分队，并通过 Authority 安全接口写入 PlayerState；验证：2-4 玩家 Automation/联机场景中队伍差不超过 1。
- [ ] 9.2 实现 `ScoreService`，使用服务器确认事件唯一键去重，并通过 PlayerState/TeamSubsystem GameplayTagStack 写入 `Score.Round.*` 与 `Score.Match.*`；验证：contract tests 覆盖重复事件、Round reset 和 Match freeze。
- [ ] 9.3 实现 `MatchPresenter`/`ScoreboardPresenter`，从复制状态生成 Phase、队伍、个人分和队伍分 ViewState；验证：`npm run typecheck` 和只读客户端 Presenter tests。
- [ ] 9.4 用户创建 HUD、回合提示和计分板 UMG 视觉子类并绑定 Presenter；验证：Listen Server 的本地 UI 绑定 Owning Local Player，远端 UI 显示各自复制状态，需要 Unreal Editor。
- [ ] 9.5 验证死亡/得分/换轮和 Pawn 重生后阵营仍由 PlayerState 保持，双方比分一致；验证：Dedicated Server + 两客户端联机。

## 10. 里程碑 M9：GAS 选择目录与用户操作手册

- [ ] 10.1 在 `Docs/04_Lyra/GAS/` 编写分类目录，覆盖 AbilitySet/InputTag、Attribute/Effect、TagRelationship、Cost/Cooldown、GameplayCue、Equipment/Inventory、Interaction、Death/Respawn、Phase 和 Prediction；验证：每类包含 Lyra 复用点、代码位置、网络语义、所需资产和验收方式。
- [ ] 10.2 生成 GAS 选择表，标记 ARPG/Moba 适用性、依赖、开发量和需要用户操作的 Editor 步骤；验证：本变更只把 Phase/Score 标记为已纳入，其余保持未选择。
- [ ] 10.3 与用户确认首批 GAS 功能后，为选择项创建独立 OpenSpec 变更或明确追加规格；验证：未确认前不创建装备、交互、技能视觉等实现文件。

## 11. 里程碑 M10：Locomotion 后续评估准备

- [ ] 11.1 在 `Docs/04_Lyra/ARPG/Locomotion-Evaluation.md` 建立 ALS-Community 与 GASPALS 对比矩阵，覆盖 UE 5.7、许可、模块、Enhanced Input、Pawn Extension、GAS montage、网络移动、ragdoll、Cook 和回退；验证：不下载或导入第三方代码。
- [ ] 11.2 固化 ARPG PawnData 的可替换 PawnClass/CameraMode/Anim Layer 接口，确保基础 Pawn 不依赖任一候选；验证：ARPG 在无第三方插件时完成编译、Cook 和两客户端移动。
- [ ] 11.3 用户批准候选后另建 locomotion 接入 OpenSpec；验证：本变更中 ARPG/Moba `.uplugin` 不声明 ALS-Community/GASPALS 必需依赖。

## 12. 里程碑 M11：最终验证与交付

- [ ] 12.1 执行完整 TypeScript 验证：在 `Developer/TypeScript` 运行 `npm run typecheck`、`npm run build` 和 contract tests，并确认 `Content/JavaScript/GameFeatures/ARPG`、`Moba` 产物存在。
- [ ] 12.2 执行完整 C++/Automation 验证：编译 `LyraEditor Win64 Development`，并通过 `UnrealEditor-Cmd.exe ... -NullRHI -ExecCmds="Automation RunTests LyraGame.GameFeatureScript;Automation RunTests LyraGame.Teams.PuerTSExposure;Quit"`。
- [ ] 12.3 执行 Development Cook/Stage，确认 Stage 中包含 Main、现有 PuerTS runtime 包和 ARPG/Moba GameFeature JS；验证：RunUAT BuildCookRun 成功且无缺失 Primary Asset/GameplayTag 日志。
- [ ] 12.4 完成 ARPG 与 Moba 各自的 Dedicated Server + 两客户端验收：Host/Join、Travel、Feature 激活、Warmup 到 MatchEnd、分队、计分、晚加入、Feature 清理全部通过。
- [ ] 12.5 完成用户资产交接文档，逐项标记必须创建、可替换、TypeScript Blueprint 已验证或已回退的资产，并附 UMG/Phase/PawnData 引用位置；验证：用户无需阅读 C++ 即可完成视觉资产替换。
