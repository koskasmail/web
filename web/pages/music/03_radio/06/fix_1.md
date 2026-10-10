That error means JavaScript is trying to call `.addEventListener(...)` on a variable whose element couldn't be found in your DOM (`null`). Line 298 in your script points to one of the modal action buttons (most likely `btnModalImport`).

Here is how to fix it depending on whether the element ID is mismatched in HTML or missing optional checks in JavaScript:

---

### Step 1: Verify your `index.html` DOM elements

Make sure all four action buttons and the hidden file input exist inside your `index.html` with their exact corresponding `id` attributes:

```html
<div class="modal-overlay" id="json-modal">
  <div class="modal-body">
    <h3><i class="fa-solid fa-code"></i> Edit Stations Data (JSON)</h3>
    <p>Edit the JSON list of radio stations below or import from a file / URL.</p>

    <!-- 1. Ensure this input ID exists -->
    <input type="file" id="file-import-input" accept=".json,application/json" style="display: none;" />

    <textarea id="json-editor"></textarea>

    <div class="modal-actions">
      <!-- 2. Ensure all button IDs match script selectors -->
      <button class="btn-secondary" id="btn-modal-cancel">Cancel</button>
      <button class="btn-secondary" id="btn-modal-import">
        <i class="fa-solid fa-file-import"></i> Import JSON
      </button>
      <button class="btn-secondary" id="btn-modal-export">
        <i class="fa-solid fa-download"></i> Export JSON
      </button>
      <button class="btn-primary" id="btn-modal-save">
        <i class="fa-solid fa-floppy-disk"></i> Save & Apply
      </button>
    </div>
  </div>
</div>

```

---

### Step 2: Add Optional Chaining in `script.js`

To make sure your script never crashes even if an element is missing, use optional chaining (`?.addEventListener`) or null checks when binding the event listeners near the bottom of your JavaScript file:

```javascript
// Safe Event Listeners Binding
btnPlay?.addEventListener("click", togglePlay);
btnPrevFreq?.addEventListener("click", () => tuneStep(-1));
btnNextFreq?.addEventListener("click", () => tuneStep(1));
btnSeek?.addEventListener("click", () => tuneStep(1));
btnRandom?.addEventListener("click", selectRandomStation);

// Modal Controls
btnSettings?.addEventListener("click", () => {
  jsonEditor.value = JSON.stringify(stations, null, 2);
  jsonModal.classList.add("active");
});

btnModalCancel?.addEventListener("click", () => {
  jsonModal.classList.remove("active");
});

btnModalImport?.addEventListener("click", handleImportChoice);

btnModalExport?.addEventListener("click", () => {
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

btnModalSave?.addEventListener("click", async () => {
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

fileImportInput?.addEventListener("change", (e) => {
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
  fileImportInput.value = "";
});

```

Using `?.addEventListener` prevents a single missing DOM ID from crashing the execution of the entire file.