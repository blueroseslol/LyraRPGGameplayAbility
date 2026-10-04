import * as React from 'react';
import * as UMG from 'react-umg';
import { ReactUMG } from 'react-umg';
import type { HorizontalBoxSlot, OverlaySlot } from 'react-umg';
import UE = require('ue');
import { linear, rootOpacity, shapeBrush, textureBrush } from '../../Plugins/ReactUMG/TypeScript/ReactUMGTest/jsx-props';

const { Overlay, SizeBox, HorizontalBox, Spacer, Image } = UMG as any;
const { HAlign_Left, HAlign_Fill } = UE.EHorizontalAlignment;
const { VAlign_Top, VAlign_Fill } = UE.EVerticalAlignment;

export class FigwrightCover extends React.Component<{ opacity?: number }> {
    render() {
        return (
            <Overlay RenderOpacity={rootOpacity(1, this.props.opacity)}
                Visibility={UE.ESlateVisibility.SelfHitTestInvisible}
                Clipping={UE.EWidgetClipping.ClipToBounds}>
                <SizeBox WidthOverride={1600} HeightOverride={960}
                    Slot={{ HorizontalAlignment: HAlign_Left, VerticalAlignment: VAlign_Top } as OverlaySlot}>
                    <Overlay>
                        {/* 叠层按声明顺序绘制；Image 的原始尺寸来自 Brush.ImageSize。 */}
                        <Image
                            Slot={{ HorizontalAlignment: HAlign_Fill, VerticalAlignment: VAlign_Fill } as OverlaySlot}
                            Brush={textureBrush('/Game/ReactUMG/FigwrightCover/Textures/T_f517ef7cde0971cbc7224e1b.T_f517ef7cde0971cbc7224e1b', 1600, 960)}
                            ColorAndOpacity={linear([1, 1, 1, 1])}
                            Visibility={UE.ESlateVisibility.HitTestInvisible} />
                        <Image
                            Slot={{ Padding: { Left: 785, Top: 133 }, HorizontalAlignment: HAlign_Left, VerticalAlignment: VAlign_Top } as OverlaySlot}
                            Brush={textureBrush('/Game/ReactUMG/FigwrightCover/Textures/T_09447b8589513e078812e056.T_09447b8589513e078812e056', 719, 746)}
                            ColorAndOpacity={linear([1, 1, 1, 1])}
                            Visibility={UE.ESlateVisibility.HitTestInvisible} />

                        <SizeBox HeightOverride={91}
                            Slot={{ HorizontalAlignment: HAlign_Fill, VerticalAlignment: VAlign_Top } as OverlaySlot}>
                            <Overlay>
                                <Image
                                    Slot={{ HorizontalAlignment: HAlign_Fill, VerticalAlignment: VAlign_Fill } as OverlaySlot}
                                    Brush={shapeBrush(1600, 91, [0.30980393290519714, 0.49803921580314636, 0.7882353067398071, 1], [0, 0, 0, 0], [0, 0, 0, 0], 0)}
                                    ColorAndOpacity={linear([1, 1, 1, 1])}
                                    Visibility={UE.ESlateVisibility.HitTestInvisible} />
                                <Image
                                    Slot={{ Padding: { Left: 4, Top: 4, Right: 4, Bottom: 4 }, HorizontalAlignment: HAlign_Fill, VerticalAlignment: VAlign_Fill } as OverlaySlot}
                                    Brush={textureBrush('/Game/ReactUMG/FigwrightCover/Textures/T_6c6d77f11514dcb516980f37.T_6c6d77f11514dcb516980f37', 1592, 83)}
                                    ColorAndOpacity={linear([1, 1, 1, 1])}
                                    Visibility={UE.ESlateVisibility.HitTestInvisible} />
                                <HorizontalBox
                                    Slot={{ HorizontalAlignment: HAlign_Fill, VerticalAlignment: VAlign_Fill } as OverlaySlot}>
                                    <SizeBox WidthOverride={48} HeightOverride={36}
                                        Slot={{ Padding: { Top: 28 }, Size: { SizeRule: UE.ESlateSizeRule.Automatic }, VerticalAlignment: VAlign_Top } as HorizontalBoxSlot}>
                                        {/* 两个装饰片重叠 2px，因此此处继续使用 Overlay。 */}
                                        <Overlay Clipping={UE.EWidgetClipping.ClipToBounds}>
                                            <Image
                                                Slot={{ HorizontalAlignment: HAlign_Fill, VerticalAlignment: VAlign_Fill } as OverlaySlot}
                                                Brush={shapeBrush(48, 36, [0.30980393290519714, 0.49803921580314636, 0.7882353067398071, 1], [0, 0, 0, 0], [0, 0, 0, 0], 0)}
                                                ColorAndOpacity={linear([1, 1, 1, 1])}
                                                Visibility={UE.ESlateVisibility.HitTestInvisible} />
                                            <Image
                                                Slot={{ Padding: { Top: 4 }, HorizontalAlignment: HAlign_Left, VerticalAlignment: VAlign_Top } as OverlaySlot}
                                                Brush={textureBrush('/Game/ReactUMG/FigwrightCover/Textures/T_b8984f709a2bf9a89c9609ce.T_b8984f709a2bf9a89c9609ce', 10, 28)}
                                                ColorAndOpacity={linear([1, 1, 1, 1])}
                                                Visibility={UE.ESlateVisibility.HitTestInvisible} />
                                            <Image
                                                Slot={{ Padding: { Left: 8, Top: 4 }, HorizontalAlignment: HAlign_Left, VerticalAlignment: VAlign_Top } as OverlaySlot}
                                                Brush={textureBrush('/Game/ReactUMG/FigwrightCover/Textures/T_e4ad46a24f54b316139b8bda.T_e4ad46a24f54b316139b8bda', 40, 28)}
                                                ColorAndOpacity={linear([1, 1, 1, 1])}
                                                Visibility={UE.ESlateVisibility.HitTestInvisible} />
                                        </Overlay>
                                    </SizeBox>
                                    <Image
                                        Slot={{ Padding: { Left: 6.97607421875, Top: 25.7039794921875 }, Size: { SizeRule: UE.ESlateSizeRule.Automatic }, VerticalAlignment: VAlign_Top } as HorizontalBoxSlot}
                                        Brush={textureBrush('/Game/ReactUMG/FigwrightCover/Textures/T_10499ee093ea0a62c06609d0.T_10499ee093ea0a62c06609d0', 219, 44)}
                                        ColorAndOpacity={linear([1, 1, 1, 1])}
                                        Visibility={UE.ESlateVisibility.HitTestInvisible} />
                                    <Spacer Size={{ X: 0, Y: 0 }}
                                        Slot={{ Size: { SizeRule: UE.ESlateSizeRule.Fill, Value: 1 } } as HorizontalBoxSlot} />
                                    <Image
                                        Slot={{ Padding: { Top: 28 }, Size: { SizeRule: UE.ESlateSizeRule.Automatic }, VerticalAlignment: VAlign_Top } as HorizontalBoxSlot}
                                        Brush={textureBrush('/Game/ReactUMG/FigwrightCover/Textures/T_6e5e082dc61dc08015fb5570.T_6e5e082dc61dc08015fb5570', 48, 36)}
                                        ColorAndOpacity={linear([1, 1, 1, 1])}
                                        Visibility={UE.ESlateVisibility.HitTestInvisible} />
                                </HorizontalBox>
                            </Overlay>
                        </SizeBox>
                        <Image
                            Slot={{ Padding: { Left: 55.080078125, Top: 164.4000244140625 }, HorizontalAlignment: HAlign_Left, VerticalAlignment: VAlign_Top } as OverlaySlot}
                            Brush={textureBrush('/Game/ReactUMG/FigwrightCover/Textures/T_1da0076440199fe1f3cea81f.T_1da0076440199fe1f3cea81f', 502, 645)}
                            ColorAndOpacity={linear([1, 1, 1, 1])}
                            Visibility={UE.ESlateVisibility.HitTestInvisible} />
                    </Overlay>
                </SizeBox>
            </Overlay>
        );
    }
}

export function loadFigwrightCover(world: UE.World): ReturnType<typeof ReactUMG.render> {
    ReactUMG.init(world);
    return ReactUMG.render(<FigwrightCover />);
}
