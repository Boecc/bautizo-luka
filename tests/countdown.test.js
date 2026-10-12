const { test } = require('node:test');
const assert = require('node:assert');
const { getTimeLeft } = require('../js/countdown.js');

const target = new Date('2026-11-14T12:00:00+01:00');

test('calcula días, horas, minutos y segundos exactos', () => {
  // 2 días, 3 horas, 4 minutos y 5 segundos antes
  const now = new Date(target.getTime() - ((2 * 86400) + (3 * 3600) + (4 * 60) + 5) * 1000);
  assert.deepStrictEqual(getTimeLeft(target, now), {
    done: false, days: 2, hours: 3, minutes: 4, seconds: 5
  });
});

test('un segundo antes: todo a cero menos los segundos', () => {
  const now = new Date(target.getTime() - 1000);
  assert.deepStrictEqual(getTimeLeft(target, now), {
    done: false, days: 0, hours: 0, minutes: 0, seconds: 1
  });
});

test('ignora los milisegundos sobrantes (redondea hacia abajo)', () => {
  const now = new Date(target.getTime() - 1500);
  assert.strictEqual(getTimeLeft(target, now).seconds, 1);
});

test('en el instante exacto del evento está terminado', () => {
  const res = getTimeLeft(target, new Date(target));
  assert.strictEqual(res.done, true);
  assert.deepStrictEqual([res.days, res.hours, res.minutes, res.seconds], [0, 0, 0, 0]);
});

test('después del evento está terminado y no hay valores negativos', () => {
  const now = new Date(target.getTime() + 3600 * 1000);
  const res = getTimeLeft(target, now);
  assert.strictEqual(res.done, true);
  assert.strictEqual(res.days, 0);
});
