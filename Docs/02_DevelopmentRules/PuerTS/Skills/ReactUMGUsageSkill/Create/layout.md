# Slot 与布局

Slot 类型由直接父容器决定。JSX 的配置类型从 `react-umg` 导入，不把配置对象声明成原生 `UE.CanvasPanelSlot` 实例。

## Canvas 按轴判断

| 轴 | 锚点相等 | 锚点不等（拉伸） |
| --- | --- | --- |
| X | Left 为位置，Right 为宽度 | Left、Right 为两侧边距 |
| Y | Top 为位置，Bottom 为高度 | Top、Bottom 为两侧边距 |

X、Y 可以采用不同模式。拉伸轴的尺寸为锚点跨度减两侧边距；Right/Bottom 为正数时向内缩。固定轴还受 `Alignment` 与 `bAutoSize` 影响。

```typescript
import { CanvasPanelSlot } from 'react-umg';

// 全屏内缩 10。
const inset: CanvasPanelSlot = {
    LayoutData: {
        Anchors: { Minimum: { X: 0, Y: 0 }, Maximum: { X: 1, Y: 1 } },
        Offsets: { Left: 10, Top: 10, Right: 10, Bottom: 10 },
    },
    bAutoSize: false,
};

// 左侧宽 200，高度拉伸：X 固定，Y 拉伸。
const sidebar: CanvasPanelSlot = {
    LayoutData: {
        Anchors: { Minimum: { X: 0, Y: 0 }, Maximum: { X: 0, Y: 1 } },
        Offsets: { Left: 0, Top: 0, Right: 200, Bottom: 0 },
    },
    bAutoSize: false,
};
```

其他常见配置（均假定 Alignment 为零、`bAutoSize: false`）：

| 需求 | Minimum → Maximum | Left / Top / Right / Bottom |
| --- | --- | --- |
| 居中占 70% × 80% | (0.15, 0.1) → (0.85, 0.9) | 0 / 0 / 0 / 0 |
| 底部高 60 | (0, 1) → (1, 1) | 0 / -60 / 0 / 60 |
| 右下角 100 × 40，边距 10 | (1, 1) → (1, 1) | -110 / -50 / 100 / 40 |

## 其他容器与枚举

Box 用于横纵排布，Grid 用于行列，Overlay 用于叠放；Canvas 用于自由定位。属性名查对应接口：当前 Box/Overlay 使用 `HorizontalAlignment/VerticalAlignment`，SafeZoneSlot 才使用 `HAlign/VAlign`，不能统一缩写。

优先使用具名枚举：`UE.EHorizontalAlignment.HAlign_Center`、`UE.EVerticalAlignment.VAlign_Center`，当前声明中的值均为 2。`Visible/Collapsed/Hidden/HitTestInvisible/SelfHitTestInvisible` 分别为 0/1/2/3/4；Hidden 保留布局，Collapsed 不保留；HitTestInvisible 排除自身及子树命中，SelfHitTestInvisible 仅排除自身。

只改变 Slot 后未刷新，转 [诊断](../Debug/guide.md)，不要通过变化 key 强制重建掩盖问题。
