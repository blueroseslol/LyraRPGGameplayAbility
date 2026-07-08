# RunCaseTestAndDisplay.ts 写法

源示例：`puerts_unreal_demo/TypeScript/RunCaseTestAndDisplay.ts`

## 结构

- `RunCaseTest`：初始化 Mocha、运行测试、格式化 summary。
- `DisplayTest`：创建 UMG Widget，点击按钮后运行测试并把结果写入 TextBox。

## 创建 Widget

基础 Widget Blueprint 创建、cast 和 `AddToViewport` 查 `UsingWidget.md`。本文件只补充测试面板逻辑：

- Widget 类型是 `UE.Game.StarterContent.CaseTestWidget.CaseTestWidget_C`。
- 需要访问 `Button`、`TextBox`、`Overlay` 等 Blueprint 子控件时，必须 cast 到生成的具体类型。
- UI 初始状态用 UPROPERTY 方法设置，例如 `Overlay.SetVisibility(...)`。

## 按钮驱动异步结果

```ts
widget.Button.OnClicked.Add(() => {
  widget.TextBox.SetText('Running...');
  runTest.runMochaTests('./CaseTest.js', (res) => {
    widget.TextBox.SetText(res);
    widget.TextBox.SetIsReadOnly(true);
  });
});
```

规则：
- UMG multicast event 用 `OnClicked.Add(fn)`。
- 用状态位防止重复运行测试。
- 在异步回调里更新 UI 前确认 Widget 生命周期仍有效。
