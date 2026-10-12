// Enlaces de WhatsApp con el mensaje de confirmación ya escrito.

/** Deja solo los dígitos y añade el prefijo de país si el número tiene 9 cifras. */
function normalizePhone(phone, countryCode = '34') {
  const digits = String(phone).replace(/\D/g, '');
  return digits.length === 9 ? countryCode + digits : digits;
}

/** Texto del mensaje de confirmación: asistentes, sus nombres y notas sobre el menú. */
function buildRsvpMessage({ names = [], people = 1, babyName = 'Luka', dateText = '', dietNotes = '' } = {}) {
  const n = Math.max(1, parseInt(people, 10) || 1);
  const filled = names.map((name) => String(name).trim()).filter(Boolean).slice(0, n);
  const when = dateText ? ` el ${dateText}` : '';
  const count = n === 1 ? 'Asistirá 1 persona' : `Asistiremos ${n} personas`;
  const lines = [
    `¡Hola! Confirmo ${n === 1 ? 'mi' : 'nuestra'} asistencia al bautizo de ${babyName}${when}.`,
    filled.length ? `${count}:` : `${count}.`,
    ...filled.map((name) => `• ${name}`)
  ];
  const diet = String(dietNotes).trim();
  if (diet) lines.push(`Alergias o menú: ${diet}`);
  return lines.join('\n');
}

/** URL de wa.me con el mensaje codificado. */
function whatsappLink(phone, message, countryCode = '34') {
  return `https://wa.me/${normalizePhone(phone, countryCode)}?text=${encodeURIComponent(message)}`;
}

function initRsvp() {
  const namesBox = document.getElementById('guest-names');
  const countSelect = document.getElementById('guest-count');
  const dietInput = document.getElementById('guest-diet');
  const links = document.querySelectorAll('a[data-contact]');
  if (!namesBox || !countSelect || typeof CONFIG === 'undefined') return;

  // Lo ya escrito se conserva aunque se cambie el número de personas
  const names = [];

  function update() {
    const message = buildRsvpMessage({
      names,
      people: countSelect.value,
      babyName: CONFIG.babyName,
      dateText: CONFIG.eventDateText,
      dietNotes: dietInput ? dietInput.value : ''
    });
    links.forEach((a) => {
      const contact = CONFIG.contacts[a.dataset.contact];
      if (contact) a.href = whatsappLink(contact.phone, message, CONFIG.countryCode);
    });
  }

  // Un campo de nombre por cada persona seleccionada
  function renderNames() {
    const n = parseInt(countSelect.value, 10) || 1;
    namesBox.textContent = '';
    for (let i = 0; i < n; i++) {
      const label = document.createElement('label');
      label.textContent = n === 1 ? 'Tu nombre' : `Nombre de la persona ${i + 1}`;
      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = 'Nombre y apellido';
      input.value = names[i] || '';
      input.addEventListener('input', () => {
        names[i] = input.value;
        update();
      });
      label.appendChild(input);
      namesBox.appendChild(label);
    }
    update();
  }

  countSelect.addEventListener('change', renderNames);
  if (dietInput) dietInput.addEventListener('input', update);
  renderNames();
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initRsvp);
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { normalizePhone, buildRsvpMessage, whatsappLink };
}
