import { deflateSync } from 'node:zlib';
import { createPackage } from '../src/package.mjs';

function crc32(bytes) {
  let c = 0xffffffff;
  for (const b of bytes) { c ^= b; for (let i = 0; i < 8; i++) c = (c >>> 1) ^ ((c & 1) ? 0xedb88320 : 0); }
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const header = Buffer.alloc(8); header.writeUInt32BE(data.length); header.write(type, 4);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(Buffer.concat([Buffer.from(type), data])));
  return Buffer.concat([header, data, crc]);
}
export function png(width, height, pixel = () => [255, 255, 255, 255]) {
  const bytes = Buffer.alloc(height * (width * 4 + 1));
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const color = pixel(x, y); const offset = y * (width * 4 + 1) + 1 + x * 4;
    for (let i = 0; i < 4; i++) bytes[offset + i] = color[i];
  }
  const header = Buffer.alloc(13); header.writeUInt32BE(width); header.writeUInt32BE(height, 4); header[8] = 8; header[9] = 6;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', header), chunk('IDAT', deflateSync(bytes)), chunk('IEND', Buffer.alloc(0))]);
}
export function fixture() {
  return { schemaVersion: 1, id: 'fixture', source: { kind: 'fixture', name: 'Synthetic pipeline test, NOT the user Figma design' },
    canvas: { width: 640, height: 360 }, assets: [], diagnostics: [], nodes: [
      { id: 'root', name: 'Synthetic canvas', parentId: null, type: 'frame', bounds: { x: 0, y: 0, width: 640, height: 360 }, opacity: 1, fill: [24 / 255, 40 / 255, 64 / 255, 1], clip: true },
      { id: 'panel', name: 'Parent transform', parentId: 'root', type: 'frame', bounds: { x: 40, y: 50, width: 260, height: 260 }, opacity: 1, fill: [232 / 255, 136 / 255, 48 / 255, 1] },
      { id: 'art', name: 'Real imported image', parentId: 'panel', type: 'image', bounds: { x: 30, y: 40, width: 160, height: 160 }, opacity: 1, assetId: 'checker' },
      { id: 'button', name: 'Explicit action', parentId: 'root', type: 'button', bounds: { x: 350, y: 90, width: 220, height: 120 }, opacity: 1, fill: [40 / 255, 176 / 255, 144 / 255, 1], action: 'fixture.clicked' },
      { id: 'dot', name: 'Native brush', parentId: 'button', type: 'shape', bounds: { x: 80, y: 30, width: 60, height: 60 }, opacity: 1, fill: [1, 1, 1, 1] },
    ] };
}
export function checker(x, y) { return (Math.floor(x / 10) + Math.floor(y / 10)) % 2 ? [224, 72, 96, 255] : [48, 128, 224, 255]; }
export async function writeFixture(directory) {
  const design = fixture();
  const reference = png(640, 360, (x, y) => {
    if (x >= 70 && x < 230 && y >= 90 && y < 250) return checker(x - 70, y - 90);
    if (x >= 40 && x < 300 && y >= 50 && y < 310) return [232, 136, 48, 255];
    if (x >= 430 && x < 490 && y >= 120 && y < 180) return [255, 255, 255, 255];
    if (x >= 350 && x < 570 && y >= 90 && y < 210) return [40, 176, 144, 255];
    return [24, 40, 64, 255];
  });
  return createPackage(directory, design, [{ id: 'checker', bytes: png(160, 160, checker), sourceNodeId: 'art' }], { fixture: true, notUserDesign: true }, reference);
}
