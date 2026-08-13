# Palworld GameFeature 验收矩阵

> **⚠️ 本变更已废弃（2026-08-12）**：见 proposal.md 顶部。Palworld 三插件已删除，本矩阵保留作为 M2「方案不可行」的执行记录；M1 基线修复已并入 ShooterGame，其验收在 `M1 基线修复` 行保留有效。

> 所属变更：`openspec/changes/add-palworld-gamefeature`，对应 tasks.md 1.3。
> 验收原则：**不以编译通过表述为 PIE / Cook / 联机验收通过**（`openspec/config.yaml` rules）。需要 Unreal Editor 的任务不得以编译通过替代验收。
> 状态图例：✅ 通过 · ❌ 失败 · ⬜ 未验证 · — 不适用 · ⏸ 暂缓
> 记录方式：每个里程碑结束时填写本矩阵；未运行项必须显式标注 ⬜，不得留空。

## 验证命令速查

| 维度 | 命令 / 方式 |
|---|---|
| C++ 编译 | `D:/UnrealEngine/UE_5.7/Engine/Build/BatchFiles/Build.bat LyraEditor Win64 Development D:/MatrixTA/LyraRPGGameplayAbility/LyraStarterGame.uproject -WaitMutex`（源码引擎替换为 `D:/UnrealEngine/UnrealEngine5`） |
| TS typecheck | 在项目根执行 `npm run typecheck`（Node 需 `export PATH="/c/nvm4w/nodejs:$PATH"`） |
| Automation | `D:/UnrealEngine/UE_5.7/Engine/Binaries/Win64/UnrealEditor-Cmd.exe D:/MatrixTA/LyraRPGGameplayAbility/LyraStarterGame.uproject -NullRHI -ExecCmds="Automation RunTests <Filter>;Quit" -unattended -nopause` |
| Editor 资产 | Unreal Editor 内操作：重定向、GameplayTag 检查、Reference Viewer、PIE |
| Cook/Stage | `D:/UnrealEngine/UE_5.7/Engine/Build/BatchFiles/RunUAT.bat BuildCookRun -project=D:/MatrixTA/LyraRPGGameplayAbility/LyraStarterGame.uproject -noP4 -platform=Win64 -clientconfig=Development -build -cook -stage -pak -skiparchive` |
| Standalone | 单客户端 PIE / Standalone Game 独立运行 |
| Dedicated Server | 无头服务器启动不阻塞 + 客户端 Join |
| 双客户端 | Dedicated Server + 2 客户端；或 Listen Server + 1 远端客户端（按任务要求） |

## 总矩阵

| 里程碑 | C++ 编译 | TS typecheck | Automation | Editor 资产 | Cook/Stage | Standalone | Dedicated Server | 双客户端 |
|---|---|---|---|---|---|---|---|---|
| M1 基线修复（2.1–2.7） | ✅ | — | ✅ | ⬜ | — | — | ⬜ | — |
| M2 三插件复制（3.1–3.7） | ✅ | — | — | ✅ | — | ⬜ | — | — |
| M3 GameFeature TS 构建（4.1–4.6） | ⬜ | ⬜ | ⬜ | ⬜ | — | — | — | — |
| M4 区域传送（5.1–5.7，重定向到 ShooterGame） | ✅ | ✅ | ✅ | ⬜ | — | ⬜ | ⬜ | ⬜ |
| M5 局内 Phase 与局时（6.1–6.12） | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| M6 装备/属性/伤害（7.1–7.12） | ⬜ | ⬜ | ⬜ | ⬜ | — | — | ⬜ | ⬜ |
| M7 PVP/死亡/复活（8.1–8.10） | ⬜ | ⬜ | ⬜ | ⬜ | — | ⬜ | ⬜ | ⬜ |
| M8 交互/拾取/UI（9.1–9.14） | ⬜ | ⬜ | ⬜ | ⬜ | — | ⬜ | ⬜ | ⬜ |
| M9 最终交付（10.1–10.9） | ⬜ | ⬜ | ⬜ | — | ⬜ | — | ⬜ | ⬜ |
| **原 Shooter 回归**（3.6 / 7.12 / 10.6） | ⬜ | — | — | ⬜ | — | ⬜ | — | ⬜ |

## 里程碑验收明细（与 tasks.md 对应）

### M1 基线修复

- Automation：`Automation RunTests LyraGame.Inventory`，断言「加入后可查询到实例」「StatTags 保持」。
- Dedicated Server：无调试器环境启动不阻塞（`WaitDebugger` 配置化默认关）。
- Editor 资产：`DefaultPuerts.ini` 解析成功，无缺失 tsconfig 路径告警。

### M2 三插件复制

