import { data } from "./data.js";
import { changeDuration, shuffle } from "./hooks.js";
const AudioController = {
  state: {
    audios: [],
    current: {},
    playing: false,
    repeating: false,
    volume: 0.5,
  },
  init() {
    this.initVaribls();
    this.renderAudios();
    this.initEvents();
  },
  initVaribls() {
    this.playButton = null;
    this.audioList = document.querySelector(".all-song");
    this.currentAudio = document.querySelector(".current-play-player");
    this.repeatButton = document.querySelector(".bi-repeat");
    this.valueInput = document.querySelector(".input-value");
    this.shuffleButton = document.querySelector(".bi-shuffle");
    this.volumeButton = document.querySelector(".bi-volume-down");
  },
  initEvents() {
    this.audioList.addEventListener("click", this.handleItem.bind(this));
    this.repeatButton.addEventListener("click", this.handleRepeat.bind(this));
    this.shuffleButton.addEventListener("click", this.handleShuffle.bind(this));
    this.valueInput.addEventListener("change", this.handleVolume.bind(this));
    this.volumeButton.addEventListener("click", () => {
      const input = document.querySelector(".input-value");
      input.classList.toggle("none");
    });
  },
  handleShuffle() {
    const { children } = this.audioList;
    const suffled = shuffle([...children]);
    this.audioList.innerHTML = "";
    suffled.forEach((item) => this.audioList.appendChild(item));
  },
  handleVolume({ target: { value } }) {
    const { current } = this.state;
    this.state.volume = value;
    if (!current?.audio) return;
    current.audio.volume = value;
  },
  handleRepeat({ currentTarget }) {
    const { repeating } = this.state;
    currentTarget.classList.toggle("on", !repeating);
    this.state.repeating = !repeating;
  },
  handleItem({ target }) {
    const element = target.closest("[data-id]");
    if (element) {
      this.currentAudio.innerHTML = "";
      const { id } = element.dataset;
      if (!id) return;
      this.setCurrentItem(id);
    }
  },
  audioUpdateHandler({ audio, duration }) {
    const progress = document.querySelector(".progress-line");
    const timeLine = document.querySelector(
      ".audio_page_player_time_track_text"
    );
    audio.addEventListener("timeupdate", ({ target }) => {
      const { currentTime } = target;
      const width = (currentTime * 100) / duration;
      timeLine.innerHTML = changeDuration(currentTime);
      progress.style.width = `${width}%`;
    });
    audio.addEventListener("ended", ({ target }) => {
      target.currentTime = 0;
      progress.style.width = `0%`;
      this.state.repeating ? target.play() : this.handleAudioNext();
    });
  },
  handlePlayer() {
    const play = document.querySelector(".controls-play");
    const prev = document.querySelector(".prev");
    const next = document.querySelector(".next");
    play.addEventListener("click", this.handleAudioPlay.bind(this));
    prev.addEventListener("click", this.handleAudioPrev.bind(this));
    next.addEventListener("click", this.handleAudioNext.bind(this));
    this.playButton = play;
  },

  handleAudioPlay() {
    const { playing, current } = this.state;
    const { audio } = current;
    !playing ? audio.play() : audio.pause();
    this.state.playing = !playing;
    this.playButton.classList.toggle("playing", !playing);
  },
  handleAudioPrev() {
    const { current } = this.state;
    const currentItem = document.querySelector(`[data-id="${current.id}"]`);
    const prev = currentItem.previousSibling.previousSibling?.dataset;
    const last = this.audioList.lastChild.dataset;
    const itemId = prev?.id || last?.id;
    if (!itemId) return;
    this.setCurrentItem(itemId);
  },
  handleAudioNext() {
    const { current } = this.state;
    const currentItem = document.querySelector(`[data-id="${current.id}"]`);
    const next = currentItem.nextSibling?.nextSibling?.dataset;
    const first = this.audioList.firstChild.nextSibling.dataset;
    const itemId = next?.id || first?.id;
    if (!itemId) return;
    this.setCurrentItem(itemId);
  },
  renderCurrrentItem({ track, group, duration, song, year }) {
    if (!duration) {
      duration = "203.22";
    }
    const [img] = song.split(".");
    return `
            <div class="current-img">
              <img class="main-img" src="/img/${img}.jpeg" alt="" />
            </div>
            <div class="current-desc-music">
              <div class="current-gruap">
                <p class="audio_page_perfo_text">${group}</p>
                <p class="audio_page_perfo_text">${year}</p>
              </div>
              <div class="current-music-name">
                <h2>${track}</h2>
              </div>
              <div class="current-music-button">
                <button class="button button-item prev">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    fill="currentColor"
                    class="bi bi-arrow-left-circle"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"
                    />
                  </svg>
                </button>

                <button class="button button-item controls-play">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    fill="currentColor"
                    class="bi bi-play-circle active"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
                    />
                    <path
                      d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445z"
                    />
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    fill="currentColor"
                    class="bi bi-pause-circle none"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
                    />
                    <path
                      d="M5 6.25a1.25 1.25 0 1 1 2.5 0v3.5a1.25 1.25 0 1 1-2.5 0v-3.5zm3.5 0a1.25 1.25 0 1 1 2.5 0v3.5a1.25 1.25 0 1 1-2.5 0v-3.5z"
                    />
                  </svg>
                </button>
                <button class="button button-item next">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    fill="currentColor"
                    class="bi bi-arrow-right-circle"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"
                    />
                  </svg>
                </button>
              </div>
              <div class="current-music-progress">
                <div class="progress-line"></div>
              </div>
              <div class="current-music-duration">
                <p class="audio_page_player_time_track_text">00:00</p>
                <p class="audio_page_player_time_track_text">${changeDuration(
                  duration
                )}</p>
              </div>
            </div>
         `;
  },
  pauseCurrent() {
    const {
      current: { audio },
    } = this.state;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
  },
  togglePlaying() {
    const { current, playing } = this.state;
    const { audio } = current;
    playing ? audio.play() : audio.pause();
    this.playButton.classList.toggle("playing", playing);
  },
  setCurrentItem(itemId) {
    const item = this.state.audios.find(({ id }) => +id === +itemId);
    if (!item) return;
    this.pauseCurrent();
    this.state.current = item;
    this.currentAudio.innerHTML = this.renderCurrrentItem(item);
    item.audio.volume = this.state.volume;
    this.handlePlayer();
    this.audioUpdateHandler(item);
    setTimeout(this.togglePlaying(), 10);
  },
  loadItem({ id, genre, track, group, duration, song }) {
    const [img] = song.split(".");
    if (!img) return;
    return ` <div class="item" data-id="${id}">
 <img src="./img/${img}.jpeg" alt="" />
 <div class="item-desc">
   <div class="item-name">
     <p class="item-gruap"${group}</p>
     <p class="item-name">${track}</p>
   </div>
   <div class="item-duration">
     <p>${changeDuration(duration)}</p>
   </div>
   <div class="item-genre">
     <p>${genre}</p>
   </div>
   <button class="button button-item controls-playtwo">
   <svg
     xmlns="http://www.w3.org/2000/svg"
     width="30"
     height="30"
     fill="currentColor"
     class="bi bi-play-circle active"
     viewBox="0 0 16 16"
   >
     <path
       d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
     />
     <path
       d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445z"
     />
   </svg>
   <svg
     xmlns="http://www.w3.org/2000/svg"
     width="30"
     height="30"
     fill="currentColor"
     class="bi bi-pause-circle none"
     viewBox="0 0 16 16"
   >
     <path
       d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
     />
     <path
       d="M5 6.25a1.25 1.25 0 1 1 2.5 0v3.5a1.25 1.25 0 1 1-2.5 0v-3.5zm3.5 0a1.25 1.25 0 1 1 2.5 0v3.5a1.25 1.25 0 1 1-2.5 0v-3.5z"
     />
   </svg>
 </button>
 </div>
</div>`;
  },
  loadAudioData(newItem) {
    this.audioList.innerHTML += this.loadItem(newItem);
  },
  renderAudios() {
    data.forEach((item) => {
      const audio = new Audio(`./Songs/Barns Courtney - ${item.song}`);
      audio.addEventListener("loadeddata", () => {
        const newItem = { ...item, duration: audio.duration, audio: audio };
        this.state.audios = [...this.state.audios, newItem];
        this.loadAudioData(newItem);
      });
    });

    this.currentAudio.innerHTML = this.renderCurrrentItem(data[0]);
  },
};
AudioController.init();
