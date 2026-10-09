# 样式与组件补充

## 颜色按属性类型选择

| 属性 | 类型/结构 |
| --- | --- |
| TextBlock.ColorAndOpacity、样式中的 ForegroundColor、Brush.TintColor | SlateColor：`{ SpecifiedColor: { R, G, B, A }, ColorUseRule: ... }` |
| TextBlock.ShadowColorAndOpacity、Border.BrushColor/ContentColorAndOpacity、Image.ColorAndOpacity | LinearColor：`{ R, G, B, A }` |

设置固定颜色时，SlateColor 显式使用 `UE.ESlateColorStylingMode.UseColor_Specified`（当前值 0）；需要继承前景色或样式色时保留对应模式。不要给 LinearColor 添加 ColorUseRule，也不要一律覆盖继承模式。

EditableTextBox 深色主题检查 `BackgroundImageNormal/Hovered/Focused` 和 `ForegroundColor/FocusedForegroundColor`，避免只改正常状态。圆角相关 `DrawAs`、`RoundingType` 查实际枚举与声明，不复制魔法数字。类型正确后仍不变，再检查同步链路。

## ComboBoxString 动态选项

当前 renderer 先创建 UObject，再 merge props；引擎在 `PostInitProperties/PostLoad` 把 DefaultOptions 转成运行时选项，因此构造后仅设置 DefaultOptions 不能当作动态更新方案。

通过稳定的 React ref 获取 `instance.nativePtr`，按当前 props 同步原生控件：

1. 挂载取得新实例，保存引用并同步选项。
2. options 内容变化时 `ClearOptions()`，逐项 `AddOption()`；只改选择时不必重建选项。
3. selectedValue 存在于选项中才 `SetSelectedOption()`；否则按业务约定清空或选择默认项。
4. 程序化同步可能触发选择事件；用同步标记或当前值比较避免事件回写循环。
5. ref 收到 null 时清引用；重新挂载的新实例再次同步。

不能只用一次性的 `initialized` 布尔值，它会遗漏 props 更新和实例替换。若使用项目的 ManagedComboBoxString，先确认组件存在并覆盖上述行为。

## 查组件的最短入口

当前 `Typing/react-umg/index.d.ts` 是完整 API 索引：按控件名定位 Props 和事件签名。常用搜索项：`ProgressBarProps`、`SpinBoxProps`、`ScrollBoxProps`、`EditableTextBoxProps`、`ComboBoxStringProps`。不另维护易过期的全组件表。
