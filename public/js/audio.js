const audioPlayer = document.querySelector('.audio-player');
const audio = audioPlayer.querySelector('audio');
const playBtn = audioPlayer.querySelector('.play-btn');
const progressBar = audioPlayer.querySelector('.progress-bar');
const progress = audioPlayer.querySelector('.progress');

function togglePlay() {
    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
}

function updateProgressBar() {
  const progressPercent = (audio.currentTime / audio.duration) * 100;
  progress.style.width = `${progressPercent}%`;
}

audio.addEventListener('play', () => {
    playBtn.innerHTML = `<i class="fa-solid fa-circle-pause fa-2xl"></i>`;
//   playBtn.classList.add('playing');
});

audio.addEventListener('pause', () => {
    playBtn.innerHTML = `<i class="fa-solid fa-circle-play fa-2xl"></i>`;
// playBtn.classList.remove('playing');
});

audio.addEventListener('ended', () => {
    audio.src = "/static/music/0001.mp3";
})

audio.addEventListener('timeupdate', updateProgressBar);

playBtn.addEventListener('click', togglePlay);
progressBar.addEventListener('click', (e) => {
  const progressWidth = progressBar.offsetWidth;
  const clickX = e.offsetX;
  const percent = (clickX / progressWidth);
  audio.currentTime = audio.duration * percent;
});
