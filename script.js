const audio = document.getElementById('audio-player');
const btnPlay = document.getElementById('btn-play');
const fileInput = document.getElementById('file-input');
const songTitle = document.getElementById('song-title');
const progressBar = document.getElementById('progress-bar');
const progressContainer = document.getElementById('progress-container');
const btnInstalar = document.getElementById('btnInstalar');

// Carregar música escolhida pelo usuário
fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const audioUrl = URL.createObjectURL(file);
    audio.src = audioUrl;
    songTitle.textContent = file.name.replace(/\.[^/.]+$/, "");
    playAudio();
  }
});

// Tocar/Pausar música
function playAudio() {
  if (!audio.src) return;
  audio.play();
  btnPlay.textContent = '⏸️ Pausar';
}

function pauseAudio() {
  audio.pause();
  btnPlay.textContent = '▶️ Play';
}

btnPlay.addEventListener('click', () => {
  if (audio.paused && audio.src) {
    playAudio();
  } else {
    pauseAudio();
  }
});

// Atualizar a barra de progresso conforme a música toca
audio.addEventListener('timeupdate', () => {
  if (audio.duration) {
    const progressPercent = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = `${progressPercent}%`;
  }
});

// Clicar na barra de progresso para adiantar/voltar a música
progressContainer.addEventListener('click', (e) => {
  const width = progressContainer.clientWidth;
  const clickX = e.offsetX;
  if (audio.duration) {
    audio.currentTime = (clickX / width) * audio.duration;
  }
});

// --- Lógica do Service Worker e Instalação PWA ---
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js')
    .then(() => console.log('Service Worker do Player registrado!'))
    .catch((err) => console.error('Erro no Service Worker:', err));
}

let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  btnInstalar.style.display = 'block';
});

btnInstalar.addEventListener('click', async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;
    if (choiceResult.outcome === 'accepted') {
      btnInstalar.style.display = 'none';
    }
    deferredPrompt = null;
  }
});