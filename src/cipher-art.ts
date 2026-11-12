import type Phaser from 'phaser';
import { LETTER_COUNT } from './cipher-rules';

export const WHEEL = {
  cx: 480,
  cy: 278,
  outer: 232,
  inner: 152,
  hub: 58,
};

export const COLORS = {
  ink: 0x1e5a9c,
  page: 0xeaf6ff,
  wash: 0xbfe3fa,
  mid: 0x7fc4f2,
  deep: 0x3e8fd6,
  gold: 0xffd27d,
  white: 0xffffff,
};

const STEP = (Math.PI * 2) / LETTER_COUNT;

function tick(graphics: Phaser.GameObjects.Graphics, radius: number, length: number, color: number): void {
  const { cx, cy } = WHEEL;
  graphics.lineStyle(2, color, 1);
  for (let i = 0; i < LETTER_COUNT; i++) {
    const angle = -Math.PI / 2 + (i + 0.5) * STEP;
    graphics.lineBetween(
      cx + Math.cos(angle) * (radius - length),
      cy + Math.sin(angle) * (radius - length),
      cx + Math.cos(angle) * radius,
      cy + Math.sin(angle) * radius,
    );
  }
}

export function drawWheel(graphics: Phaser.GameObjects.Graphics): void {
  const { cx, cy, outer, inner, hub } = WHEEL;
  graphics.clear();

  graphics.fillStyle(COLORS.ink);
  graphics.fillCircle(cx, cy, outer);
  graphics.fillStyle(COLORS.deep);
  graphics.fillCircle(cx, cy, outer - 10);

  graphics.fillStyle(COLORS.gold);
  graphics.fillCircle(cx, cy, inner + 7);
  graphics.fillStyle(COLORS.page);
  graphics.fillCircle(cx, cy, inner);

  tick(graphics, outer - 12, 10, COLORS.gold);
  tick(graphics, inner - 2, 8, COLORS.ink);

  graphics.fillStyle(COLORS.ink);
  graphics.fillCircle(cx, cy, hub);
  graphics.fillStyle(COLORS.gold);
  graphics.fillCircle(cx, cy, hub - 9);
  graphics.fillStyle(COLORS.page);
  graphics.fillCircle(cx, cy, hub - 16);

  graphics.fillStyle(COLORS.ink);
  graphics.fillRect(cx - 10, cy - 18, 20, 22);
  graphics.fillStyle(COLORS.page);
  graphics.fillRect(cx - 6, cy - 8, 12, 8);
  graphics.lineStyle(3, COLORS.ink, 1);
  graphics.strokeCircle(cx, cy - 20, 8);

  graphics.fillStyle(COLORS.gold);
  graphics.fillTriangle(cx, cy - outer - 6, cx - 16, cy - outer + 20, cx + 16, cy - outer + 20);
}

export function letterPosition(index: number, radius: number, extraRadians = 0): { x: number; y: number } {
  const angle = -Math.PI / 2 + index * STEP + extraRadians;
  return {
    x: WHEEL.cx + Math.cos(angle) * radius,
    y: WHEEL.cy + Math.sin(angle) * radius,
  };
}
