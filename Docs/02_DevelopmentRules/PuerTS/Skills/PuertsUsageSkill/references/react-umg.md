# react-umg/react-umg.ts 写法

源示例：`puerts_unreal_demo/TypeScript/react-umg/react-umg.ts`

## 作用

这是一个 React Reconciler renderer，把 JSX 元素映射成 UMG Widget。写业务 UI 时优先查 `UsingReactUMG.md`、`main-ui-index.md`；改 renderer 时查本文件。

## 创建 UE Widget

```ts
const classPath = exports.lazyloadComponents[type];
this.nativePtr = classPath
  ? UE.NewObject(UE.Class.Load(classPath)) as UE.Widget
  : new UE[type]();
```

规则：
- JSX `type` 对应 `UE[type]` 构造器，例如 `Button`、`TextBlock`。
- 自定义 lazy component 可通过 class path 加载。
- 初始化属性用 `puerts.merge(this.nativePtr, props)`。

## 绑定事件 props

```ts
const prop = nativePtr[name];
if (typeof prop.Add === 'function') {
  prop.Add(callback);
  remover = () => prop.Remove(callback);
} else if (typeof prop.Bind === 'function') {
  prop.Bind(callback);
  remover = () => prop.Unbind();
}
```

规则：
- multicast delegate 用 `Add`/`Remove`。
- single-cast delegate 用 `Bind`/`Unbind`。
- props 更新时先 unbind 旧函数，再 bind 新函数。

## 属性与 Slot 同步

```ts
puerts.merge(this.nativePtr, myProps);
UE.UMGManager.SynchronizeWidgetProperties(this.nativePtr);

puerts.merge(this.nativeSlotPtr, this.slot);
UE.UMGManager.SynchronizeSlotProperties(this.nativeSlotPtr);
```

规则：
- 创建阶段 merge 后通常不需要手动同步；更新阶段要调用同步函数。
- `children` 和 `Slot` 不当作普通 Widget 属性。
- `Slot` 必须等 `PanelWidget.AddChild` 返回 `PanelSlot` 后再 merge。

## root

```ts
ReactUMG.init(world);
ReactUMG.render(<Root />);
```

规则：
- `render` 前必须设置 `world`。
- root 使用 `UE.UMGManager.CreateReactWidget(world)` 创建 `UE.ReactWidget`。
- `resetAfterCommit` 中 `AddToViewport(0)`，渲染后自动显示。
