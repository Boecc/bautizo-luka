# Invitación del bautizo de Luka 🦁☀️

Web-invitación con tema de sabana: toca el sol para que amanezca, sigue el camino de la iglesia al restaurante, mira la cuenta atrás y confirma por WhatsApp.

HTML, CSS y JavaScript puros, sin frameworks ni dependencias.

## Ver la web en local

- Abre `index.html` en el navegador, o
- en VSCode, con la extensión **Live Server** → "Go Live", o
- `npm start` (usa `npx serve`).

## Tests

```bash
npm test
```

Necesita Node 20 o superior. Prueban la cuenta atrás (`js/countdown.js`) y los enlaces de WhatsApp (`js/links.js`).

## Dónde cambiar cada dato

| Qué | Dónde |
| --- | --- |
| Fecha y hora de la cuenta atrás, teléfonos, nombre del bebé | `js/config.js` |
| Textos, horas, enlaces de ubicación (Google Maps) | `index.html` |
| Colores y fuentes | `css/styles.css` (variables en `:root`) |
| Duración del amanecer | `SUNRISE_MS` en `js/intro.js` |
| Canción (código del vídeo de YouTube) | `musicYouTubeId` en `js/config.js` |

Al cambiar los teléfonos, cambia también los `href` por defecto de los botones de WhatsApp en `index.html` (solo se usan si falla el JavaScript).

## Estructura

```
index.html          Página completa (portada, recorrido, cuenta atrás, RSVP)
src/bebe-leon.png   Cachorro de la portada (PNG con fondo transparente)
css/styles.css      Estilos y animaciones
js/config.js        Datos del evento
js/intro.js         Animación del sol
js/music.js         Canción de YouTube que arranca al tocar el sol
js/journey.js       Huella que recorre el camino y aparición al hacer scroll
js/countdown.js     Cuenta atrás
js/links.js         Mensaje y enlaces de WhatsApp
tests/              Tests con node:test
```

## Publicar

- **Vercel / Netlify:** arrastra la carpeta del proyecto a su panel (es una web estática, sin build).
- **GitHub Pages:** sube el repo y activa Pages sobre la rama `main`.

Para que al compartir el enlace por WhatsApp salga una imagen de vista previa, añade en el `<head>` de `index.html` una etiqueta `og:image` con la URL absoluta de una imagen ya publicada.

## Tramos de commits sugeridos

1. `chore: estructura inicial del proyecto` → `package.json`, `.gitignore`, `js/config.js`
2. `feat: portada interactiva del sol` → `index.html`, `css/styles.css`, `js/intro.js`
3. `feat: recorrido iglesia → restaurante` → `js/journey.js`
4. `feat: cuenta atrás` → `js/countdown.js`, `tests/countdown.test.js`
5. `feat: confirmación de asistencia por WhatsApp` → `js/links.js`, `tests/links.test.js`
6. `docs: README` → `README.md`
