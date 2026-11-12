import assert from 'node:assert/strict';
import test from 'node:test';
import {
  CIPHERTEXT,
  PLAINTEXT,
  alignmentLabel,
  decrypt,
  isCorrectAnswer,
  normalizeAnswer,
  rotationForShift,
  snapShiftFromRotation,
  wrapShift,
} from '../src/cipher-rules.ts';

test('el desplazamiento 3 descifra SLGH WX VREUH', () => {
  assert.equal(decrypt(CIPHERTEXT, 3), PLAINTEXT);
  assert.equal(alignmentLabel(3), 'La A está bajo la D');
});

test('la normalización ignora mayúsculas y espacios de más', () => {
  assert.equal(normalizeAnswer('  pide   tu sobre '), PLAINTEXT);
  assert.equal(isCorrectAnswer('Pide tu sobre'), true);
  assert.equal(isCorrectAnswer('PIDE  TU   SOBRE'), true);
  assert.equal(isCorrectAnswer('EL DIGITO ES SIETE'), false);
});

test('el reinicio es desplazamiento 0', () => {
  assert.equal(wrapShift(0), 0);
  assert.equal(rotationForShift(0), 0);
  assert.equal(snapShiftFromRotation(0), 0);
  assert.equal(decrypt(CIPHERTEXT, 0), CIPHERTEXT);
  assert.equal(alignmentLabel(0), 'La A está bajo la A');
});
