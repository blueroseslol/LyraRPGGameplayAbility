# 更新、引用与交互

## 身份与状态

同一父层级下，key 与元素类型共同影响复用。拖拽坐标、动画帧不能作为 key；会排序或删插的列表优先业务 ID。有意重置组件状态时才更换 key。

私有字段变化本身不触发 React render；可见状态通过 state/props/现有订阅更新。不要原地修改后复用同一 props 对象，当前比较逻辑可能直接判等。React render 发生也不代表原生更新已经提交。

## React ref

当前 renderer 的 `getPublicInstance` 返回 UEWidget 包装对象，原生对象在 `nativePtr`。稳定回调可用类字段箭头函数或构造时绑定，不要求所有组件必须改成 class。函数组件是否可用 Hooks 以实际 React 与 typings 版本为准。

回调收到 null 时清除引用；新实例到达时恢复必要的同步。原生实例无效或宿主 world 已销毁时不能继续调用。UE 函数 `$Ref<T>` 是另一种机制，见 [Ref](../../PuertsUsageSkill/references/Ref.md)。

## 拖拽坐标

- `GetMousePositionOnViewport` 返回 viewport 坐标，不等同于嵌套控件的 local 坐标。
- 需要目标容器的局部位置时，用目标容器 Geometry 与 `AbsoluteToLocal` 转换屏幕事件坐标，核对 DPI/缩放和布局是否已就绪。
- 位置写入对应父容器的 Slot；Canvas 使用 `LayoutData.Offsets`，不是扁平的 `Slot.Left/Top`。

## 生命周期

明确谁初始化 world、挂载根、持有 root，以及退出时谁释放订阅、计时器和输入捕获。当前 `removeFromViewport()` 只移出视口，不能当作 React 树已卸载。仅 Slot 变化、事件移除、根卸载的实现风险见 [渲染链路](../Debug/renderer.md)。
