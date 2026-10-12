// Portada interactiva: un toque al sol y amanece poco a poco, sin saltos.
(function () {
  const intro = document.getElementById('intro');
  const sun = document.getElementById('sun');
  const starsBox = document.getElementById('stars');
  const goBtn = document.getElementById('go');
  if (!intro || !sun) return;

  const SUNRISE_MS = 8000; // duración del amanecer completo
  const REVEAL_AT = 0.75;  // punto del amanecer (0 → 1) en el que aparece Luka
  let started = false;
  let revealed = false;

  // Estrellas del cielo nocturno
  for (let i = 0; i < 46; i++) {
    const s = document.createElement('i');
    const size = Math.random() * 2.2 + 1;
    s.style.left = Math.random() * 100 + '%';
    s.style.top = Math.random() * 55 + '%';
    s.style.width = s.style.height = size + 'px';
    s.style.animationDelay = Math.random() * 3 + 's';
    starsBox.appendChild(s);
  }

  // Arranca y frena con suavidad, como el sol de verdad
  function ease(t) {
    return (1 - Math.cos(Math.PI * t)) / 2;
  }

  function reveal() {
    if (revealed) return;
    revealed = true;
    intro.classList.add('is-done');
    document.body.classList.remove('is-locked');
  }

  function sunrise() {
    let startTime = null;
    function frame(now) {
      if (startTime === null) startTime = now;
      const t = Math.min((now - startTime) / SUNRISE_MS, 1);
      intro.style.setProperty('--p', ease(t).toFixed(4));
      if (t >= REVEAL_AT) reveal();
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  sun.addEventListener('click', () => {
    if (started) return;
    started = true;
    sun.disabled = true;
    intro.classList.add('is-rising');
    if (window.startMusic) window.startMusic();
    sunrise();
  });

  goBtn.addEventListener('click', () => {
    document.getElementById('content').scrollIntoView({ behavior: 'smooth' });
  });
})();
