let apiStations = [];
let isPowerOn = false;

// DOM references
let radioAudio, powerLed, statusText, screenHeader, dialIndicator, apiFrame;

fetch("apiStationList.json")
  .then(res => res.json())
  .then(data => {
    apiStations = data.stations;
    initDom();
    buildButtons();
  });

function initDom() {
  apiFrame = document.getElementById("apiFrame");
  powerLed = document.getElementById("powerLed");
  statusText = document.getElementById("statusText");
  radioAudio = document.getElementById("radioAudio");
  screenHeader = document.getElementById("screenHeader");
  dialIndicator = document.getElementById("dialIndicator");
}

function buildButtons() {
  const container = document.getElementById("buttonsContainer");

  apiStations.forEach((url, index) => {
    const btn = document.createElement("button");
    btn.className = "station-btn";
    btn.textContent = "CH " + (index + 1);
    btn.onclick = () => tuneToStation(index);
    container.appendChild(btn);
  });
}

async function tuneToStation(index) {
  document.querySelectorAll(".station-btn").forEach((b, i) => {
    b.classList.toggle("active", i === index);
  });

  const percent = (index / (apiStations.length - 1)) * 100;
  dialIndicator.style.left = percent + "%";

  screenHeader.textContent = "Tuning... CH " + (index + 1);
  apiFrame.src = apiStations[index];

  powerLed.classList.add("on");
  
  if (!isPowerOn) {
    try {
      await radioAudio.play();
      isPowerOn = true;
      powerLed.classList.add("on");
    } catch {
      statusText.textContent = "Tap again to enable audio";
    }
  }

  statusText.textContent = "Signal Received";
}
