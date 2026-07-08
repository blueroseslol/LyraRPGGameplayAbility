# main-ui/ui-components.tsx 写法

源示例：`puerts_unreal_demo/TypeScript/main-ui/ui-components.tsx`

## 可复用控件

```tsx
export class StatusBar extends React.Component<Props, State> {
  render() {
    return (
      <HorizontalBox>
        <TextBlock Text={`${this.props.name}(${this.state.percent.toFixed(2)})`} />
        <ProgressBar Percent={this.state.percent} Slot={SlotOfProgressBar} FillColorAndOpacity={this.color} />
        <Button OnClicked={this.onIncrement}>+</Button>
      </HorizontalBox>
    );
  }
}
```

规则：
- 组件 props/state 按普通 React 写。
- UE struct 属性可用 partial object 设置，例如 `Partial<UE.LinearColor>`。
- `HorizontalBoxSlot.Size.SizeRule = 1` 用于让 ProgressBar 填充剩余空间。
- UMG delegate props 用 `OnClicked={handler}`。

## 状态和颜色

```ts
get color(): Partial<UE.LinearColor> {
  return { R: 1 - this.state.percent, G: 0, B: this.state.percent };
}
```

规则：
- plain object 会被 renderer 合并到 UE struct/object；实现细节查 `react-umg.md`。
- 数值范围仍由 UE 控件解释；业务代码应自行 clamp percent。
