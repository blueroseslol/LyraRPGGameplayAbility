# UsingWidget.ts 写法

源示例：`puerts_unreal_demo/TypeScript/UsingWidget.ts`

## 创建 Widget Blueprint

```ts
import * as UE from 'ue';
import { argv } from 'puerts';

const world = (argv.getByName('GameInstance') as UE.GameInstance).GetWorld() as UE.World;
const widgetClass = UE.Class.Load('/Game/StarterContent/TestWidgetBlueprint.TestWidgetBlueprint_C');
const widget = UE.UMGManager.CreateWidget(world, widgetClass) as UE.Game.StarterContent.TestWidgetBlueprint.TestWidgetBlueprint_C;
widget.AddToViewport(0);
```

规则：
- Widget Blueprint class 用 `UE.Class.Load('/Game/..._C')`。
- `CreateWidget` 返回 `UE.UserWidget`，要 cast 到 `ue_bp.d.ts` 中的具体类型才能访问子控件。
- `AddToViewport(zOrder)` 显示到屏幕。

## 绑定控件事件

```ts
widget.Button1.OnClicked.Add(() => {
  console.log(widget.TextBox.GetText());
});
```

规则：
- UMG `OnClicked` 是 multicast delegate，用 `Add(fn)`。
- 读取文本用控件方法，例如 `EditableTextBox.GetText()`。
- 长生命周期界面关闭时应 `Remove(fn)` 或确保 Widget 销毁能释放回调引用。
