/* Local Plugin API capture. No network, no generated design content. */
if (typeof __DESIGNBRIDGE_LOCAL__ === 'undefined') figma.showUI(__html__, { width: 440, height: 530 });
const sendDesignBridgeMessage = typeof __DESIGNBRIDGE_LOCAL__ === 'undefined'
  ? message => figma.ui.postMessage(message) : __DESIGNBRIDGE_LOCAL__.emit;
let running = false;
const cloneJSON = value => JSON.parse(JSON.stringify(value, (_key, v) => typeof v === 'symbol' ? 'MIXED' : v));
const visiblePaints = paints => Array.isArray(paints) ? paints.filter(p => p.visible !== false) : [];
function snapshot(node, budget = { count: 0 }) {
  if (++budget.count > 10000) throw new Error('超过 10000 个节点，请缩小导出范围');
  const out = { id: node.id, name: node.name, type: node.type };
  for (const key of ['visible', 'x', 'y', 'width', 'height', 'rotation', 'opacity', 'absoluteBoundingBox', 'absoluteRenderBounds', 'relativeTransform', 'layoutMode', 'constraints', 'clipsContent', 'fills', 'strokes', 'strokeWeight', 'strokeAlign', 'effects', 'cornerRadius', 'rectangleCornerRadii', 'topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius', 'cornerSmoothing', 'characters', 'fontName', 'fontSize', 'lineHeight', 'letterSpacing', 'textAutoResize', 'textAlignHorizontal', 'textAlignVertical', 'reactions', 'componentProperties', 'isMask', 'blendMode']) {
    if (key in node && node[key] !== undefined) out[key] = cloneJSON(node[key]);
  }
  if ('children' in node) out.children = node.children.map(n => snapshot(n, budget));
  return out;
}
function hasInteraction(node) {
  return (Array.isArray(node.reactions) && node.reactions.length > 0) || ('children' in node && node.children.some(hasInteraction));
}
function isGraphics(node) {
  if (node.type === 'TEXT' || hasInteraction(node)) return false;
  return 'children' in node ? node.children.every(isGraphics) : ['VECTOR', 'BOOLEAN_OPERATION', 'STAR', 'POLYGON', 'LINE', 'ELLIPSE', 'RECTANGLE'].includes(node.type);
}
function paintColor(p) { return [p.color.r, p.color.g, p.color.b, (p.color.a === undefined ? 1 : p.color.a) * (p.opacity === undefined ? 1 : p.opacity)]; }
function cornerRadii(node) { return ['topLeftRadius', 'topRightRadius', 'bottomRightRadius', 'bottomLeftRadius'].map(k => typeof node[k] === 'number' ? node[k] : typeof node.cornerRadius === 'number' ? node.cornerRadius : 0); }