- Editor 资产：插件可被识别（8 个 GameFeature 全部 Registered）；Tag 无重复定义/缺失；Duplicate PrimaryAssetID 已修复（13 个主数据资产重命名 + PalworldMaps/Explorer 取消 `Map` 类型注册 + 删除损坏的 `PalworldMaps_Label` + 移除 `GameFeatureAction_DataRegistry`）；资产重定向**部分完成**——主内容简单软引用已修复，「零跨插件引用」未达成：残留为 Palworld 关卡（L_Expanse/L_Convolution_Blockout/L_Expanse_Blockout）的 WorldPartition 指向 ShooterGame 地图的外部文件 + 主内容子对象/硬类/元数据引用，已按用户决策（2026-08-12，现阶段不剥离 Shooter 引用）推迟到后续阶段手动修复，详见 tasks.md 3.5 ⑥ / 3.8。
- Standalone：原 ShooterCore Elimination Experience 完成一局；Palworld 插件独立可启动。

### M3 GameFeature TS 构建（2026-08-12 重定向到 ShooterGame）

> 原面向 Palworld 三插件；废弃后改为「直接在 ShooterGame 上开发」，TS 生命周期基础设施与插件无关、保留，4.1/4.6 已按项目内通用 GameFeature TS 目录与 ShooterGame 入口重定向（不修改 `Config/DefaultPuerts.ini`）。

- C++ 编译：`Content/JavaScript/` 通过打包设置（`DirectoriesToAlwaysStageAsNonUFS`）作为 NonUFS 纳入，而非 Build.cs RuntimeDependencies。
- TS typecheck + contract tests：覆盖「重复激活」「重复停用」「VM 重启后重建一次」。
- Editor 资产：PIE 多实例下每个 GameInstance 独立启动一次脚本。

### M4 区域传送（2026-08-12 重定向到 ShooterGame）

> 原面向 PalworldCore/PalworldMaps；废弃后改为在 ShooterCoreRuntime + ShooterMaps + `TypeScript/GameFeatures/Shooter/` 上开发，类前缀 `Lyra*`，Automation 测试前缀 `ShooterCore.*`。

- Automation：`ShooterCore.Travel.Destination`（按 Tag 查找、未知 Tag 返回空、按队伍精确匹配、未配置队伍返回空）、`ShooterCore.Travel.Authority`（无控制器 InvalidTarget、非 Authority 拒绝、未知目标、无队伍、通用区域成功）、`ShooterCore.Zone.State`（初始为空、设置可读、Pawn 更换后区域标识保持、重复设置 no-op）——全部通过。
- Editor 资产：⬜ 未验证（需在编辑器布置传送点/交互点 + PIE 触发验证，对应 5.5 剩余 / 5.6）。
- 双客户端：⬜ 未验证（5.7，Dedicated Server + 2 客户端）。

### M5 局内 Phase 与局时

- Automation：时间戳复制；contract tests 覆盖正常流程、重复结束、客户端请求推进被拒。
- Cook/Stage：Phase 探针可加载（TS Blueprint 或 Blueprint 壳，记录最终路径）。
- 双客户端：阶段顺序与剩余局时一致；计时模式局时耗尽后两队各自回本队基地；晚加入恢复当前阶段与剩余局时。
- Standalone：自由模式不强制撤离、界面无倒计时。

### M6 装备/属性/伤害

- Automation：`PalworldCore.Equipment.Slots`、`PalworldCore.Equipment.Authority`（非 Authority 拒绝、槽位不匹配、已占用更替）、`PalworldCore.Damage.Execution`（攻击提升、防御提升、防御高于攻击取零）、「连续重建三次属性不累积」。
- 双客户端：装备后属性提升并复制、卸下后精确还原、多件装备互不干扰。
- 回归：ShooterCore Experience 中射击伤害与本变更前一致。

### M7 PVP/死亡/复活

- Automation：`PalworldCore.Death.Drop`（有物品掉落、空背包不生成、装备槽保留）、`PalworldCore.Spawn.TeamBase`（按队伍过滤、无队伍回退）。
- 双客户端：队友互射零伤害、敌队正常伤害、基地内可交战；A 击杀 B → 尸包可拾取 → B 在本队基地重生且装备仍在；两队复活隔离。

### M8 交互/拾取/UI

- 双客户端：同一物品同时拾取最多结算一次；机关效果复制到另一玩家，不可交互状态不执行能力。
- Standalone / PIE：F 触发交互、I 开关背包、提示出现与消失、开关幂等、局时展示（计时展示/自由不展示）。
- Listen Server + 1 远端：本地界面绑定 Owning Local Player，远端各自展示自身复制状态。

### M9 最终交付

- 全部静态验证 + Cook/Stage（Stage 目录含 PuerTS runtime、`Main` 脚本、Palworld GameFeature 脚本产物）+ 完整联机验收（Host/Join、Feature 激活、Warmup→MatchEnd、区域传送、分队伤害、装备属性、死亡掉落与按队伍复活、晚加入、Feature 停用清理）。
- 原 Shooter Elimination 与 ControlPoint 两个 Experience 各完成一局，伤害与出生点行为与本变更前一致。

## 填写纪律

1. 每个里程碑结束时回填本矩阵对应行；只更新本里程碑覆盖的维度，其余保持 ⬜。
2. 用 ✅ / ❌ 记录实际结果；失败项必须附原因与复测状态。
3. 收尾时（M9 10.7）逐格清点，未运行项不得省略。
