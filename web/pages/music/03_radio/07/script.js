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
  const btnRandom = document.getElementById("btn-random");
  const volumeSlider = document.getElementById("volume-slider");
  const canvas = document.getElementById("audio-visualizer");
  const canvasCtx = canvas.getContext("2d");

  // JSON Modal Elements
  const btnSettings = document.getElementById("btn-settings");
  const jsonModal = document.getElementById("json-modal");
  const jsonEditor = document.getElementById("json-editor");
  const btnModalCancel = document.getElementById("btn-modal-cancel");
  const btnModalImport = document.getElementById("btn-modal-import");
  const btnModalExport = document.getElementById("btn-modal-export");
  const btnModalSave = document.getElementById("btn-modal-save");
  const fileImportInput = document.getElementById("file-import-input");

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
    const dbStations = await loadStationsFromDB();

    if (dbStations && dbStations.length > 0) {
      stations = dbStations;
      initRadio();
      return;
    }

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

  function selectRandomStation() {
    if (stations.length <= 1) return;

    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * stations.length);
    } while (randomIndex === currentStationIndex);

    selectStation(randomIndex);
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
  // EXPORT / IMPORT FILE UTILITIES
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

  function handleImportChoice() {
    const choice = prompt(
      "Choose Import Source:\n1. Type '1' or click OK to select a Local JSON File\n2. Type a URL (e.g. http://192.168.1.50/stations.json or https://example.com/stations.json) to fetch remotely"
    );

    if (!choice) return;

    const trimmed = choice.trim();

    // Check if user entered a URL (starts with http://, https://, or file path)
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      fetch(trimmed)
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP error ${res.status}`);
          return res.json();
        })
        .then((data) => {
          if (Array.isArray(data)) {
            jsonEditor.value = JSON.stringify(data, null, 2);
            alert("JSON successfully imported from network URL!");
          } else {
            alert("Loaded content is not a valid station list array.");
          }
        })
        .catch((err) => {
          alert("Failed to fetch JSON from URL: " + err.message);
        });
    } else {
      // Trigger file selector for local JSON file
      fileImportInput.click();
    }
  }

  // File Picker Change Event
  fileImportInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target.result);
        if (Array.isArray(parsed)) {
          jsonEditor.value = JSON.stringify(parsed, null, 2);
          alert("Local JSON file imported successfully into editor!");
        } else {
          alert("Selected file does not contain a valid JSON array.");
        }
      } catch (err) {
        alert("Error parsing local JSON file.");
      }
    };
    reader.readAsText(file);
    // Reset value so the same file can be re-selected if needed
    fileImportInput.value = "";
  });

  // ==========================================
  // EVENT LISTENERS & MODAL HANDLERS
  // ==========================================
  btnPlay.addEventListener("click", togglePlay);
  btnPrevFreq.addEventListener("click", () => tuneStep(-1));
  btnNextFreq.addEventListener("click", () => tuneStep(1));
  btnSeek.addEventListener("click", () => tuneStep(1));
  btnRandom.addEventListener("click", selectRandomStation);

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

  // Import Button Handler
  if (btnModalImport) {
    btnModalImport.addEventListener("click", handleImportChoice);
  } else {
    console.error("Element #btn-modal-import was not found in the DOM.");
  }
  
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

        await saveStationsToDB(stations);

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