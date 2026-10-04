# ReactUMG 实现与验证

[返回技能入口](skill.md) · [设计采集](figwright-integration.md)

依赖安装和常用脚本见 [Setup.md](Setup.md)，已有脚本优先复用。
## 选择控件与布局

| 设计关系 | 适合的 UMG 控件 | 注意事项 |
| --- | --- | --- |
| 背景、图标、文字叠层 | Overlay | 子项顺序决定覆盖关系；Slot 使用边距和对齐 |
| 横向/纵向 Auto Layout | HorizontalBox / VerticalBox | 映射间距、Padding、Auto/Fill 和交叉轴对齐 |
| 两端分布、剩余空间 | Box + Spacer | 通过父 Box 的 Slot.Size Fill 分配空间 |
| 等尺寸项目网格 | UniformGridPanel | Row/Column；区分独立卡片和已烘焙组合图 |
| 跨行列、不等尺寸网格 | GridPanel | 行列填充、跨度及层级 |
| 按宽度自动换行 | WrapBox | 仅在设计或需求确有换行语义时使用 |
| 固定/最小/最大尺寸 | SizeBox | 约束期望尺寸，仍受父布局分配影响 |
| 固定画板整体缩放 | ScaleBox + SizeBox | 明确 Stretch、宽高比和对齐，不擅自改变缩放行为 |
| 滚动区域、平台安全区 | ScrollBox / SafeZone | 按产品需求启用，不额外制造交互 |
| 自由定位、锚点浮层 | CanvasPanel | 固定锚点下 Right/Bottom 是宽高，拉伸时是边距 |
| 文字与点击区域 | TextBlock / RichTextBlock / Button | 核对字体、混合样式、输入与真实业务回调 |

不机械地逐个 Figma Frame 生成 Canvas。可在保持裁剪、绘制顺序和事件范围的前提下合并无意义的嵌套；不能只为消灭 Canvas 而堆叠补偿边距。

## 显式 JSX 与内联 Slot

先检查工程实际控件导出和属性声明。以下为结构示例，尺寸与 Brush 应来自目标设计：

```tsx
import * as React from 'react';
import * as UMG from 'react-umg';
import type { OverlaySlot } from 'react-umg';
import UE = require('ue');

// 优先使用有类型的控件导出；仅旧版声明缺失时沿用工程的 any 兼容方式。
const { Overlay, SizeBox, Image } = UMG as any;

export class DesignPanel extends React.Component<{ iconBrush: Partial<UE.SlateBrush> }> {
    render() {
        return (
            <Overlay>
                <SizeBox WidthOverride={48} HeightOverride={36}
                    Slot={{
                        Padding: { Left: 8, Top: 4 },
                        HorizontalAlignment: UE.EHorizontalAlignment.HAlign_Left,
                        VerticalAlignment: UE.EVerticalAlignment.VAlign_Top,
                    } satisfies OverlaySlot}>
                    <Image Brush={this.props.iconBrush} />
                </SizeBox>
            </Overlay>
        );
    }
}
```

- Slot 类型取决于直接父容器：SizeBox 在 Overlay 下使用 OverlaySlot，其内部 Image 若指定 Slot 则使用 SizeBoxSlot。无需单独写 `<OverlaySlot>` 标签。
- `CanvasPanelSlot` 同样可内联。TS 4.9+ 可用 `satisfies` 保留字段检查；更旧编译器采用工程已有的类型标注方式。
- 单次 Slot 放在标签中；复用、条件或复杂计算再抽变量。属性助手可创建 Texture Brush、颜色和字体，不应隐藏整个控件树。
- Overlay 不直接提供子项宽高：使用 Brush.ImageSize 的期望尺寸或 SizeBox；明确 Fill 与 Left/Top 等对齐的区别。
- 将绝对位置改为 Box 时按兄弟尺寸和边距重新计算，不能把每个源 X/Y 原样作为 Padding。重叠图层继续用 Overlay 或 Canvas。

## 资源与行为

1. 沿用工程资产导入路径，给 Image 的 Brush 绑定真实 Texture2D ResourceObject。确认 UI 压缩、sRGB、mip 和过滤配置；导入设置可能相互影响，需检查最终值。
2. 确保颜色转换约定一致，避免 sRGB/线性空间重复转换。纹理原始边界、绘制偏移和显示尺寸分别处理。
3. 原生文本需有实际可用的字体、字重与排版映射。缺字体时明确指出；静态文字可按任务要求导出图层并标记，但不宣称可编辑或动态文本已实现。
4. Button 等控件使用明确事件属性，回调接入工程业务。无法映射的原型或动画单独报告，不静默省略、不虚构成功行为。
5. 若复用项目生成器，先检查它实际支持的输出与降级行为。生成代码与手写业务明确分离；不假设生成器自动推断合理 Layout。

## 编译与挂载

沿用工程根 tsconfig、UE typings、现有依赖和编译/watch 路径。检查 JSX 编译结果真正落在 PuerTS 加载目录；只执行 `--noEmit` 不会更新游戏。

在有效 world 下调用 `ReactUMG.init(world)`，再 `ReactUMG.render(<DesignPanel ... />)`，由调用方保存返回的 root，并在页面退出时卸载。先核实当前 renderer 是否自动加入 viewport，避免重复添加。不要绕过工程既有的启动参数、调试等待或生命周期逻辑。

Figwright、采集工具、截图辅助模块不应成为游戏运行依赖。资源通过动态路径加载时，另行核对 Cook 收集规则。

## 验证与交付

- **静态**：工程真实 typings 检查、依赖解析和实际 JS 产物；修改转换工具时再执行相应测试。
- **UE 运行**：加载本次修改的页面类，检查控件树、纹理/字体和事件。测试旧 generated 模块或通用 IR 渲染器不能证明手写组件通过。
- **视觉**：统一画板尺寸、DPI、状态和截图范围，检查参考图与 UE 图。保留阈值、差异图和实际结论；结构重构还应与修改前基线比较。
- **行为**：含交互时核对实际输入、焦点与回调；直接触发委托不等于鼠标命中通过。响应式或动态内容要覆盖不同窗口、文本长度和项目数量。
- **交付边界**：列出代码/资源位置、静态化与未支持内容、已执行测试和剩余验证。无可用 UE 环境时可以交付代码与静态结果，但明确运行和视觉尚未验证。

使用工程已有的测试入口和截图工具；没有专用 DesignBridge 脚本或编辑器模块时，不照搬另一工程命令或为此默认安装整套框架。运行证据应记录本次组件、环境和产物，人工接受、离屏测试、PIE 与打包分别表述。
