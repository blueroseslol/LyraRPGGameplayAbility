# ReactUMG 编写补充

沿用项目现有组件与加载入口。先定位相关组件和所需声明，不默认阅读整套文档。

## 按需读取

| 当前任务 | 参考 |
| --- | --- |
| Canvas 锚点、Slot、对齐、显隐 | [布局](layout.md) |
| 颜色、输入框主题、下拉框 | [样式与组件](style-and-controls.md) |
| key、ref、状态更新、拖拽坐标 | [更新与引用](updates-and-refs.md) |
| TArray、UE 引用参数 | [TArray](../../PuertsUsageSkill/references/NewContainer.md)、[Ref](../../PuertsUsageSkill/references/Ref.md) |
| Figma 转换、资源与工程接入 | [已有 Figwright 规范](../../../ReactUMG/skill.md) |
| 属性正确但 UI 不变、挂载或清理异常 | [诊断](../Debug/guide.md) |

## 编写边界

- 控件、事件、枚举查工程 `Typing/react-umg/index.d.ts` 与 `Typing/ue/ue.d.ts`；使用实际导出的组件，不照搬 `uCanvasPanel` 或大写 `Ref`。
- Slot 属于直接父容器。当前 UReactWidget 只接受一个原生根控件；多个顶层控件用 Panel 包裹。
- 列表用业务身份作 key；位置和外观通过 props 更新。事件处理与 ref 保持必要的稳定性。
- ReactUMG 输出原生 UMG；声明中出现 CommonUI/MVVM 类型不代表已接入其生命周期。
- 只要求规划时，给出组件树、状态归属、事件、挂载/卸载责任和验收点即可；已要求实现时继续完成实现，不额外增加批准环节。
- 类型检查、JS 产物、UE 运行及视觉/交互分别报告，未运行的环节明确标记。
