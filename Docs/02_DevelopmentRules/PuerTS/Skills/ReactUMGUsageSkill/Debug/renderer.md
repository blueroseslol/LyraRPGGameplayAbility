# 渲染链路与已知实现边界

2026-10-09 静态核对：ReactUMG checkout `906b7f5`，以下是当前文件观察，换版本需复核；不是运行测试结果。

## 源码入口

相对工程根目录：

- `Plugins/ReactUMG/TypeScript/react-umg/react-umg.ts`：`deepEquals`、`UEWidget`、`hostConfig`、`ReactUMG`。
- `Plugins/ReactUMG/Source/ReactUMG/ReactWidget.cpp`：原生单根容器。
- `Plugins/ReactUMG/Source/ReactUMG/UMGManager.cpp`：创建 Widget、同步 Widget/Slot。
- `Typing/react-umg/index.d.ts`：编写接口；`Content/JavaScript/react-umg/`：核对实际运行产物。

## 顺着证据定位

| 阶段 | 观察点 |
| --- | --- |
| 挂载 | `ReactUMG.init(world)` → `render` → 创建 root 与 reconciler container |
| 创建 | `createInstance` → `UEWidget.init` → `new UE[type]()` 或 lazyload 的 `UE.NewObject` → merge props |
| Slot | 父容器 AddChild 产生 nativeSlot，再应用缓存的 Slot 配置 |
| 更新 | state/props → render → `prepareUpdate` → `commitUpdate` → `UEWidget.update` → merge + Synchronize |
| 事件 | `bind` 分辨 Add/Bind，保存 Remove/Unbind 回调；检查实际移除路径是否到达 |

ReactUMG 是 React reconciler 经 PuerTS 驱动原生 UMG/Slate。桥接、比较、分配均有成本，不能承诺零开销或兼容所有 React/DOM 库。

## 当前源码风险

| 观察 | 诊断含义 |
| --- | --- |
| `deepEquals` 跳过 children 和 Slot，`prepareUpdate` 仅返回该比较结果 | 仅 Slot 变化可能不提交；“新 Slot 对象必刷新”不成立 |
| `update` 只遍历 newProps | 删除属性或事件未必恢复默认或解除绑定 |
| `unbind` 将 remover 置 undefined，`unbindAll` 直接调用记录值 | 清理路径需要检查是否存在空 remover；不保证所有事件自动释放 |
| `removeChildFromContainer` 实际移除代码被注释 | 根移除不能视为已完成清理 |
| `Root.removeFromViewport` 只调用原生移出视口 | 不等于 reconciler unmount，也不证明 effects/订阅已清理 |
| UReactWidget 已有 RootSlot 时 AddChild 返回 nullptr | 顶层 Fragment 多个原生子节点需要外层 Panel |

以上用于选择复现，不在业务任务中顺带改完整 renderer。涉及修复时验证受影响行为：仅 Slot 更新、移除事件、卸载后不再回调、重新挂载可交互；按改动选择必要项。
