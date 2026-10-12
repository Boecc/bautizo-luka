// Música: un reproductor de YouTube que arranca cuando el invitado toca el sol.
// Los navegadores solo dejan sonar tras un toque, por eso startMusic() se llama desde ese clic.
(function () {
  const box = document.getElementById('music-player');
  const toggle = document.getElementById('music-toggle');
  const videoId = typeof CONFIG !== 'undefined' && CONFIG.musicYouTubeId;
  if (!box || !toggle || !videoId) return;

  let player = null;
  let ready = false;
  let wanted = false; // se pidió música antes de que el reproductor estuviera listo
  let playing = false;

  function renderToggle() {
    toggle.textContent = playing ? '🔊' : '🔇';
    toggle.setAttribute('aria-label', playing ? 'Pausar la música' : 'Reproducir la música');
  }

  // La API de YouTube llama a esta función global cuando termina de cargar
  window.onYouTubeIframeAPIReady = function () {
    player = new YT.Player('music-player', {
      videoId: videoId,
      width: '100%',
      height: '100%',
      playerVars: { playsinline: 1, rel: 0 },
      events: {
        onReady: function () {
          ready = true;
          if (wanted) player.playVideo();
        },
        onStateChange: function (e) {
          playing = e.data === YT.PlayerState.PLAYING;
          renderToggle();
        }
      }
    });
  };

  const api = document.createElement('script');
  api.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(api);

  window.startMusic = function () {
    wanted = true;
    toggle.hidden = false;
    if (ready) player.playVideo();
  };

  toggle.addEventListener('click', () => {
    if (!ready) return;
    if (playing) player.pauseVideo();
    else player.playVideo();
  });

  renderToggle();
})();
