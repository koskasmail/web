
# tc

The key part of your stack trace is this:

```
Exception in thread "AWT-EventQueue-0" java.lang.NullPointerException
    at jaron.ErrorTableModel.getRowCount(ErrorTableModel.java:17)
```

### ✅ What the error means

You are getting a **`NullPointerException`**, which means:

> Your code is trying to use an object reference that is `null`.

In simple terms: something hasn’t been initialized before you use it.

---

### ✅ Where the problem is

The important line is:

```
at jaron.ErrorTableModel.getRowCount(ErrorTableModel.java:17)
```

That means:

* The crash happens inside your class `ErrorTableModel`
* In the method `getRowCount()`
* On **line 17**
* That method is being called by `JTable` while it is rendering

So the issue is **inside your `getRowCount()` method**.

---

### 🔎 Why Swing is calling it

`JTable` automatically calls:

```java
getRowCount()
```

to determine how many rows to display.

If inside that method you do something like:

```java
return errorList.size();
```

and `errorList` is `null`, you’ll get exactly this error.

---

### 🚨 Most Common Cause

Your table model probably has something like:

```java
private List<Error> errors;
```

But you never initialized it:

```java
errors = new ArrayList<>();
```

So when `getRowCount()` runs:

```java
return errors.size();   // 💥 errors is null
```

Boom → `NullPointerException`.

---

### ✅ How to Fix It

#### ✔ Option 1 (Best Practice): Initialize in constructor

```java
private List<Error> errors = new ArrayList<>();
```

OR

```java
public ErrorTableModel() {
    errors = new ArrayList<>();
}
```

---

#### ✔ Option 2 (Defensive check)

```java
@Override
public int getRowCount() {
    if (errors == null) {
        return 0;
    }
    return errors.size();
}
```

But properly initializing is better.

---

### 🔥 Why It Appears Multiple Times

You see:

```
Exception in thread "AWT-EventQueue-0"
Exception in thread "main"
```

Because:

* Swing keeps trying to layout/redraw the table
* Each time it calls `getRowCount()`
* It crashes again

---

### 🎯 What You Should Do Next

Open:

```
ErrorTableModel.java
```

Go to:

```
line 17
```

Check which variable is being used there.

That variable is `null`.

Initialize it before using it.

---

If you paste your `ErrorTableModel` class here, I can point to the exact line and show the precise fix.


------

In **Windows 11**, the file path for a `.wav` file (or any file) depends on where it’s stored. Here’s how you can find or determine the path:

### 1. **Finding the Path of a `.wav` File**

If you know where the `.wav` file is stored, follow these steps to get its path:

1. **Open File Explorer** (`Windows Key + E`).
2. **Navigate to the folder** containing the `.wav` file.
3. **Right-click** the `.wav` file and select **Properties**.
4. In the **General** tab, you’ll see the **Location** of the file. Combine that with the **file name** to form the full path.

   For example:

   * Location: `C:\Users\YourUserName\Music`
   * File name: `sound.wav`

   Full path: `C:\Users\YourUserName\Music\sound.wav`

### 2. **Common Default Locations for `.wav` Files**

* **System Sounds**: Windows 11 system sounds are typically stored in:

  ```
  C:\Windows\Media
  ```

  This is where you’ll find default sounds like `Windows Notify.wav`, `Windows Error.wav`, etc.

* **User Music Folder**: If you saved or downloaded `.wav` files from a music app or manually, the path might look like:

  ```
  C:\Users\YourUserName\Music
  ```

---

### 3. **Example of Full Path to a `.wav` File**

If your `.wav` file is in the "Downloads" folder, the full path might be:

```
C:\Users\YourUserName\Downloads\example.wav
```

---

Let me know if you need help locating a specific `.wav` file!


------

In **Windows 11**, the default system sound files (like notifications, startup sounds, and error alerts) are stored in a specific directory. Here's where you can find them:

### **Path to Default System Sounds in Windows 11**

The system sound files, including `.wav` files for various events (like login, notification, etc.), are typically located in:

