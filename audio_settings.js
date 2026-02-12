const audio = document.getElementById('audio');
const video = document.getElementById('visualizer');

const playBtn = document.getElementById('manage');
const icons = playBtn.children;
const audio_time = document.getElementById('сurrent__time');
const audio_duration = document.getElementById('duration__time');

const timeBar = document.querySelector('.progress-time');
const timeСurrent = timeBar.querySelector('.current__progress');
const timeThumb = timeBar.querySelector('.thumb');

const volumeBar = document.querySelector('.progress-volume');
const volumeCurrent = volumeBar.querySelector('.current__progress');
const volumeThumb = volumeBar.querySelector('.thumb');
const mutebtn = document.getElementById('mute');
const repeatbtn = document.getElementById('repeat');

function fmt(sec) {
  if (!isFinite(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

// play / pause
playBtn.addEventListener('click', async () => {
  if (audio.paused) {
    try { 
      await audio.play();
      video.play();            // ← ДОБАВИЛИ
    } catch (e) { 
      console.log('play blocked', e); 
    }
  } else {
    audio.pause();
    video.pause();             // ← ДОБАВИЛИ
  }

  icons[0].hidden = !icons[0].hidden;
  icons[1].hidden = !icons[1].hidden;
});


// обновляем длительность когда метаданные загрузились
audio.addEventListener('loadedmetadata', () => {
  audio_time.textContent = `0:00`;
  audio_duration.textContent = `${fmt(audio.duration)}`;
});

audio.addEventListener('timeupdate', () => {
  audio_time.textContent = `${fmt(audio.currentTime)}`;
  audio_duration.textContent = `${fmt(audio.duration)}`;

  const diff = Math.abs(video.currentTime - audio.currentTime);
  if (diff > 0.2) {
    video.currentTime = audio.currentTime;
  }
});


audio.addEventListener('ended', () => {
  if (!repeatbtn.classList.contains('active')) {
    icons[0].hidden = !icons[0].hidden;
    icons[1].hidden = !icons[1].hidden;
  }
});



// логика плеера кастомного
let isTimeDragging = false;
let isVolumeDragging = false;

// Обновление во время проигрывания
audio.addEventListener('timeupdate', () => {
  if (isTimeDragging) return;

  const percent = (audio.currentTime / audio.duration) * 100;
  timeСurrent.style.width = percent + '%';
  timeThumb.style.left = percent + '%';
});


// Для контроля времени аудио
function updateTimeProgress(clientX) {
  const rect = timeBar.getBoundingClientRect();
  let percent = (clientX - rect.left) / rect.width;
  percent = Math.max(0, Math.min(percent, 1));

  audio.currentTime = percent * audio.duration;
  video.currentTime = percent * audio.duration;

  timeСurrent.style.width = percent * 100 + '%';
  timeThumb.style.left = percent * 100 + '%';
}

// Для контроля звука аудио
function updateVolumeProgress(clientX) {
  const rect = volumeBar.getBoundingClientRect();
  let percent = (clientX - rect.left) / rect.width;
  percent = Math.max(0, Math.min(percent, 1));

  audio.volume = percent;

  volumeCurrent.style.width = percent * 100 + '%';
  volumeThumb.style.left = percent * 100 + '%';
}

function attachDrag(bar, updateFn) {
  let dragging = false;

  function getClientX(e) {
    if (e.touches && e.touches.length > 0) {
      return e.touches[0].clientX;
    }
    return e.clientX;
  }

  // Клик
  bar.addEventListener('click', (e) => {
    updateFn(getClientX(e));
  });

  // Мышь
  bar.addEventListener('mousedown', (e) => {
    dragging = true;
    updateFn(getClientX(e));
  });

  document.addEventListener('mousemove', (e) => {
    if (dragging) updateFn(getClientX(e));
  });

  document.addEventListener('mouseup', () => {
    dragging = false;
  });

  // Тач
  bar.addEventListener('touchstart', (e) => {
    dragging = true;
    updateFn(getClientX(e));
  });

  document.addEventListener('touchmove', (e) => {
    if (dragging) updateFn(getClientX(e));
  });

  document.addEventListener('touchend', () => {
    dragging = false;
  });
}

function setVolumeUI(percent) {
  volumeCurrent.style.width = percent + '%';
  volumeThumb.style.left = percent + '%';
}

document.addEventListener('DOMContentLoaded', () => {
  // --- НАСТРОЙКИ ПО УМОЛЧАНИЮ ---

  const startVolume = 0.8;
  const startRepeat = true; // или true, если хочешь по умолчанию

  // --- ПРИМЕНЯЕМ ---

  audio.volume = startVolume;
  audio.loop = startRepeat;
  video.loop = startRepeat;

  setVolumeUI(startVolume * 100);
  repeatbtn.classList.toggle('active', startRepeat);
});

mutebtn.addEventListener('click', () => {
  audio.muted = !audio.muted; // переключаем true/false

  mutebtn.classList.toggle('active', audio.muted);
});

repeatbtn.addEventListener('click', () => {
  audio.loop = !audio.loop;
  video.loop = !video.loop;

  repeatbtn.classList.toggle('active', audio.loop);
});


attachDrag(timeBar, updateTimeProgress);
attachDrag(volumeBar, updateVolumeProgress);


// это js для media запросов (для разных экранов)
document.addEventListener('DOMContentLoaded', () => {

  const volume = document.getElementById("volume")
  const container = document.getElementById('audio__player_container');
  const player = document.getElementById('audio__player');

  const mq = window.matchMedia('(max-width: 480px)');

  function moveVolume(e) {
    if (e.matches) {
      container.appendChild(volume);
    } else {
      player.appendChild(volume);
    }
  }

  mq.addEventListener('change', moveVolume);
  moveVolume(mq); // первый запуск при загрузке
});
