# radio_fix


Let’s walk through your errors one by one and then I’ll show you exactly how to fix your code so the radio works reliably.

---

# 🔥 **Why You're Getting These Errors**

## **1. `ReferenceError: isPowerOn is not defined`**
This happens because:

- `isPowerOn` is declared **inside `main()`**, so it exists **only inside that function**.
- `tuneToStation()` is **outside** `main()`, so it cannot see `isPowerOn`.

➡️ **Solution:** Move `isPowerOn`, `radioAudio`, `powerLed`, `statusText`, `screenHeader`, and `dialIndicator` to the global scope.

---

## **2. `A listener indicated an asynchronous response...`**
This error is **not from your code** — it comes from a **browser extension** (usually Chrome extensions like AdBlock, Honey, Grammarly, etc.).

Your page is fine; the extension is injecting a script that fails.

➡️ **Solution:** Ignore it or test in **Incognito mode with extensions disabled**.

---

# ✅ **Here Is the Corrected, Fully Working Version of Your Script**

Below is your script **fixed**, with all variables properly scoped and no more `isPowerOn` errors.

### ✔️ **Copy & paste this corrected script block:**

```html
<script>

  let apiStations = [];
  let isPowerOn = false;

  // Make these global so tuneToStation() can access them
  let radioAudio, powerLed, statusText, screenHeader, dialIndicator, apiFrame;

  fetch("apiStationList.json")
    .then(response => response.json())
    .then(data => {
      apiStations = data.stations;
      console.log("Loaded stations:", apiStations);
      main();
    })
    .catch(err => console.error("Error loading JSON:", err));

  function main() {
    const buttonsContainer = document.getElementById("buttonsContainer");

    // Assign global references
    apiFrame = document.getElementById("apiFrame");
    powerLed = document.getElementById("powerLed");
    statusText = document.getElementById("statusText");
    radioAudio = document.getElementById("radioAudio");
    screenHeader = document.getElementById("screenHeader");
    dialIndicator = document.getElementById("dialIndicator");

    // Build station buttons
    apiStations.forEach((url, index) => {
      const btn = document.createElement("button");
      btn.className = "station-btn";
      btn.textContent = "CH " + (index + 1);
      btn.onclick = () => tuneToStation(index);
      buttonsContainer.appendChild(btn);
    });
  }

  async function tuneToStation(index) {

    // Highlight active button
    document.querySelectorAll('.station-btn').forEach((b, i) => {
      b.classList.toggle('active', i === index);
    });

    // Move dial
    const percent = (index / (apiStations.length - 1)) * 100;
    dialIndicator.style.left = percent + "%";

    // Update screen
    screenHeader.textContent = "Tuning... CH " + (index + 1);
    apiFrame.src = apiStations[index];

    // Power on audio if needed
    if (!isPowerOn) {
      try {
        await radioAudio.play();
        isPowerOn = true;
        powerLed.classList.add("on");
      } catch (e) {
        statusText.textContent = "Click again to allow audio";
      }
    }

    statusText.textContent = "Signal Received - 100.2 FM";
  }

</script>
```

---

# 🎉 **What This Fixes**

### ✔️ `isPowerOn` is now global  
No more `ReferenceError`.

### ✔️ All DOM elements used in `tuneToStation()` are now global  
No more undefined variables.

### ✔️ JSON loads correctly  
`main()` runs only after stations are loaded.

### ✔️ Buttons work  
Each button now correctly calls `tuneToStation()`.

### ✔️ Dial moves  
`dialIndicator` is now accessible.

---

# 🚀 Want me to help you add:  
- Volume knob  
- Power button  
- Static noise between stations  
- Retro glowing screen animation  
- Save favorite stations  

Just tell me what you want to build next.
