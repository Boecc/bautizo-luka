const { test } = require('node:test');
const assert = require('node:assert');
const { normalizePhone, buildRsvpMessage, whatsappLink } = require('../js/links.js');

test('normalizePhone añade el prefijo 34 a un número de 9 cifras', () => {
  assert.strictEqual(normalizePhone('647470724'), '34647470724');
});

test('normalizePhone quita espacios y símbolos', () => {
  assert.strictEqual(normalizePhone('+34 610 64 99 89'), '34610649989');
});

test('normalizePhone no duplica el prefijo si ya viene', () => {
  assert.strictEqual(normalizePhone('34647470724'), '34647470724');
});

test('mensaje con varias personas lista un nombre por línea', () => {
  const msg = buildRsvpMessage({
    names: ['María López', 'Juan Pérez', 'Ana'], people: 3, babyName: 'Luka', dateText: '14 de noviembre de 2026'
  });
  assert.strictEqual(
    msg,
    '¡Hola! Confirmo nuestra asistencia al bautizo de Luka el 14 de noviembre de 2026.\n' +
    'Asistiremos 3 personas:\n• María López\n• Juan Pérez\n• Ana'
  );
});

test('mensaje en singular cuando es una persona', () => {
  const msg = buildRsvpMessage({ names: ['Ana'], people: 1, babyName: 'Luka' });
  assert.strictEqual(msg, '¡Hola! Confirmo mi asistencia al bautizo de Luka.\nAsistirá 1 persona:\n• Ana');
});

test('los nombres vacíos no aparecen en el mensaje', () => {
  const msg = buildRsvpMessage({ names: ['   ', 'Juan', ''], people: 3, babyName: 'Luka' });
  assert.match(msg, /Asistiremos 3 personas:\n• Juan$/);
});

test('mensaje sin ningún nombre termina en el número de personas', () => {
  const msg = buildRsvpMessage({ names: ['', ''], people: 2, babyName: 'Luka' });
  assert.match(msg, /Asistiremos 2 personas\.$/);
});

test('los nombres que sobran al reducir el número de personas se descartan', () => {
  const msg = buildRsvpMessage({ names: ['Ana', 'Juan', 'Leo'], people: 2, babyName: 'Luka' });
  assert.ok(!msg.includes('Leo'));
});

test('las alergias o notas del menú van al final', () => {
  const msg = buildRsvpMessage({ names: ['Ana'], people: 1, babyName: 'Luka', dietNotes: '  Ana es celíaca ' });
  assert.match(msg, /• Ana\nAlergias o menú: Ana es celíaca$/);
});

test('sin notas del menú no se añade esa línea', () => {
  const msg = buildRsvpMessage({ names: ['Ana'], people: 1, babyName: 'Luka', dietNotes: '   ' });
  assert.ok(!msg.includes('Alergias'));
});

test('número de personas inválido se trata como 1', () => {
  const msg = buildRsvpMessage({ people: 'abc', babyName: 'Luka' });
  assert.match(msg, /1 persona\./);
});

test('whatsappLink codifica el mensaje y usa el número normalizado', () => {
  const url = whatsappLink('647470724', 'Hola & adiós');
  assert.strictEqual(url, 'https://wa.me/34647470724?text=Hola%20%26%20adi%C3%B3s');
});
