document.addEventListener("DOMContentLoaded", () => {
  // Application State
  let stations = [];
  let currentStationIndex = 0;
  let isPlaying = false;
  let audioCtx = null;
  let analyser = null;

  // DOM Elements
  const audioPlayer = document.getElementById("audio-player");
  const freqSlider = document.getElementById("freq-slider");
  const tunerNeedle = document.getElementById("tuner-needle");
  const displayFreq = document.getElementById("display-frequency");
  const displayName = document.getElementById("display-name");
  const displayDesc = document.getElementById("display-desc");
  const presetsGrid = document.getElementById("presets-grid");
  const btnPlay = document.getElementById("btn-play");
  const playIcon = document.getElementById("play-icon");
  const playText = document.getElementById("play-text");
  const btnPrevFreq = document.getElementById("btn-prev-freq");
  const btnNextFreq = document.getElementById("btn-next-freq");
  const btnSeek = document.getElementById("btn-seek");
  const volumeSlider = document.getElementById("volume-slider");
  const canvas = document.getElementById("audio-visualizer");
  const canvasCtx = canvas.getContext("2d");

  // JSON Modal Elements
  const btnSettings = document.getElementById("btn-settings");
  const jsonModal = document.getElementById("json-modal");
  const jsonEditor = document.getElementById("json-editor");
  const btnModalCancel = document.getElementById("btn-modal-cancel");
  const btnModalSave = document.getElementById("btn-modal-save");

  // Fetch JSON Stations
  async function loadStations() {
    try {
      const response = await fetch("stations.json");
      stations = await response.json();
      initRadio();
    } catch (err) {
      console.error("Failed to load stations.json", err);
    }
  }

  // Initialize Radio Component
  function initRadio() {
    renderPresets();
    selectStation(0);
  }

  // Render Preset Buttons Grid (1-6)
  function renderPresets() {
    presetsGrid.innerHTML = "";
    stations.forEach((st, idx) => {
      const btn = document.createElement("button");
      btn.className = `preset-btn ${idx === currentStationIndex ? "active" : ""}`;
      btn.innerHTML = `
        <span class="num">${idx + 1}</span>
        <span class="freq">${st.freq}</span>
        <span class="name">${st.name}</span>
      `;
      btn.addEventListener("click", () => selectStation(idx));
      presetsGrid.appendChild(btn);
    });
  }

  // Select a Station by Index
  function selectStation(index) {
    if (index < 0 || index >= stations.length) return;
    currentStationIndex = index;
    const st = stations[currentStationIndex];

    // Update Display Info
    displayFreq.innerHTML = `${parseFloat(st.freq).toFixed(2)} <span class="unit">MHz</span>`;
    displayName.textContent = st.name;
    displayDesc.textContent = st.description;

    // Sync Slider & Needle
    freqSlider.value = st.freq;
    updateNeedlePosition(st.freq);

    // Sync Presets Selection
    const buttons = presetsGrid.querySelectorAll(".preset-btn");
    buttons.forEach((btn, i) => {
      btn.classList.toggle("active", i === index);
    });

    // Change Audio Stream Source
    audioPlayer.src = st.url;
    if (isPlaying) {
      audioPlayer.play().catch((e) => console.log("Playback error:", e));
    }
  }

  // Update Need Position visually
  function updateNeedlePosition(freqValue) {
    const min = parseFloat(freqSlider.min);
    const max = parseFloat(freqSlider.max);
    const percent = ((freqValue - min) / (max - min)) * 100;
    tunerNeedle.style.left = `${percent}%`;
  }

  // Audio Playback Toggle
  function togglePlay() {
    if (!audioCtx) setupAudioContext();

    if (isPlaying) {
      audioPlayer.pause();
      isPlaying = false;
      playIcon.className = "fa-solid fa-play";
      playText.textContent = "PLAY";
    } else {
      audioPlayer.play().then(() => {
        isPlaying = true;
        playIcon.className = "fa-solid fa-pause";
        playText.textContent = "PAUSE";
      }).catch((err) => {
        console.error("Playback interrupted", err);
      });
    }
  }

  // Web Audio Visualizer Setup
  function setupAudioContext() {
    if (audioCtx) return;

    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioCtx.createAnalyser();

      const source = audioCtx.createMediaElementSource(audioPlayer);
      source.connect(analyser);
      analyser.connect(audioCtx.destination);
      analyser.fftSize = 64;

      drawVisualizer();
    } catch (err) {
      console.warn("CORS restricted stream: Web Audio visualizer disabled.", err);
      // Draw an animated dummy visualizer if real frequency data is blocked
      drawFallbackVisualizer();
    }
  }

  function drawFallbackVisualizer() {
    requestAnimationFrame(drawFallbackVisualizer);
    if (!isPlaying) {
      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    const bars = 16;
    const barWidth = canvas.width / bars;

    for (let i = 0; i < bars; i++) {
      // Generate simulated bounce heights
      const barHeight = Math.random() * (canvas.height * 0.8) + 5;
      canvasCtx.fillStyle = `rgb(0, 200, 255)`;
      canvasCtx.fillRect(i * barWidth, canvas.height - barHeight, barWidth - 2, barHeight);
    }
  }

  function drawVisualizer() {
    requestAnimationFrame(drawVisualizer);
    if (!analyser) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    const barWidth = (canvas.width / bufferLength) * 2.5;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const barHeight = (dataArray[i] / 255) * canvas.height;
      canvasCtx.fillStyle = `rgb(0, ${Math.min(255, barHeight * 4 + 100)}, 255)`;
      canvasCtx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight);
      x += barWidth;
    }
  }

  // Frequency Navigation & Seeking
  function tuneStep(direction) {
    let newIndex = currentStationIndex + direction;
    if (newIndex < 0) newIndex = stations.length - 1;
    if (newIndex >= stations.length) newIndex = 0;
    selectStation(newIndex);
  }

  // Event Listeners
  btnPlay.addEventListener("click", togglePlay);
  btnPrevFreq.addEventListener("click", () => tuneStep(-1));
  btnNextFreq.addEventListener("click", () => tuneStep(1));
  btnSeek.addEventListener("click", () => tuneStep(1));

  volumeSlider.addEventListener("input", (e) => {
    audioPlayer.volume = e.target.value;
  });

  freqSlider.addEventListener("input", (e) => {
    const val = parseFloat(e.target.value);
    updateNeedlePosition(val);
    displayFreq.innerHTML = `${val.toFixed(2)} <span class="unit">MHz</span>`;

    // Snap to station if matching frequency
    const matchedIndex = stations.findIndex((s) => Math.abs(parseFloat(s.freq) - val) < 0.2);
    if (matchedIndex !== -1 && matchedIndex !== currentStationIndex) {
      selectStation(matchedIndex);
    }
  });

  // Modal JSON Handlers
  btnSettings.addEventListener("click", () => {
    jsonEditor.value = JSON.stringify(stations, null, 2);
    jsonModal.classList.add("active");
  });

  btnModalCancel.addEventListener("click", () => {
    jsonModal.classList.remove("active");
  });

  btnModalSave.addEventListener("click", () => {
    try {
      const parsed = JSON.parse(jsonEditor.value);
      if (Array.isArray(parsed)) {
        stations = parsed;
        renderPresets();
        selectStation(0);
        jsonModal.classList.remove("active");
      }
    } catch (err) {
      alert("Invalid JSON structure. Please verify formatting.");
    }
  });

  // Load initial station data
  loadStations();
});