async function exportDesignBridge(message) {
  if (message.type !== 'export' || running) return;
  running = true;
  let staging;
  try {
    const root = await figma.getNodeByIdAsync(message.nodeId || '1:4210');
    if (!root || !['FRAME', 'COMPONENT', 'INSTANCE'].includes(root.type)) throw new Error('请选择具体 Frame/Component/Instance');
    if (!figma.fileKey) throw new Error('当前插件未返回 fileKey，请使用开发插件模式');
    if (message.fileKey && figma.fileKey !== message.fileKey) throw new Error('当前文件与指定验收文件不同，已停止');
    let page = root;
    while (page.parent && page.type !== 'PAGE') page = page.parent;
    await figma.setCurrentPageAsync(page);
    const before = snapshot(root);
    const original = JSON.stringify(before);
    const rootBox = root.absoluteBoundingBox;
    if (!rootBox || root.rotation) throw new Error('首版根画板需要未旋转且有明确尺寸');
    const design = { schemaVersion: 1, id: message.designId || 'genshin_cover', generator: '0.1.0',
      source: { kind: 'figma', fileKey: figma.fileKey, nodeId: root.id, name: root.name, captureMethod: 'plugin-api', capturedAt: new Date().toISOString(), textMode: message.textMode },
      canvas: { width: root.width, height: root.height }, nodes: [], assets: [], diagnostics: [] };
    const explicit = new Set((message.rasterizeNodes || '').split(/[\s,]+/).filter(Boolean));
    if (explicit.has(root.id)) throw new Error('禁止将整页截图作为原生 UI 导出');
    let count = 0;
    let totalBytes = 0;
    function warning(code, node, text) { design.diagnostics.push({ severity: 'warning', code, nodeId: node.id, message: text }); }
    async function emitAsset(node, kind, target = node, useAbsoluteBounds = false) {
      const bytes = await target.exportAsync({ format: 'PNG', constraint: { type: 'SCALE', value: 1 }, contentsOnly: true, useAbsoluteBounds });
      totalBytes += bytes.length;
      if (totalBytes > 100 * 1024 * 1024) throw new Error('导出超过 100 MiB，请缩小范围');
      const id = kind + ':' + node.id;
      sendDesignBridgeMessage({ type: 'asset', id, sourceNodeId: node.id, bytes: Array.from(bytes) });
      count++;
      sendDesignBridgeMessage({ type: 'progress', text: '已导出 ' + count + ' 个真实图层资源：' + node.name });
      return id;
    }
    async function background(node, out) {
      const paints = visiblePaints(node.fills), strokes = visiblePaints(node.strokes);
      if (!paints.length && !strokes.length) return;
      const simple = paints.length <= 1 && paints.every(p => p.type === 'SOLID') && strokes.length <= 1 && strokes.every(p => p.type === 'SOLID') && (!strokes.length || node.strokeAlign === 'INSIDE') && !visiblePaints(node.effects).length && !node.cornerSmoothing;
      if (simple) {
        if (paints.length) out.fill = paintColor(paints[0]);
        if (strokes.length) out.stroke = { color: paintColor(strokes[0]), width: node.strokeWeight };
        out.radii = cornerRadii(node); return;
      }
      if (visiblePaints(node.effects).length) throw new Error('容器效果依赖子内容，需明确栅格化静态子树：' + node.id);
      staging = staging || figma.createPage(); staging.name = '__DesignBridge_Export_Temporary__';
      const copy = node.clone();
      staging.appendChild(copy);
      try {
        if ('layoutMode' in copy) copy.layoutMode = 'NONE';
        for (const child of copy.children || []) child.visible = false;
        copy.resize(node.width, node.height); copy.rotation = 0; copy.x = 0; copy.y = 0; copy.opacity = 1;
        const bounds = copy.absoluteRenderBounds || copy.absoluteBoundingBox;
        const box = copy.absoluteBoundingBox;
        out.backgroundBounds = { x: bounds.x - box.x, y: bounds.y - box.y, width: bounds.width, height: bounds.height };
        out.backgroundAssetId = await emitAsset(node, 'background', copy);
        warning('BACKGROUND_PAINT_RASTERIZED', node, 'Only this container paint was exported from an isolated clone; original children remain separate widgets');
      } finally { copy.remove(); }
    }
    async function walk(node, parent) {
      if (node.visible === false) return;
      if (Array.isArray(node.reactions) && node.reactions.length) throw new Error('原型交互需要显式业务动作映射：' + node.id);
      if (node.blendMode && !['NORMAL', 'PASS_THROUGH'].includes(node.blendMode)) throw new Error('混合依赖相邻图层，不能单独导出：' + node.id);
      const box = node.absoluteBoundingBox;
      if (!box || box.width <= 0 || box.height <= 0) throw new Error('可见节点没有有效几何：' + node.id);
      const children = 'children' in node ? node.children.filter(n => n.visible !== false) : [];
      const fills = visiblePaints(node.fills), effects = visiblePaints(node.effects);
      const hasMask = children.some(n => n.isMask);
      const isTextRaster = node.type === 'TEXT' && message.textMode === 'raster';
      const graphicsGroup = node !== root && children.length > 0 && isGraphics(node);
      const strokes = visiblePaints(node.strokes);
      const complexLeaf = fills.length > 1 || fills.some(f => f.type !== 'SOLID') || strokes.length > 1 || strokes.some(f => f.type !== 'SOLID') || (strokes.length && node.strokeAlign !== 'INSIDE') || effects.length || node.isMask || node.cornerSmoothing;
      const raster = explicit.has(node.id) || isTextRaster || graphicsGroup || node.rotation || ['VECTOR', 'BOOLEAN_OPERATION', 'STAR', 'POLYGON', 'LINE', 'ELLIPSE'].includes(node.type) || (!children.length && node.type !== 'TEXT' && complexLeaf);
      if (raster && node !== root) {
        if (hasInteraction(node)) throw new Error('禁止静默烘焙有交互的节点：' + node.id);
        if (message.textMode !== 'raster' && node.type !== 'TEXT' && 'findOne' in node && node.findOne(n => n.type === 'TEXT')) throw new Error('静态子树包含原生文字，需明确选择静态文字模式：' + node.id);
        const render = node.absoluteRenderBounds || box;
        const pb = parent.absoluteBoundingBox;
        design.nodes.push({ id: node.id, name: node.name, parentId: parent.id, type: 'image',
          bounds: { x: render.x - pb.x, y: render.y - pb.y, width: render.width, height: render.height }, opacity: 1, clip: false,
          assetId: await emitAsset(node, 'node'), source: { type: node.type, rasterized: true, text: node.type === 'TEXT' ? node.characters : null } });
        warning(isTextRaster ? 'STATIC_TEXT_RASTERIZED' : 'STATIC_VISUAL_RASTERIZED', node, 'Rendered source pixels; full original subtree remains in source.json'); return;
      }
      if (hasMask) throw new Error('此容器包含蒙版，需明确导出静态子树：' + node.id);
      if (node.blendMode && !['NORMAL', 'PASS_THROUGH'].includes(node.blendMode)) throw new Error('此节点混合模式尚无等价映射：' + node.id);
      const pb = parent ? parent.absoluteBoundingBox : box;
      const out = { id: node.id, name: node.name, parentId: parent ? parent.id : null, type: children.length || node === root ? 'frame' : node.type === 'TEXT' ? 'text' : 'shape',
        bounds: { x: parent ? box.x - pb.x : 0, y: parent ? box.y - pb.y : 0, width: box.width, height: box.height }, opacity: node.opacity === undefined ? 1 : node.opacity,
        clip: !!node.clipsContent, source: { type: node.type, layoutMode: node.layoutMode || 'NONE', rasterized: false } };
      if (out.clip && cornerRadii(node).some(r => r > 0)) throw new Error('圆角容器裁剪需静态子树回退或自定义材质：' + node.id);
      if (node.type === 'TEXT') {
        if (node.fontName === figma.mixed || node.fontSize === figma.mixed || fills.length !== 1 || fills[0].type !== 'SOLID' || effects.length) throw new Error('混合/效果文字需要选择静态文字模式：' + node.id);
        const lh = node.lineHeight;
        if (node.textAlignVertical !== 'TOP' || !['LEFT', 'CENTER', 'RIGHT'].includes(node.textAlignHorizontal)) throw new Error('原生文字对齐不支持，请使用静态文字模式：' + node.id);
        warning('NATIVE_TEXT_METRICS_REQUIRE_REVIEW', node, 'Slate baseline, shaping and line height require visual acceptance; exact text appearance is not claimed');
        out.text = { content: node.characters, fontFamily: node.fontName.family, fontStyle: node.fontName.style, size: node.fontSize,
          color: paintColor(fills[0]), align: ({ LEFT: 'left', CENTER: 'center', RIGHT: 'right' })[node.textAlignHorizontal] || 'left',
          wrap: node.textAutoResize !== 'WIDTH_AND_HEIGHT', lineHeight: lh.unit === 'PIXELS' ? lh.value : lh.unit === 'PERCENT' ? node.fontSize * lh.value / 100 : node.fontSize,
          letterSpacing: node.letterSpacing.unit === 'PIXELS' ? node.letterSpacing.value : node.fontSize * node.letterSpacing.value / 100 };
      } else await background(node, out);
      design.nodes.push(out);
      if (node.layoutMode && node.layoutMode !== 'NONE') warning('LAYOUT_FROZEN', node, 'Source resolved layout is frozen at the selected canvas size');
      for (const child of children) await walk(child, node);
    }
    await walk(root, null);
    if (staging) { staging.remove(); staging = undefined; }
    if (JSON.stringify(snapshot(root)) !== original) throw new Error('采集期间设计发生改变，已拒绝交付不一致快照，请重试');
    const reference = await root.exportAsync({ format: 'PNG', constraint: { type: 'SCALE', value: 1 }, contentsOnly: true, useAbsoluteBounds: true });
    if (JSON.stringify(snapshot(root)) !== original) throw new Error('导出参考图期间设计发生改变，请重试');
    sendDesignBridgeMessage({ type: 'reference', bytes: Array.from(reference) });
    sendDesignBridgeMessage({ type: 'complete', design, source: before });
  } catch (error) { sendDesignBridgeMessage({ type: 'error', text: String(error.message || error) }); }
  finally { if (staging && !staging.removed) staging.remove(); running = false; }
};
if (typeof __DESIGNBRIDGE_LOCAL__ === 'undefined') figma.ui.onmessage = exportDesignBridge;
