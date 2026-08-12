# Palworld M0 基线记录

> 所属变更：`openspec/changes/add-palworld-gamefeature`
> 记录时间：2026-08-12
> 用途：实施护栏——本记录是后续各里程碑「不改动用户文件」的对照基线，对应 tasks.md 1.1。
> 验证方式：里程碑开始时重新运行 `git status --short` 与下文比对；新增改动项需先确认为有意改动，再纳入清单。

## 主仓库

- 分支：`master`
- 基线提交：`62f2364` docs(openspec): 添加 Palworld GameFeature 开发计划变更（本变更的 OpenSpec 已入库）
- `git status --short`（基线）：

```
 M "Docs/05_GameJam/逻辑构思以及开发任务.md"
```

> 注：`openspec/changes/`、`openspec/config.yaml`、`TypeScript/Main.ts` 的既有改动已于 `f72e4f7`、`62f2364` 提交入库，基线起不再视为未提交改动。

## 嵌套插件仓库（符号链接，独立 git 仓库）

| 插件 | 链接目标 | 分支 | 基线状态 |
|---|---|---|---|
| `Plugins/Puerts` | `/c/Users/loujiajie/.config/superpowers/worktrees/puerts/ue57-tobjectptr/unreal/Puerts` | `codex/ue57-tobjectptr` | 干净（未跟踪产物为 `Binaries/`、`Intermediate/`、`node_modules/`、`obj/` 等构建输出，不纳入） |
| `Plugins/EasyEditorPlugin` | `/d/MatrixTA/EasyEditorPlugin/.worktrees/puerts-runtime-plugin` | `codex/puerts-runtime-plugin` | 未提交修改：`TypeScript/index.ts`、`TypeScript/runtime.ts` |

## 不可覆盖清单

| 路径 | 不可覆盖原因 | 本变更中的接触方式 |
|---|---|---|
| `TypeScript/Main.ts` | 用户已注释 `GameplayRuntime` 实例化，为用户维护的 PuerTS 入口 | 仅 M3（4.5）增量追加一次 bootstrap 调用，保留既有代码 |
| `openspec/config.yaml` | 用户改写为中文 `context`/`rules`，是 artifact 生成的约束来源 | 只读 |
| `Docs/`（含 `.obsidian`、`05_GameJam/`、`04_Lyra/` 既有笔记） | 用户个人笔记；`05_GameJam/逻辑构思以及开发任务.md` 处于正在编辑状态 | 只新增本变更文档（本文件与两个矩阵），不改既有笔记 |
| `Plugins/EasyEditorPlugin` 工作树 | 用户有未提交修改 `TypeScript/index.ts`、`TypeScript/runtime.ts` | 不触碰；如构建链路需要其改动，先与用户确认 |
| `Plugins/Puerts` 工作树 | 独立仓库，随上游迭代 | 不触碰；其未跟踪构建产物不纳入本变更 |

## 记录人说明

- 主仓库当前唯一的未提交改动是用户自己的 `Docs/05_GameJam/逻辑构思以及开发任务.md`，不属于本变更，不得覆盖或提交。
- `Docs/.obsidian/workspace.json` 是 Obsidian 自动写入的状态文件：会话开始时的初始 git status 即已为 `M`，此后随编辑反复变更。属预期噪音，不作为需对齐的基线内容；提交时忽略该路径。
