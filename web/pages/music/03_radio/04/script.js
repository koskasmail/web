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
  const btnModalExport = document.getElementById("btn-modal-export");
  const btnModalSave = document.getElementById("btn-modal-save");

  // ==========================================
  // INDEXEDDB (Permanent Offline Storage)
  // ==========================================
  const DB_NAME = "RadioStationsDB";
  const DB_VERSION = 1;
  const STORE_NAME = "stations_store";

  function openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "id" });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async function saveStationsToDB(stationsData) {
    try {
      const db = await openDB();
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);

      await new Promise((resolve, reject) => {
        const clearReq = store.clear();
        clearReq.onsuccess = resolve;
        clearReq.onerror = reject;
      });

      for (const st of stationsData) {
        store.put(st);
      }

      return tx.complete;
    } catch (err) {
      console.error("Error saving to IndexedDB:", err);
    }
  }

  async function loadStationsFromDB() {
    try {
      const db = await openDB();
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);

      return new Promise((resolve) => {
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => resolve([]);
      });
    } catch (err) {
      console.error("Error reading from IndexedDB:", err);
      return [];
    }
  }

  // ==========================================
  // INITIALIZATION & DATA LOADING
  // ==========================================
  async function loadStations() {
    // 1. Load permanently stored offline stations from IndexedDB
    const dbStations = await loadStationsFromDB();

    if (dbStations && dbStations.length > 0) {
      stations = dbStations;
      initRadio();
      return;
    }

    // 2. Fallback to stations.json file if IndexedDB is empty
    try {
      const response = await fetch("stations.json");
      stations = await response.json();
      await saveStationsToDB(stations);
      initRadio();
    } catch (err) {
      console.error("Failed to load stations.json", err);
    }
  }

  function initRadio() {
    renderPresets();
    selectStation(0);
  }

  // ==========================================
  // UI & PRESETS RENDER
  // ==========================================
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

  function selectStation(index) {
    if (index < 0 || index >= stations.length) return;
    currentStationIndex = index;
    const st = stations[currentStationIndex];

    displayFreq.innerHTML = `${parseFloat(st.freq).toFixed(2)} <span class="unit">MHz</span>`;
    displayName.textContent = st.name;
    displayDesc.textContent = st.description;

    freqSlider.value = st.freq;
    updateNeedlePosition(st.freq);

    const buttons = presetsGrid.querySelectorAll(".preset-btn");
    buttons.forEach((btn, i) => {
      btn.classList.toggle("active", i === index);
    });

    audioPlayer.src = st.url;
    if (isPlaying) {
      audioPlayer.play().catch((e) => console.log("Playback error:", e));
    }
  }

  function updateNeedlePosition(freqValue) {
    const min = parseFloat(freqSlider.min);
    const max = parseFloat(freqSlider.max);
    const percent = ((freqValue - min) / (max - min)) * 100;
    tunerNeedle.style.left = `${percent}%`;
  }

  // ==========================================
  // AUDIO & VISUALIZER
  // ==========================================
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

  function setupAudioContext() {
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioCtx.createAnalyser();
      const source = audioCtx.createMediaElementSource(audioPlayer);
      source.connect(analyser);
      analyser.connect(audioCtx.destination);
      analyser.fftSize = 64;
      drawVisualizer();
    } catch (e) {
      console.warn("CORS/AudioContext restriction: Visualizer bypassed.", e);
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

  function tuneStep(direction) {
    let newIndex = currentStationIndex + direction;
    if (newIndex < 0) newIndex = stations.length - 1;
    if (newIndex >= stations.length) newIndex = 0;
    selectStation(newIndex);
  }

  // ==========================================
  // EXPORT FILE DOWNLOAD UTILITY
  // ==========================================
  function exportJSONFile(data, filename = "stations.json") {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // ==========================================
  // EVENT LISTENERS & MODAL HANDLERS
  // ==========================================
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

    const matchedIndex = stations.findIndex((s) => Math.abs(parseFloat(s.freq) - val) < 0.2);
    if (matchedIndex !== -1 && matchedIndex !== currentStationIndex) {
      selectStation(matchedIndex);
    }
  });

  // Open Modal
  btnSettings.addEventListener("click", () => {
    jsonEditor.value = JSON.stringify(stations, null, 2);
    jsonModal.classList.add("active");
  });

  // Close Modal
  btnModalCancel.addEventListener("click", () => {
    jsonModal.classList.remove("active");
  });

  // Export Button Handler
  btnModalExport.addEventListener("click", () => {
    try {
      const parsed = JSON.parse(jsonEditor.value);
      if (Array.isArray(parsed)) {
        exportJSONFile(parsed, "stations.json");
      } else {
        alert("JSON must be an array of station objects.");
      }
    } catch (err) {
      alert("Invalid JSON structure. Please check formatting before exporting.");
    }
  });

  // Save Button Handler (Offline Save to IndexedDB)
  btnModalSave.addEventListener("click", async () => {
    try {
      const parsed = JSON.parse(jsonEditor.value);
      if (Array.isArray(parsed)) {
        stations = parsed;

        // Save permanently to IndexedDB (Offline storage)
        await saveStationsToDB(stations);

        // Update UI presets and current station
        renderPresets();
        selectStation(0);

        jsonModal.classList.remove("active");
      } else {
        alert("JSON must be an array of station objects.");
      }
    } catch (err) {
      alert("Invalid JSON structure. Please check formatting.");
    }
  });

  // Start app
  loadStations();
});