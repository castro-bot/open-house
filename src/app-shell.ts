import { CIPHERTEXT, GUIDE_HINT, RIDDLE, alignmentLabel } from './cipher-rules';

type ShellEvents = {
  reset(): void;
  check(): void;
  rotate(delta: number): void;
};

function required<T extends Element>(root: ParentNode, selector: string): T {
  const element = root.querySelector<T>(selector);
  if (!element) throw new Error(`Falta el elemento ${selector}.`);
  return element;
}

export class AppShell {
  readonly stage: HTMLElement;
  private readonly overlay: HTMLElement;
  private readonly alignment: HTMLElement;
  private readonly answer: HTMLInputElement;
  private readonly error: HTMLElement;

  constructor(root: HTMLElement, events: ShellEvents) {
    root.dataset.game = 'cipher';
    root.innerHTML = `
      <section class="panel" aria-labelledby="title">
        <div class="game-topbar">
          <span class="game-brand">P / P <span>OPEN HOUSE // HACKEA EL LAB</span></span>
          <span class="game-number">BASE 04 / 04</span>
          <button id="reset-button" class="menu-button" type="button">Reiniciar</button>
        </div>
        <header class="game-header">
          <div class="game-titleblock">
            <p class="eyebrow">PULSO PIXEL // CRIPTOGRAFÍA</p>
            <h1 id="title">Descifra el mensaje</h1>
          </div>
          <div class="hud">
            <div class="hud-stat">
              <span>Alineación</span>
              <strong id="alignment">${alignmentLabel(0)}</strong>
            </div>
          </div>
        </header>
        <div class="game-layout">
          <div class="game-board">
            <div class="board-topline"><span><i aria-hidden="true">▣</i> RUEDA DE CIFRADO</span><span>BASE 4 // CANDADO</span></div>
            <div id="stage" class="stage">
              <div id="round-overlay" class="overlay" hidden>
                <div class="overlay-card">
                  <span class="overlay-kicker">PULSO PIXEL // BASE 4</span>
                  <h2>Mensaje descifrado</h2>
                  <p>Pide tu sobre al guía.</p>
                </div>
              </div>
            </div>
            <div class="status-row">
              <p>Gira el círculo chico con el mouse o las flechas</p>
              <p>Encaja letra por letra</p>
            </div>
          </div>
          <aside class="game-sidebar" aria-label="Pistas y respuesta">
            <div class="side-panel">
              <p class="side-kicker">01 / ADIVINANZA</p>
              <strong>${RIDDLE}</strong>
            </div>
            <div class="side-panel">
              <p class="side-kicker">02 / MENSAJE</p>
              <p class="cipher-message">${CIPHERTEXT}</p>
              <div class="rotate-row">
                <button id="rotate-left" type="button">← Letra</button>
                <button id="rotate-right" type="button">Letra →</button>
              </div>
              <form id="answer-form" class="answer-form">
                <label for="answer">Mensaje descifrado</label>
                <input id="answer" name="answer" type="text" autocomplete="off" spellcheck="false" placeholder="ESCRIBE AQUÍ">
                <button id="check-button" type="submit">Comprobar</button>
              </form>
              <p id="check-error" class="check-error" hidden>Revisen la rueda y vuelvan a traducir. La respuesta no está aquí.</p>
            </div>
            <div class="side-panel">
              <p class="side-kicker">03 / PISTA DEL GUÍA</p>
              <p class="guide-hint">${GUIDE_HINT}</p>
            </div>
            <p class="privacy">El dígito está en el sobre. Esta pantalla no lo muestra.</p>
          </aside>
        </div>
      </section>
    `;

    this.stage = required(root, '#stage');
    this.overlay = required(root, '#round-overlay');
    this.alignment = required(root, '#alignment');
    this.answer = required(root, '#answer');
    this.error = required(root, '#check-error');

    required<HTMLButtonElement>(root, '#reset-button').addEventListener('click', () => events.reset());
    required<HTMLButtonElement>(root, '#rotate-left').addEventListener('click', () => events.rotate(-1));
    required<HTMLButtonElement>(root, '#rotate-right').addEventListener('click', () => events.rotate(1));
    required<HTMLFormElement>(root, '#answer-form').addEventListener('submit', (event) => {
      event.preventDefault();
      events.check();
    });
  }

  setAlignment(shift: number): void {
    this.alignment.textContent = alignmentLabel(shift);
  }

  getAnswer(): string {
    return this.answer.value;
  }

  showError(): void {
    this.error.hidden = false;
  }

  hideError(): void {
    this.error.hidden = true;
  }

  showSuccess(): void {
    this.hideError();
    this.overlay.hidden = false;
  }

  hideSuccess(): void {
    this.overlay.hidden = true;
  }

  resetForm(): void {
    this.answer.value = '';
    this.hideError();
    this.hideSuccess();
    this.answer.focus();
  }
}