```
C:\Windows\Media
```

### **Steps to Access the System Sounds:**

1. **Open File Explorer** (`Windows Key + E`).
2. **Navigate** to:

   ```
   C:\Windows\Media
   ```
3. You’ll see a list of sound files with `.wav` extensions. These include system sounds like:

   * `Windows Notify.wav` (for notifications)
   * `Windows Error.wav` (for error sounds)
   * `Windows Logon.wav` (for login sounds)
   * And more.

### **Customizing Sounds in Windows 11**

You can also change these system sounds through the **Control Panel**:

1. **Open Settings** (press `Windows Key + I`).
2. Go to **System** > **Sound**.
3. Under **Advanced sound options**, click on **More sound settings**.
4. This opens the **Sound** window (which is from the classic Control Panel).
5. Click on the **Sounds** tab.
6. From there, you can select and customize individual sounds for various events by clicking on a sound event and clicking **Browse** to select a different `.wav` file.

### **Example Sound Files in `C:\Windows\Media`:**

* `Windows Logon.wav`
* `Windows Notify.wav`
* `Windows Error.wav`
* `Windows Background.wav`
* `Start.wav`

---

Let me know if you need help with something specific related to system sounds!


-----

To implement the functionality you requested, I'll walk you through the changes needed to:

1. **Load the JSON data (audioList)** and populate a dropdown with the names of the sounds.
2. **Save the selected sound** to the session storage.
3. **Use the selected sound** in the `beep` section of your page.
4. **Load the sound on page load** based on the stored value.

### Updated Solution:

Here’s how we can integrate everything into your existing HTML and JavaScript:

#### 1. **Add the Dropdown for Audio List**

You need to create a `<select>` dropdown to let the user choose from the list of available audio files.

#### 2. **Load the Audio List and Set Default**

When the page loads, we'll populate the dropdown with the `audioList` and apply the selected audio from the session storage if it exists.

#### 3. **Change the `beep` sound based on selection**

We will change the `src` of the audio element when a new sound is selected from the dropdown.

### Updated Code

#### **HTML Section**

Add the dropdown list and update the `audio` section:

```html
<h1>Tomato Clock</h1>

<div class="container">

    <label>Countdown Timer:</label>
    <div id="countdown" class="status-box">00:00</div>

    <label>Status:</label>
    <div id="status" class="status-box">Idle</div>

    <label>Time‑to‑Dev (minutes):</label>
    <input type="number" id="devTime" min="1">

    <label>Time‑to‑Rest (minutes):</label>
    <input type="number" id="restTime" min="1">

    <label for="audioSelect">Select Beep Sound:</label>
    <select id="audioSelect">
        <!-- Options will be populated dynamically -->
    </select>

    <div class="buttons">
        <button id="startBtn">Start</button>
        <button id="saveBtn">Save</button>
        <button id="defaultBtn">Default</button>
    </div>

    <audio id="beepSound">
        <source id="beepSource" src="sound/ding.wav" type="audio/ogg">
    </audio>

</div>
```

#### **JavaScript Section**

Here’s the updated JavaScript that includes:

* The `audioList` data
* Functions to load and save settings
* Change the audio source dynamically

