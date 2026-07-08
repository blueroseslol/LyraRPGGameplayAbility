# main-ui/index.tsx 写法

源示例：`puerts_unreal_demo/TypeScript/main-ui/index.tsx`

## React UMG 页面

```tsx
import * as React from 'react';
import { VerticalBox, CanvasPanel, ReactUMG, Button, HorizontalBox } from 'react-umg';

export function Load() {
  return ReactUMG.render(<Hello names={['Health:', 'Energy:']} />);
}
```

规则：
- JSX 标签名对应 `react-umg` 导出的 UE Widget 类型名。
- 文本子节点会被 renderer 转成 `TextBlock`。
- 根组件通过 `ReactUMG.render(...)` 挂到 `UE.ReactWidget`。

## Slot 属性

```tsx
const slot: CanvasPanelSlot = {
  LayoutData: {
    Offsets: { Left: 120, Top: 120, Right: 480, Bottom: 80 },
  },
};

<VerticalBox Slot={slot}>...</VerticalBox>
```

规则：
- `Slot` 不是 Widget 属性，是父 PanelSlot 属性。
- `Slot` 对象字段按 UMG slot 类型写；renderer 内部同步细节查 `react-umg.md`。

## React 状态

```tsx
<Button
  OnHovered={() => this.setState({ buttonTextureIndex: 1 })}
  OnUnhovered={() => this.setState({ buttonTextureIndex: 0 })}
>
  {this.state.buttonTextureIndex === 0 ? 'normal' : 'hovered'}
</Button>
```

规则：
- delegate props 用函数传入，renderer 自动 Add/Bind。
- `setState` 后由 reconciler 刷新对应 UMG 属性。
