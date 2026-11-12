export const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const LETTER_COUNT = ALPHABET.length;
export const STEP_DEGREES = 360 / LETTER_COUNT;
export const CIPHERTEXT = 'SLGH WX VREUH';
export const PLAINTEXT = 'PIDE TU SOBRE';
export const RIDDLE = 'La clave es cuántos lados tiene un triángulo';
export const GUIDE_HINT = 'Busquen la S en el círculo grande. ¿Qué letra queda debajo?';

export function wrapShift(value: number): number {
  return ((value % LETTER_COUNT) + LETTER_COUNT) % LETTER_COUNT;
}

export function letterAt(index: number): string {
  return ALPHABET[wrapShift(index)] ?? 'A';
}

export function outerLetterAboveInnerA(shift: number): string {
  return letterAt(shift);
}

export function alignmentLabel(shift: number): string {
  return `La A está bajo la ${outerLetterAboveInnerA(shift)}`;
}

export function decryptChar(char: string, shift: number): string {
  const index = ALPHABET.indexOf(char);
  if (index < 0) return char;
  return letterAt(index - shift);
}

export function decrypt(text: string, shift: number): string {
  return [...text].map((char) => decryptChar(char, shift)).join('');
}

export function normalizeAnswer(text: string): string {
  return text
    .toUpperCase()
    .replace(/[^A-Z]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

export function isCorrectAnswer(text: string): boolean {
  return normalizeAnswer(text) === PLAINTEXT;
}

export function snapShiftFromRotation(degrees: number): number {
  return wrapShift(Math.round(degrees / STEP_DEGREES));
}

export function rotationForShift(shift: number): number {
  return wrapShift(shift) * STEP_DEGREES;
}