```javascript
const DEFAULT_DEV = 2;
const DEFAULT_REST = 2;

let devMinutes = DEFAULT_DEV;
let restMinutes = DEFAULT_REST;

let isDev = true;
let timeLeft = 0;
let timer = null;
let running = false;

const beep = document.getElementById("beepSound");
const beepSource = document.getElementById("beepSource");

// Audio list from your JSON
const audioList = [
    {
        name: "Beep Sound",
        type: "wav",
        path: "sound/beep.wav"  
    },
    {
        name: "Alert Sound",
        type: "mp3",
        path: "sound/alert.mp3"
    },
    {
        name: "Rest Sound",
        type: "wav",
        path: "sound/rest.wav"
    }
];

// Load the audio list into the dropdown
function loadAudioList() {
    const audioSelect = document.getElementById("audioSelect");
    audioList.forEach((audio, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = audio.name;
        audioSelect.appendChild(option);
    });

    // Load selected audio from sessionStorage if available
    const savedAudioIndex = sessionStorage.getItem("selectedAudioIndex");
    if (savedAudioIndex !== null) {
        audioSelect.selectedIndex = savedAudioIndex;
        beepSource.src = audioList[savedAudioIndex].path;
    } else {
        // Default to first sound
        beepSource.src = audioList[0].path;
    }
}

// Save selected audio to sessionStorage
document.getElementById("audioSelect").addEventListener("change", function() {
    const selectedIndex = this.selectedIndex;
    sessionStorage.setItem("selectedAudioIndex", selectedIndex);
    beepSource.src = audioList[selectedIndex].path;
    beep.load();  // Reload the audio element with new source
});

// Load timer settings from localStorage
function loadSettings() {
    const savedDev = localStorage.getItem("devTime");
    const savedRest = localStorage.getItem("restTime");

    devMinutes = savedDev ? parseInt(savedDev) : DEFAULT_DEV;
    restMinutes = savedRest ? parseInt(savedRest) : DEFAULT_REST;

    document.getElementById("devTime").value = devMinutes;
    document.getElementById("restTime").value = restMinutes;

    updateDisplay(0);
}

// Save timer settings to localStorage
document.getElementById("saveBtn").onclick = function () {
    const dev = parseInt(document.getElementById("devTime").value);
    const rest = parseInt(document.getElementById("restTime").value);

    if (dev > 0 && rest > 0) {
        localStorage.setItem("devTime", dev);
        localStorage.setItem("restTime", rest);
        alert("Saved!");
        loadSettings();
    }
};

// Reset to default timer settings
document.getElementById("defaultBtn").onclick = function () {
    localStorage.removeItem("devTime");
    localStorage.removeItem("restTime");
    alert("Reset to default!");
    loadSettings();
};

// START / STOP BUTTON
document.getElementById("startBtn").onclick = function () {
    if (!running) {
        startTimer();
    } else {
        stopTimer();
    }
};

function startTimer() {
    running = true;
    document.getElementById("startBtn").textContent = "Stop";

    clearInterval(timer);
    isDev = true;
    timeLeft = devMinutes * 60;

    runTimer();
}

function stopTimer() {
    running = false;
    document.getElementById("startBtn").textContent = "Start";
    clearInterval(timer);
    document.getElementById("status").textContent = "Stopped";
}

function runTimer() {
    updateDisplay();

    timer = setInterval(() => {
        timeLeft--;

        if (timeLeft <= 0) {
            beep.play(); // 🔔 Play beep sound

            isDev = !isDev;
            timeLeft = (isDev ? devMinutes : restMinutes) * 60;
        }

        updateDisplay();
    }, 1000);
}

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    document.getElementById("countdown").textContent =
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    document.getElementById("status").textContent =
        isDev ? "Development Time" : "Rest Time";
}

// Initialize everything
loadSettings();
loadAudioList();
```

### Key Changes and Additions:

1. **`loadAudioList` function**:

   * Populates the `<select>` dropdown with options from the `audioList` array.
   * Loads the selected audio from `sessionStorage` (if it exists).

2. **Event Listener for `audioSelect`**:

   * When the user selects a sound, it saves the selected index to `sessionStorage` and updates the `audio` source to the selected sound.

3. **Default Sound Behavior**:

   * The `beep` sound defaults to the first sound in the list if no audio is selected.

4. **`beepSource.src`**:

   * The `src` attribute of the `audio` element is updated dynamically when a sound is selected.

---

### How It Works:

* **On page load**, the `loadAudioList` function fills the dropdown with sound options.
* The sound selected in the dropdown is saved to `sessionStorage`, and this sound will persist when you refresh the page.
* The `beep` sound (`<audio>`) is updated based on the selection.

Let me know if you need more clarification or any adjustments!

------


