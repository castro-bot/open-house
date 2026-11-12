import Phaser from 'phaser';
import { AppShell } from './app-shell';
import { CipherScene } from './cipher-scene';
import { isCorrectAnswer } from './cipher-rules';
import './style.css';
import './game-themes.css';
import './game-shell.css';

const WIDTH = 960;
const HEIGHT = 540;

const root = document.querySelector<HTMLElement>('#app');
if (!root) throw new Error('Falta el contenedor de la aplicación.');

let audio: AudioContext | null = null;

function playSuccessTone(): void {
  const AudioCtx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return;
  audio ??= new AudioCtx();
  const ctx = audio;
  void ctx.resume();
  const now = ctx.currentTime;
  [523.25, 659.25, 783.99].forEach((frequency, index) => {
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = 'square';
    oscillator.frequency.value = frequency;
    const start = now + index * 0.07;
    gain.gain.setValueAtTime(0.07, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.18);
    oscillator.connect(gain).connect(ctx.destination);
    oscillator.start(start);
    oscillator.stop(start + 0.2);
  });
}

const scene = new CipherScene({
  onShift(shift) {
    shell.setAlignment(shift);
  },
});

const shell = new AppShell(root, {
  reset() {
    scene.reset();
    shell.resetForm();
  },
  rotate(delta) {
    scene.nudge(delta);
  },
  check() {
    if (!isCorrectAnswer(shell.getAnswer())) {
      shell.hideSuccess();
      shell.showError();
      return;
    }
    playSuccessTone();
    shell.showSuccess();
  },
});

new Phaser.Game({
  type: Phaser.AUTO,
  parent: shell.stage,
  width: WIDTH,
  height: HEIGHT,
  transparent: true,
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  scene: [scene],
});

window.addEventListener('keydown', (event) => {
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
  const active = document.activeElement;
  if (active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement) return;
  event.preventDefault();
  scene.nudge(event.key === 'ArrowRight' ? 1 : -1);
});
