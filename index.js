// modo escuro 
const toggleModeButton = document.getElementById('toggle-mode');
toggleModeButton.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDarkMode = document.body.classList.contains('dark-mode');
  toggleModeButton.innerHTML = isDarkMode
    ? '<i class="fas fa-sun"></i>'
    : '<i class="fas fa-moon"></i>';
});

// Tocar música aleatória
const shuffleButton = document.getElementById('shuffle-btn');
const audioElements = document.querySelectorAll('audio');
const nowPlaying = document.getElementById('now-playing');
const globalPauseBtn = document.getElementById('global-pause-btn');
const globalProgress = document.getElementById('global-progress');

let currentAudio = null;

shuffleButton.addEventListener('click', () => {
  const randomIndex = Math.floor(Math.random() * audioElements.length);
  const randomAudio = audioElements[randomIndex];

  if (currentAudio && currentAudio !== randomAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  randomAudio.play();
  nowPlaying.textContent = `🎵 Tocando: ${randomAudio.dataset.title || 'Desconhecida'}`;
  currentAudio = randomAudio;
});

// Atualizar texto ao tocar qualquer música
audioElements.forEach(audio => {
  audio.addEventListener('play', () => {
    // Pausar todas as outras músicas
    audioElements.forEach(a => {
      if (a !== audio) {
        a.pause();
        a.currentTime = 0;
      }
    });

    const title = audio.dataset.title || 'Desconhecida';
    nowPlaying.textContent = `🎵 Tocando: ${title}`;
    globalPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    currentAudio = audio;
  });

  // Atualizar progresso
  audio.addEventListener('timeupdate', () => {
    if (audio === currentAudio && audio.duration) {
      const progress = (audio.currentTime / audio.duration) * 100;
      globalProgress.value = progress;
    }
  });

  // Resetar global player se a música acabar
  audio.addEventListener('ended', () => {
    nowPlaying.textContent = '🎵 Nenhuma música tocando...';
    globalPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    globalProgress.value = 0;
    currentAudio = null;
  });
});

// Controle global de play/pause
globalPauseBtn.addEventListener('click', () => {
  if (!currentAudio) return;

  if (currentAudio.paused) {
    currentAudio.play();
    globalPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
  } else {
    currentAudio.pause();
    globalPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
  }
});

// Permitir avançar pela barra de progresso
globalProgress.addEventListener('input', () => {
  if (currentAudio && currentAudio.duration) {
    currentAudio.currentTime = (globalProgress.value / 100) * currentAudio.duration;
  }
});
