// Recorrido: una huella recorre el sendero mientras haces scroll
// y las paradas aparecen suavemente.
(function () {
  const section = document.getElementById('journey');
  const path = document.getElementById('walk-path');
  const paw = document.getElementById('paw');
  const walkClip = document.getElementById('walk-clip');

  // --- Aparición de elementos con .reveal ---
  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });
    items.forEach((el) => io.observe(el));
  } else {
    items.forEach((el) => el.classList.add('is-visible'));
  }

  // --- Huella que sigue el sendero ---
  if (!section || !path || !paw) return;
  const VB_W = 100;
  const VB_H = 1000;
  const EASE = 0.1; // fracción de la distancia que avanza la huella en cada fotograma
  const total = path.getTotalLength();
  let target = 0;  // dónde debería estar la huella según el scroll (0 → 1)
  let current = 0; // dónde está dibujada; persigue a target poco a poco
  let running = false;

  function measure() {
    const rect = section.getBoundingClientRect();
    target = Math.min(1, Math.max(0, (window.innerHeight * 0.55 - rect.top) / rect.height));
  }

  function draw() {
    const len = total * current;
    const pt = path.getPointAtLength(len);
    // La huella mira hacia donde avanza el sendero (el SVG está estirado: se pasa a píxeles)
    const a = path.getPointAtLength(Math.max(0, len - 2));
    const b = path.getPointAtLength(Math.min(total, len + 2));
    const dx = (b.x - a.x) * section.clientWidth / VB_W;
    const dy = (b.y - a.y) * section.clientHeight / VB_H;
    const angle = Math.atan2(dy, dx) * 180 / Math.PI + 90;
    paw.style.left = (pt.x / VB_W) * 100 + '%';
    paw.style.top = (pt.y / VB_H) * 100 + '%';
    paw.style.transform = 'translate(-50%, -50%) rotate(' + angle.toFixed(1) + 'deg)';
    if (walkClip) walkClip.setAttribute('height', pt.y.toFixed(1));
  }

  function tick() {
    const diff = target - current;
    if (Math.abs(diff) < 0.0005) {
      current = target;
      running = false;
    } else {
      current += diff * EASE;
      requestAnimationFrame(tick);
    }
    draw();
  }

  function requestUpdate() {
    measure();
    if (!running) {
      running = true;
      requestAnimationFrame(tick);
    }
  }

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  measure();
  current = target;
  draw();
})();
