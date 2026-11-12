import Phaser from 'phaser';
import { drawWheel, letterPosition, WHEEL } from './cipher-art';
import { ALPHABET, rotationForShift, snapShiftFromRotation, wrapShift } from './cipher-rules';

const FONT = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

type Callbacks = {
  onShift(shift: number): void;
};

function shortestDelta(from: number, to: number): number {
  let delta = to - from;
  while (delta > Math.PI) delta -= Math.PI * 2;
  while (delta < -Math.PI) delta += Math.PI * 2;
  return delta;
}

export class CipherScene extends Phaser.Scene {
  private innerLetters: Phaser.GameObjects.Text[] = [];
  private shift = 0;
  private dragDegrees = 0;
  private dragging = false;
  private lastPointerAngle = 0;

  constructor(private callbacks: Callbacks) {
    super({ key: 'cipher', active: true });
  }

  create(): void {
    const graphics = this.add.graphics();
    [...ALPHABET].forEach((letter, index) => {
      const point = letterPosition(index, 204);
      this.add.text(point.x, point.y, letter, {
        fontFamily: FONT,
        fontSize: '21px',
        color: '#eaf6ff',
        fontStyle: 'bold',
      }).setOrigin(0.5).setDepth(1);
    });
    this.innerLetters = [...ALPHABET].map((letter, index) => {
      const point = letterPosition(index, 118);
      const color = letter === 'A' ? '#b8860b' : '#1e5a9c';
      return this.add.text(point.x, point.y, letter, {
        fontFamily: FONT,
        fontSize: '21px',
        color,
        fontStyle: 'bold',
      }).setOrigin(0.5).setDepth(1);
    });
    drawWheel(graphics);
    this.layoutInnerLetters();

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      const distance = Phaser.Math.Distance.Between(pointer.x, pointer.y, WHEEL.cx, WHEEL.cy);
      if (distance > WHEEL.outer) return;
      this.dragging = true;
      this.lastPointerAngle = Math.atan2(pointer.y - WHEEL.cy, pointer.x - WHEEL.cx);
    });
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (!this.dragging) return;
      const angle = Math.atan2(pointer.y - WHEEL.cy, pointer.x - WHEEL.cx);
      this.dragDegrees += shortestDelta(this.lastPointerAngle, angle) * (180 / Math.PI);
      this.lastPointerAngle = angle;
      this.layoutInnerLetters();
      this.callbacks.onShift(snapShiftFromRotation(this.dragDegrees));
    });
    this.input.on('pointerup', () => this.endDrag());
    this.input.on('pointerupoutside', () => this.endDrag());
  }

  nudge(delta: number): void {
    this.setShift(this.shift + delta);
  }

  reset(): void {
    this.dragging = false;
    this.setShift(0);
  }

  private setShift(shift: number): void {
    this.shift = wrapShift(shift);
    this.dragDegrees = rotationForShift(this.shift);
    this.layoutInnerLetters();
    this.callbacks.onShift(this.shift);
  }

  private endDrag(): void {
    if (!this.dragging) return;
    this.dragging = false;
    this.setShift(snapShiftFromRotation(this.dragDegrees));
  }

  private layoutInnerLetters(): void {
    const extra = (this.dragDegrees * Math.PI) / 180;
    this.innerLetters.forEach((text, index) => {
      const point = letterPosition(index, 118, extra);
      text.setPosition(point.x, point.y);
    });
  }
}
