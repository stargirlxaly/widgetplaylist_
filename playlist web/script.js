const covers = [
  "./pics/nj.JPG",
  "./pics/Magnetic.jpeg",
  "./pics/Ditto.jpeg",
  "./pics/Rewind.jpeg"
];

const titles = [
  "ASAP by NewJeans",
  "Magnetic by ILLIT",
  "Ditto by NewJeans",
  "Rewind by Wonder girls"
];

const tracks = [
  document.getElementById("ASAP"),
  document.getElementById("Magnetic"),
  document.getElementById("Ditto"),
  document.getElementById("Rewind")
];

let currentTrackIndex = 0;

const playBtn = document.querySelector(".play button");
const playImg = playBtn.querySelector("img");
const nextBtn = document.querySelector(".bt3 button");
const prevBtn = document.querySelector(".bt1 button");

const currentTimeEl = document.getElementById("current");
const remainingTimeEl = document.getElementById("remain");

const albumImg = document.querySelector(".pic img");
const titleEl = document.querySelector(".Name p");

let isPlaying = false;

function currentTrack() {
  return tracks[currentTrackIndex];
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}

function updateTimeUI(track) {
  const current = track.currentTime || 0;
  const duration = track.duration;

  currentTimeEl.textContent = formatTime(current);

  if (!Number.isFinite(duration) || duration <= 0) {
    remainingTimeEl.textContent = "-0:00";
    return;
  }

  remainingTimeEl.textContent = "-" + formatTime(duration - current);
}

function setPlayIcon(playing) {
  if (playing) {
    playImg.src = "./pics/pause.png";
    playImg.alt = "pause";
  } else {
    playImg.src = "./pics/play.png";
    playImg.alt = "play";
  }
}

function stopAllTracks() {
  tracks.forEach(t => {
    t.pause();
    t.currentTime = 0;
  });
}

function updateCoverAndTitle() {
  if (albumImg) {
    albumImg.classList.add("fade");
    setTimeout(() => {
      albumImg.src = covers[currentTrackIndex];
      albumImg.classList.remove("fade");
    }, 200);
  }
  if (titleEl) titleEl.textContent = titles[currentTrackIndex];
}

function playCurrent() {
  const track = currentTrack();
  stopAllTracks();
  updateCoverAndTitle();
  track.play();
  isPlaying = true;
  setPlayIcon(true);
  updateTimeUI(track);
}

function pauseCurrent() {
  const track = currentTrack();
  track.pause();
  isPlaying = false;
  setPlayIcon(false);
  updateTimeUI(track);
}

function goNext(autoPlay = true) {
  currentTrack().pause();
  currentTrack().currentTime = 0;
  currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
  if (autoPlay) playCurrent();
  else {
    stopAllTracks();
    updateCoverAndTitle();
    isPlaying = false;
    setPlayIcon(false);
    updateTimeUI(currentTrack());
  }
}

function goPrev(autoPlay = true) {
  currentTrack().pause();
  currentTrack().currentTime = 0;
  currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
  if (autoPlay) playCurrent();
  else {
    stopAllTracks();
    updateCoverAndTitle();
    isPlaying = false;
    setPlayIcon(false);
    updateTimeUI(currentTrack());
  }
}

playBtn.addEventListener("click", () => {
  if (isPlaying) pauseCurrent();
  else playCurrent();
});

nextBtn.addEventListener("click", () => goNext(true));
prevBtn.addEventListener("click", () => goPrev(true));

tracks.forEach(track => {
  track.addEventListener("timeupdate", () => {
    if (track !== currentTrack()) return;
    updateTimeUI(track);
  });

  track.addEventListener("ended", () => {
    if (track !== currentTrack()) return;
    goNext(true);
  });

  track.addEventListener("loadedmetadata", () => {
    if (track !== currentTrack()) return;
    updateTimeUI(track);
  });
});

updateCoverAndTitle();
setPlayIcon(false);
updateTimeUI(currentTrack());
