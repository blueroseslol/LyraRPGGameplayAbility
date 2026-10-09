# ReactUMG 诊断补充

从实际症状选一条路径；源码推断与 UE 复现分开记录。

| 症状 | 先查 |
| --- | --- |
| 类型错误、原生数组/out 参数 | [TArray](../../PuertsUsageSkill/references/NewContainer.md)、[Ref](../../PuertsUsageSkill/references/Ref.md) |
| 位置、尺寸、居中或显隐错误 | [布局](../Create/layout.md) |
| 颜色不变、下拉框为空 | [样式与组件](../Create/style-and-controls.md) |
| 拖动时重建、ref 反复绑定、坐标偏移 | [更新与引用](../Create/updates-and-refs.md) |
| props 正确仍不刷新、卸载/事件残留 | [渲染链路](renderer.md) |

定位到组件、声明和相关实现后，形成一个可验证假设；用最小复现观察 state/props → commit → 原生属性的首次分歧。调试器可用时优先断点查看，不为排查向源码堆临时日志。

修复落在已证实的层级；不以随机 key、反复重新 render 根或盲目 Synchronize 掩盖问题。修复 renderer 时同时检查业务调用点与编译产物是否使用该版本。

交付说明：根因证据、修改位置、本次验证和剩余限制。类型通过不代表 UE 画面或清理链路通过。
