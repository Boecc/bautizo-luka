// Cuenta atrás hasta el bautizo.

/**
 * Calcula el tiempo que falta entre `now` y `target`.
 * @param {Date} target fecha objetivo
 * @param {Date} [now] fecha actual (se puede pasar para testear)
 * @returns {{done:boolean, days:number, hours:number, minutes:number, seconds:number}}
 */
function getTimeLeft(target, now = new Date()) {
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) {
    return { done: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  const total = Math.floor(diff / 1000);
  return {
    done: false,
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60
  };
}

function initCountdown() {
  const grid = document.getElementById('countdown');
  if (!grid || typeof CONFIG === 'undefined') return;

  const target = new Date(CONFIG.eventDateISO);
  const els = {
    days: document.getElementById('cd-days'),
    hours: document.getElementById('cd-hours'),
    minutes: document.getElementById('cd-minutes'),
    seconds: document.getElementById('cd-seconds')
  };
  const doneMsg = document.getElementById('cd-done');
  const pad = (n) => String(n).padStart(2, '0');

  function tick() {
    const t = getTimeLeft(target);
    els.days.textContent = t.days;
    els.hours.textContent = pad(t.hours);
    els.minutes.textContent = pad(t.minutes);
    els.seconds.textContent = pad(t.seconds);
    if (t.done) {
      grid.hidden = true;
      doneMsg.hidden = false;
      clearInterval(timer);
    }
  }
  const timer = setInterval(tick, 1000);
  tick();
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initCountdown);
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { getTimeLeft };
}
