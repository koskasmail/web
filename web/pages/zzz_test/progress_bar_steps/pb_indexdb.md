Yes. The cleanest solution is to make this a small **2-page IndexedDB application**:

* `index.html` → list of saved records

  * New
  * Edit
  * Delete with Y/N confirmation
  * Search/find text
  * Sort by any column
* `form.html` → your existing 4-step wizard

  * New record
  * Edit existing record
  * Save into Chrome IndexedDB
  * After saving, return to the list
* Data is stored locally in **Chrome IndexedDB** as JavaScript objects/JSON-compatible records.
* No server, database, or internet is required.

### Files

```text
my-app/
│
├── index.html
└── form.html
```

---

# 1. `index.html`

This is the main list page.

<!DOCTYPE html>

<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

```
<title>Registration List</title>

<style>
    * {
        box-sizing: border-box;
    }

    body {
        font-family: Arial, sans-serif;
        background: #f4f4f4;
        margin: 0;
        padding: 30px;
    }

    .container {
        max-width: 1400px;
        margin: auto;
        background: white;
        padding: 25px;
        border-radius: 10px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
    }

    h1 {
        margin-top: 0;
    }

    .toolbar {
        display: flex;
        gap: 10px;
        margin-bottom: 20px;
        flex-wrap: wrap;
    }

    .toolbar input {
        flex: 1;
        min-width: 250px;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        font-size: 15px;
    }

    button {
        padding: 10px 18px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 14px;
    }

    .new-btn {
        background: #4caf50;
        color: white;
    }

    .new-btn:hover {
        background: #45a049;
    }

    .edit-btn {
        background: #2196f3;
        color: white;
    }

    .delete-btn {
        background: #f44336;
        color: white;
    }

    .table-container {
        overflow-x: auto;
    }

    table {
        width: 100%;
        border-collapse: collapse;
    }

    th {
        background: #333;
        color: white;
        padding: 12px;
        cursor: pointer;
        user-select: none;
        white-space: nowrap;
    }

    th:hover {
        background: #555;
    }

    td {
        padding: 10px;
        border-bottom: 1px solid #ddd;
    }

    tr:hover {
        background: #f5f5f5;
    }

    .actions {
        white-space: nowrap;
    }

    .empty {
        text-align: center;
        padding: 30px;
        color: #777;
    }

    .sort-indicator {
        margin-left: 5px;
    }

    .record-count {
        margin-bottom: 10px;
        color: #666;
    }

    .delete-dialog {
        display: none;
        position: fixed;
        z-index: 1000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        justify-content: center;
        align-items: center;
    }

    .dialog-box {
        background: white;
        padding: 25px;
        border-radius: 8px;
        min-width: 300px;
        max-width: 450px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
    }

    .dialog-buttons {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        margin-top: 20px;
    }

    .yes-btn {
        background: #f44336;
        color: white;
    }

    .no-btn {
        background: #777;
        color: white;
    }
</style>
```

</head>

<body>

<div class="container">

```
<h1>Registration List</h1>

<div class="toolbar">

    <input
        type="text"
        id="searchInput"
        placeholder="Find text in the list..."
        oninput="renderTable()">

    <button class="new-btn" onclick="newRecord()">
        + New
    </button>

</div>

<div class="record-count" id="recordCount"></div>

<div class="table-container">

    <table>

        <thead>
            <tr>

                <th onclick="sortTable('id')">
                    ID
                    <span id="sort-id"></span>
                </th>

                <th onclick="sortTable('firstName')">
                    First Name
                    <span id="sort-firstName"></span>
                </th>

                <th onclick="sortTable('lastName')">
                    Last Name
                    <span id="sort-lastName"></span>
                </th>

                <th onclick="sortTable('phone')">
                    Phone
                    <span id="sort-phone"></span>
                </th>

                <th onclick="sortTable('street')">
                    Street
                    <span id="sort-street"></span>
                </th>

                <th onclick="sortTable('city')">
                    City
                    <span id="sort-city"></span>
                </th>

                <th onclick="sortTable('country')">
                    Country
                    <span id="sort-country"></span>
                </th>

                <th onclick="sortTable('zip')">
                    ZIP
                    <span id="sort-zip"></span>
                </th>

                <th>Actions</th>

            </tr>
        </thead>

        <tbody id="tableBody"></tbody>

    </table>

</div>
```

</div>

<!-- DELETE CONFIRMATION -->

<div id="deleteDialog" class="delete-dialog">

```
<div class="dialog-box">

    <h3>Delete record?</h3>

    <p id="deleteMessage">
        Are you sure you want to delete this record?
    </p>

    <div class="dialog-buttons">

        <button class="no-btn" onclick="closeDeleteDialog()">
            N
        </button>

        <button class="yes-btn" onclick="confirmDelete()">
            Y
        </button>

    </div>

</div>
```

</div>

<script>

    /*
     * ==========================================================
     * IndexedDB
     * ==========================================================
     */

    const DB_NAME = "RegistrationDatabase";
    const DB_VERSION = 1;
    const STORE_NAME = "registrations";

    let db;

    let records = [];

    let sortColumn = "id";
    let sortDirection = "asc";

    let recordToDelete = null;


    /*
     * OPEN DATABASE
     */

    function openDatabase() {

        return new Promise((resolve, reject) => {

            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onupgradeneeded = function(event) {

                db = event.target.result;

                if (!db.objectStoreNames.contains(STORE_NAME)) {

                    db.createObjectStore(STORE_NAME, {
                        keyPath: "id",
                        autoIncrement: true
                    });

                }

            };

            request.onsuccess = function(event) {

                db = event.target.result;

                resolve(db);

            };

            request.onerror = function(event) {

                reject(event.target.error);

            };

        });

    }


    /*
     * GET ALL RECORDS
     */

    function getAllRecords() {

        return new Promise((resolve, reject) => {

            const transaction =
                db.transaction(STORE_NAME, "readonly");

            const store =
                transaction.objectStore(STORE_NAME);

            const request = store.getAll();

            request.onsuccess = function() {

                resolve(request.result);

            };

            request.onerror = function() {

                reject(request.error);

            };

        });

    }


    /*
     * DELETE RECORD
     */

    function deleteRecord(id) {

        return new Promise((resolve, reject) => {

            const transaction =
                db.transaction(STORE_NAME, "readwrite");

            const store =
                transaction.objectStore(STORE_NAME);

            const request = store.delete(id);

            request.onsuccess = function() {

                resolve();

            };

            request.onerror = function() {

                reject(request.error);

            };

        });

    }


    /*
     * NEW RECORD
     */

    function newRecord() {

        window.location.href = "form.html";

    }


    /*
     * EDIT RECORD
     */

    function editRecord(id) {

        window.location.href =
            "form.html?id=" + encodeURIComponent(id);

    }


    /*
     * DELETE DIALOG
     */

    function showDeleteDialog(id) {

        recordToDelete = id;

        const record =
            records.find(r => r.id === id);

        if (record) {

            document.getElementById("deleteMessage").textContent =
                "Delete " +
                record.firstName +
                " " +
                record.lastName +
                "?";

        }

        document.getElementById("deleteDialog").style.display =
            "flex";

    }


    function closeDeleteDialog() {

        recordToDelete = null;

        document.getElementById("deleteDialog").style.display =
            "none";

    }


    async function confirmDelete() {

        if (recordToDelete === null) {
            return;
        }

        try {

            await deleteRecord(recordToDelete);

            closeDeleteDialog();

            await loadRecords();

        }
        catch(error) {

            console.error(error);

            alert("Error deleting record.");

        }

    }


    /*
     * SORT
     */

    function sortTable(column) {

        if (sortColumn === column) {

            sortDirection =
                sortDirection === "asc"
                    ? "desc"
                    : "asc";

        }
        else {

            sortColumn = column;
            sortDirection = "asc";

        }

        updateSortIndicators();

        renderTable();

    }


    function updateSortIndicators() {

        const columns = [
            "id",
            "firstName",
            "lastName",
            "phone",
            "street",
            "city",
            "country",
            "zip"
        ];

        columns.forEach(column => {

            const element =
                document.getElementById("sort-" + column);

            if (!element) {
                return;
            }

            element.textContent = "";

            if (column === sortColumn) {

                element.textContent =
                    sortDirection === "asc"
                        ? "▲"
                        : "▼";

            }

        });

    }


    /*
     * SEARCH
     */

    function matchesSearch(record, searchText) {

        if (!searchText) {
            return true;
        }

        const json =
            JSON.stringify(record).toLowerCase();

        return json.includes(searchText);

    }


    /*
     * RENDER TABLE
     */

    function renderTable() {

        const tableBody =
            document.getElementById("tableBody");

        const searchText =
            document.getElementById("searchInput")
                .value
                .trim()
                .toLowerCase();


        let filteredRecords =
            records.filter(record =>
                matchesSearch(record, searchText)
            );


        /*
         * SORT
         */

        filteredRecords.sort((a, b) => {

            let valueA = a[sortColumn];
            let valueB = b[sortColumn];

            if (valueA === undefined) {
                valueA = "";
            }

            if (valueB === undefined) {
                valueB = "";
            }

            valueA =
                String(valueA).toLowerCase();

            valueB =
                String(valueB).toLowerCase();


            if (sortColumn === "id") {

                valueA = Number(a.id);
                valueB = Number(b.id);

            }


            if (valueA < valueB) {

                return sortDirection === "asc"
                    ? -1
                    : 1;

            }

            if (valueA > valueB) {

                return sortDirection === "asc"
                    ? 1
                    : -1;

            }

            return 0;

        });


        /*
         * CLEAR TABLE
         */

        tableBody.innerHTML = "";


        /*
         * EMPTY
         */

        if (filteredRecords.length === 0) {

            const row =
                document.createElement("tr");

            row.innerHTML = `
                <td colspan="9" class="empty">
                    No records found
                </td>
            `;

            tableBody.appendChild(row);

        }


        /*
         * RECORDS
         */

        filteredRecords.forEach(record => {

            const row =
                document.createElement("tr");

            row.innerHTML = `

                <td>${escapeHtml(record.id)}</td>

                <td>${escapeHtml(record.firstName)}</td>

                <td>${escapeHtml(record.lastName)}</td>

                <td>${escapeHtml(record.phone)}</td>

                <td>${escapeHtml(record.street)}</td>

                <td>${escapeHtml(record.city)}</td>

                <td>${escapeHtml(record.country)}</td>

                <td>${escapeHtml(record.zip)}</td>

                <td class="actions">

                    <button
                        class="edit-btn"
                        onclick="editRecord(${record.id})">
                        Edit
                    </button>

                    <button
                        class="delete-btn"
                        onclick="showDeleteDialog(${record.id})">
                        Delete
                    </button>

                </td>
            `;

            tableBody.appendChild(row);

        });


        document.getElementById("recordCount").textContent =
            "Records: " +
            filteredRecords.length +
            " / " +
            records.length;

    }


    /*
     * HTML ESCAPE
     *
     * Prevents data entered by the user from being
     * interpreted as HTML.
     */

    function escapeHtml(value) {

        if (value === null || value === undefined) {
            return "";
        }

        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");

    }


    /*
     * LOAD
     */

    async function loadRecords() {

        try {

            records = await getAllRecords();

            updateSortIndicators();

            renderTable();

        }
        catch(error) {

            console.error(error);

            alert("Could not load IndexedDB records.");

        }

    }


    /*
     * START APPLICATION
     */

    window.addEventListener("load", async function() {

        try {

            await openDatabase();

            await loadRecords();

        }
        catch(error) {

            console.error(error);

            alert(
                "IndexedDB is not available."
            );

        }

    });

</script>

</body>
</html>

---

# 2. `form.html`

This is your wizard, modified so it works for both **New** and **Edit**.

The important part is that it detects:

```text
form.html
```

as **New**, and:

```text
form.html?id=5
```

as **Edit record 5**.

<!DOCTYPE html>

<html lang="en">

<head>

```
<meta charset="UTF-8">

<meta name="viewport"
      content="width=device-width, initial-scale=1.0">

<title>Registration</title>

<style>

    * {
        box-sizing: border-box;
    }

    body {

        font-family: Arial, sans-serif;

        background-color: #f4f4f4;

        display: flex;

        justify-content: center;

        align-items: center;

        min-height: 100vh;

        margin: 0;

        padding: 20px;

    }


    .container {

        width: 80%;

        max-width: 650px;

        background: white;

        padding: 25px;

        border-radius: 8px;

        box-shadow:
            0 0 10px rgba(0, 0, 0, 0.1);

    }


    h2 {

        text-align: center;

    }


    .mode {

        text-align: center;

        color: #666;

        margin-bottom: 20px;

    }


    .progress-bar {

        display: flex;

        justify-content: space-between;

        margin-bottom: 30px;

        align-items: center;

    }


    .step-container {

        display: flex;

        flex-direction: column;

        align-items: center;

        position: relative;

        width: 25%;

    }


    .step {

        width: 40px;

        height: 40px;

        background-color: #ccc;

        border-radius: 50%;

        display: flex;

        justify-content: center;

        align-items: center;

        font-weight: bold;

        color: white;

        z-index: 2;

    }


    .step.active {

        background-color: #4caf50;

    }


    .progress {

        width: 100%;

        height: 4px;

        background-color: #ccc;

        position: absolute;

        top: 20px;

        left: 50%;

        z-index: 1;

    }


    .progress.active {

        background-color: #4caf50;

    }


    .step-content {

        display: none;

    }


    .step-content.active {

        display: block;

    }


    .field {

        margin-bottom: 15px;

    }


    label {

        display: block;

        margin-bottom: 5px;

        font-weight: bold;

    }


    input {

        width: 100%;

        padding: 10px;

        border: 1px solid #ccc;

        border-radius: 5px;

        font-size: 15px;

    }


    input:focus {

        outline: none;

        border-color: #4caf50;

    }


    .buttons {

        display: flex;

        gap: 10px;

        margin-top: 20px;

    }


    button {

        background-color: #4caf50;

        color: white;

        padding: 10px 18px;

        border: none;

        cursor: pointer;

        border-radius: 5px;

    }


    button:hover {

        opacity: 0.9;

    }


    .prev-btn {

        background-color: #f44336;

    }


    .cancel-btn {

        background-color: #777;

    }


    .success {

        text-align: center;

        padding: 20px;

    }


    .success h3 {

        color: #4caf50;

    }

</style>
```

</head>

<body>

<div class="container">

```
<h2>Registration Process</h2>

<div class="mode" id="modeText">
    New Registration
</div>


<!-- PROGRESS -->

<div class="progress-bar">

    <div class="step-container">

        <div class="step active" id="step1">
            1
        </div>

        <div class="progress" id="progress1">
        </div>

    </div>


    <div class="step-container">

        <div class="step" id="step2">
            2
        </div>

        <div class="progress" id="progress2">
        </div>

    </div>


    <div class="step-container">

        <div class="step" id="step3">
            3
        </div>

        <div class="progress" id="progress3">
        </div>

    </div>


    <div class="step-container">

        <div class="step" id="step4">
            4
        </div>

    </div>

</div>


<form id="progressForm">


    <!-- STEP 1 -->

    <div id="step1-content"
         class="step-content active">

        <h3>
            Step 1: Personal Information
        </h3>


        <div class="field">

            <label for="firstName">
                First Name:
            </label>

            <input
                type="text"
                id="firstName"
                required>

        </div>


        <div class="field">

            <label for="lastName">
                Last Name:
            </label>

            <input
                type="text"
                id="lastName"
                required>

        </div>


        <div class="buttons">

            <button
                type="button"
                onclick="nextStep(1)">

                Next

            </button>


            <button
                type="button"
                class="cancel-btn"
                onclick="cancelForm()">

                Cancel

            </button>

        </div>

    </div>


    <!-- STEP 2 -->

    <div id="step2-content"
         class="step-content">

        <h3>
            Step 2: Communication
        </h3>


        <div class="field">

            <label for="phone">
                Phone Number:
            </label>

            <input
                type="tel"
                id="phone"
                required>

        </div>


        <div class="buttons">

            <button
                type="button"
                class="prev-btn"
                onclick="prevStep(2)">

                Previous

            </button>


            <button
                type="button"
                onclick="nextStep(2)">

                Next

            </button>

        </div>

    </div>


    <!-- STEP 3 -->

    <div id="step3-content"
         class="step-content">

        <h3>
            Step 3: Address
        </h3>


        <div class="field">

            <label for="street">
                Street:
            </label>

            <input
                type="text"
                id="street"
                required>

        </div>


        <div class="field">

            <label for="city">
                City:
            </label>

            <input
                type="text"
                id="city"
                required>

        </div>


        <div class="field">

            <label for="country">
                Country:
            </label>

            <input
                type="text"
                id="country"
                required>

        </div>


        <div class="field">

            <label for="zip">
                ZIP Code:
            </label>

            <input
                type="text"
                id="zip"
                required>

        </div>


        <div class="buttons">

            <button
                type="button"
                class="prev-btn"
                onclick="prevStep(3)">

                Previous

            </button>


            <button
                type="button"
                onclick="nextStep(3)">

                Next

            </button>

        </div>

    </div>


    <!-- STEP 4 -->

    <div id="step4-content"
         class="step-content">

        <h3>
            Step 4: Summary
        </h3>


        <div id="summary"></div>


        <div class="buttons">

            <button
                type="button"
                class="prev-btn"
                onclick="prevStep(4)">

                Previous

            </button>


            <button
                type="submit">

                Save

            </button>

        </div>

    </div>


    <!-- STEP 5 -->

    <div id="step5-content"
         class="step-content">

        <div class="success">

            <h3>
                ✓ Saved Successfully
            </h3>

            <p>
                The registration was saved into
                Chrome IndexedDB.
            </p>

            <button
                type="button"
                onclick="goBackToList()">

                Back to List

            </button>

        </div>

    </div>


</form>
```

</div>

<script>


/*
 * ==========================================================
 * CONFIGURATION
 * ==========================================================
 */

const DB_NAME =
    "RegistrationDatabase";

const DB_VERSION =
    1;

const STORE_NAME =
    "registrations";


let db;

let currentStep = 1;

let editId = null;


/*
 * ==========================================================
 * DETERMINE NEW / EDIT
 * ==========================================================
 */

const urlParams =
    new URLSearchParams(window.location.search);

if (urlParams.has("id")) {

    editId =
        Number(urlParams.get("id"));

}


/*
 * ==========================================================
 * OPEN INDEXEDDB
 * ==========================================================
 */

function openDatabase() {

    return new Promise((resolve, reject) => {

        const request =
            indexedDB.open(
                DB_NAME,
                DB_VERSION
            );


        request.onupgradeneeded =
            function(event) {

                db =
                    event.target.result;


                if (
                    !db.objectStoreNames
                        .contains(STORE_NAME)
                ) {

                    db.createObjectStore(
                        STORE_NAME,
                        {
                            keyPath: "id",
                            autoIncrement: true
                        }
                    );

                }

            };


        request.onsuccess =
            function(event) {

                db =
                    event.target.result;

                resolve(db);

            };


        request.onerror =
            function(event) {

                reject(
                    event.target.error
                );

            };

    });

}


/*
 * ==========================================================
 * GET ONE RECORD
 * ==========================================================
 */

function getRecord(id) {

    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(
                STORE_NAME,
                "readonly"
            );


        const store =
            transaction.objectStore(
                STORE_NAME
            );


        const request =
            store.get(id);


        request.onsuccess =
            function() {

                resolve(request.result);

            };


        request.onerror =
            function() {

                reject(request.error);

            };

    });

}


/*
 * ==========================================================
 * ADD RECORD
 * ==========================================================
 */

function addRecord(record) {

    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(
                STORE_NAME,
                "readwrite"
            );


        const store =
            transaction.objectStore(
                STORE_NAME
            );


        const request =
            store.add(record);


        request.onsuccess =
            function(event) {

                resolve(
                    event.target.result
                );

            };


        request.onerror =
            function() {

                reject(request.error);

            };

    });

}


/*
 * ==========================================================
 * UPDATE RECORD
 * ==========================================================
 */

function updateRecord(record) {

    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(
                STORE_NAME,
                "readwrite"
            );


        const store =
            transaction.objectStore(
                STORE_NAME
            );


        const request =
            store.put(record);


        request.onsuccess =
            function() {

                resolve();

            };


        request.onerror =
            function() {

                reject(request.error);

            };

    });

}


/*
 * ==========================================================
 * LOAD RECORD FOR EDIT
 * ==========================================================
 */

async function loadEditRecord() {

    if (!editId) {
        return;
    }


    const record =
        await getRecord(editId);


    if (!record) {

        alert(
            "Record " +
            editId +
            " was not found."
        );

        window.location.href =
            "index.html";

        return;

    }


    /*
     * FILL FORM
     */

    document.getElementById("firstName").value =
        record.firstName || "";


    document.getElementById("lastName").value =
        record.lastName || "";


    document.getElementById("phone").value =
        record.phone || "";


    document.getElementById("street").value =
        record.street || "";


    document.getElementById("city").value =
        record.city || "";


    document.getElementById("country").value =
        record.country || "";


    document.getElementById("zip").value =
        record.zip || "";


    document.getElementById("modeText").textContent =
        "Edit Registration #" + editId;


    updateSummary();

}


/*
 * ==========================================================
 * VALIDATE STEP
 * ==========================================================
 */

function validateStep(step) {


    if (step === 1) {

        if (
            document.getElementById("firstName")
                .value
                .trim() === "" ||

            document.getElementById("lastName")
                .value
                .trim() === ""
        ) {

            alert(
                "Please fill in First Name and Last Name."
            );

            return false;

        }

    }


    if (step === 2) {

        if (
            document.getElementById("phone")
                .value
                .trim() === ""
        ) {

            alert(
                "Please enter the phone number."
            );

            return false;

        }

    }


    if (step === 3) {

        const fields = [
            "street",
            "city",
            "country",
            "zip"
        ];


        for (const field of fields) {

            if (
                document.getElementById(field)
                    .value
                    .trim() === ""
            ) {

                alert(
                    "Please fill in all address fields."
                );

                return false;

            }

        }

    }


    return true;

}


/*
 * ==========================================================
 * NEXT
 * ==========================================================
 */

function nextStep(step) {


    if (!validateStep(step)) {
        return;
    }


    /*
     * Update summary when entering step 4
     */

    if (step === 3) {

        updateSummary();

    }


    document.getElementById(
        "step" + step + "-content"
    ).classList.remove("active");


    document.getElementById(
        "step" + (step + 1) + "-content"
    ).classList.add("active");


    document.getElementById(
        "step" + step
    ).classList.add("active");


    if (step <= 3) {

        document.getElementById(
            "progress" + step
        ).classList.add("active");

    }


    currentStep = step + 1;

}


/*
 * ==========================================================
 * PREVIOUS
 * ==========================================================
 */

function prevStep(step) {


    document.getElementById(
        "step" + step + "-content"
    ).classList.remove("active");


    document.getElementById(
        "step" + (step - 1) + "-content"
    ).classList.add("active");


    document.getElementById(
        "step" + step
    ).classList.remove("active");


    if (step - 1 <= 2) {

        document.getElementById(
            "progress" + (step - 1)
        ).classList.remove("active");

    }


    currentStep = step - 1;

}


/*
 * ==========================================================
 * SUMMARY
 * ==========================================================
 */

function updateSummary() {

    const firstName =
        escapeHtml(
            document.getElementById(
                "firstName"
            ).value
        );


    const lastName =
        escapeHtml(
            document.getElementById(
                "lastName"
            ).value
        );


    const phone =
        escapeHtml(
            document.getElementById(
                "phone"
            ).value
        );


    const street =
        escapeHtml(
            document.getElementById(
                "street"
            ).value
        );


    const city =
        escapeHtml(
            document.getElementById(
                "city"
            ).value
        );


    const country =
        escapeHtml(
            document.getElementById(
                "country"
            ).value
        );


    const zip =
        escapeHtml(
            document.getElementById(
                "zip"
            ).value
        );


    document.getElementById(
        "summary"
    ).innerHTML = `

        <p>
            <strong>Personal Information:</strong><br>
            ${firstName} ${lastName}
        </p>

        <p>
            <strong>Phone:</strong><br>
            ${phone}
        </p>

        <p>
            <strong>Address:</strong><br>
            ${street},
            ${city},
            ${country},
            ${zip}
        </p>

    `;

}


/*
 * ==========================================================
 * GET FORM DATA
 * ==========================================================
 */

function getFormData() {

    return {

        firstName:
            document.getElementById(
                "firstName"
            ).value.trim(),

        lastName:
            document.getElementById(
                "lastName"
            ).value.trim(),

        phone:
            document.getElementById(
                "phone"
            ).value.trim(),

        street:
            document.getElementById(
                "street"
            ).value.trim(),

        city:
            document.getElementById(
                "city"
            ).value.trim(),

        country:
            document.getElementById(
                "country"
            ).value.trim(),

        zip:
            document.getElementById(
                "zip"
            ).value.trim(),

        /*
         * ISO date/time of last modification
         */

        updatedAt:
            new Date().toISOString()

    };

}


/*
 * ==========================================================
 * SAVE
 * ==========================================================
 */

document.getElementById(
    "progressForm"
).addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        try {

            const data =
                getFormData();


            /*
             * EDIT
             */

            if (editId !== null) {

                data.id =
                    editId;


                await updateRecord(
                    data
                );

            }


            /*
             * NEW
             */

            else {

                await addRecord(
                    data
                );

            }


            /*
             * Show success page
             */

            document.getElementById(
                "step4-content"
            ).classList.remove("active");


            document.getElementById(
                "step5-content"
            ).classList.add("active");


            /*
             * Hide wizard progress
             */

            document.querySelector(
                ".progress-bar"
            ).style.display = "none";

        }
        catch(error) {

            console.error(error);

            alert(
                "Error saving record:\n" +
                error.message
            );

        }

    }
);


/*
 * ==========================================================
 * CANCEL
 * ==========================================================
 */

function cancelForm() {

    window.location.href =
        "index.html";

}


/*
 * ==========================================================
 * BACK TO LIST
 * ==========================================================
 */

function goBackToList() {

    window.location.href =
        "index.html";

}


/*
 * ==========================================================
 * ESCAPE HTML
 * ==========================================================
 */

function escapeHtml(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}


/*
 * ==========================================================
 * START
 * ==========================================================
 */

window.addEventListener(
    "load",
    async function() {

        try {

            await openDatabase();

            await loadEditRecord();

        }
        catch(error) {

            console.error(error);

            alert(
                "Could not open IndexedDB."
            );

        }

    }
);

</script>

</body>
</html>

---

## How it works

The application uses this IndexedDB structure:

```text
RegistrationDatabase
        │
        └── registrations
                │
                ├── id
                ├── firstName
                ├── lastName
                ├── phone
                ├── street
                ├── city
                ├── country
                ├── zip
                └── updatedAt
```

A record will look approximately like this:

```json
{
    "id": 1,
    "firstName": "John",
    "lastName": "Smith",
    "phone": "0501234567",
    "street": "Main Street 10",
    "city": "Tel Aviv",
    "country": "Israel",
    "zip": "6100001",
    "updatedAt": "2026-09-13T07:00:00.000Z"
}
```

### New

From `index.html`:

```text
+ New
   ↓
form.html
   ↓
Step 1
   ↓
Step 2
   ↓
Step 3
   ↓
Step 4 Summary
   ↓
Save
   ↓
IndexedDB
```

### Edit

Click:

```text
Edit
```

It opens:

```text
form.html?id=3
```

The program reads record `3` from IndexedDB and fills the wizard automatically.

When you press **Save**, it performs an IndexedDB `put()` instead of creating a second record.

### Delete

Click:

```text
Delete
```

You get:

```text
Delete record?

Delete John Smith?

             [ N ] [ Y ]
```

`N` cancels.

`Y` permanently deletes that IndexedDB record.

### Search

The search box searches the **whole JSON representation of every record**, so for example:

```text
john
```

finds first name, last name, etc.

And:

```text
tel aviv
```

finds the city.

And:

```text
050
```

finds the phone.

### Sorting

Click any column:

```text
ID
First Name
Last Name
Phone
Street
City
Country
ZIP
```

First click:

```text
▲
```

Second click:

```text
▼
```

---

## Running it
Yes. The cleanest solution is to make this a small **2-page IndexedDB application**:

* `index.html` → list of saved records

  * New
  * Edit
  * Delete with Y/N confirmation
  * Search/find text
  * Sort by any column
* `form.html` → your existing 4-step wizard

  * New record
  * Edit existing record
  * Save into Chrome IndexedDB
  * After saving, return to the list
* Data is stored locally in **Chrome IndexedDB** as JavaScript objects/JSON-compatible records.
* No server, database, or internet is required.

### Files

```text
my-app/
│
├── index.html
└── form.html
```

---

# 1. `index.html`

This is the main list page.

<!DOCTYPE html>

<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

```
<title>Registration List</title>

<style>
    * {
        box-sizing: border-box;
    }

    body {
        font-family: Arial, sans-serif;
        background: #f4f4f4;
        margin: 0;
        padding: 30px;
    }

    .container {
        max-width: 1400px;
        margin: auto;
        background: white;
        padding: 25px;
        border-radius: 10px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
    }

    h1 {
        margin-top: 0;
    }

    .toolbar {
        display: flex;
        gap: 10px;
        margin-bottom: 20px;
        flex-wrap: wrap;
    }

    .toolbar input {
        flex: 1;
        min-width: 250px;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        font-size: 15px;
    }

    button {
        padding: 10px 18px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 14px;
    }

    .new-btn {
        background: #4caf50;
        color: white;
    }

    .new-btn:hover {
        background: #45a049;
    }

    .edit-btn {
        background: #2196f3;
        color: white;
    }

    .delete-btn {
        background: #f44336;
        color: white;
    }

    .table-container {
        overflow-x: auto;
    }

    table {
        width: 100%;
        border-collapse: collapse;
    }

    th {
        background: #333;
        color: white;
        padding: 12px;
        cursor: pointer;
        user-select: none;
        white-space: nowrap;
    }

    th:hover {
        background: #555;
    }

    td {
        padding: 10px;
        border-bottom: 1px solid #ddd;
    }

    tr:hover {
        background: #f5f5f5;
    }

    .actions {
        white-space: nowrap;
    }

    .empty {
        text-align: center;
        padding: 30px;
        color: #777;
    }

    .sort-indicator {
        margin-left: 5px;
    }

    .record-count {
        margin-bottom: 10px;
        color: #666;
    }

    .delete-dialog {
        display: none;
        position: fixed;
        z-index: 1000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        justify-content: center;
        align-items: center;
    }

    .dialog-box {
        background: white;
        padding: 25px;
        border-radius: 8px;
        min-width: 300px;
        max-width: 450px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
    }

    .dialog-buttons {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        margin-top: 20px;
    }

    .yes-btn {
        background: #f44336;
        color: white;
    }

    .no-btn {
        background: #777;
        color: white;
    }
</style>
```

</head>

<body>

<div class="container">

```
<h1>Registration List</h1>

<div class="toolbar">

    <input
        type="text"
        id="searchInput"
        placeholder="Find text in the list..."
        oninput="renderTable()">

    <button class="new-btn" onclick="newRecord()">
        + New
    </button>

</div>

<div class="record-count" id="recordCount"></div>

<div class="table-container">

    <table>

        <thead>
            <tr>

                <th onclick="sortTable('id')">
                    ID
                    <span id="sort-id"></span>
                </th>

                <th onclick="sortTable('firstName')">
                    First Name
                    <span id="sort-firstName"></span>
                </th>

                <th onclick="sortTable('lastName')">
                    Last Name
                    <span id="sort-lastName"></span>
                </th>

                <th onclick="sortTable('phone')">
                    Phone
                    <span id="sort-phone"></span>
                </th>

                <th onclick="sortTable('street')">
                    Street
                    <span id="sort-street"></span>
                </th>

                <th onclick="sortTable('city')">
                    City
                    <span id="sort-city"></span>
                </th>

                <th onclick="sortTable('country')">
                    Country
                    <span id="sort-country"></span>
                </th>

                <th onclick="sortTable('zip')">
                    ZIP
                    <span id="sort-zip"></span>
                </th>

                <th>Actions</th>

            </tr>
        </thead>

        <tbody id="tableBody"></tbody>

    </table>

</div>
```

</div>

<!-- DELETE CONFIRMATION -->

<div id="deleteDialog" class="delete-dialog">

```
<div class="dialog-box">

    <h3>Delete record?</h3>

    <p id="deleteMessage">
        Are you sure you want to delete this record?
    </p>

    <div class="dialog-buttons">

        <button class="no-btn" onclick="closeDeleteDialog()">
            N
        </button>

        <button class="yes-btn" onclick="confirmDelete()">
            Y
        </button>

    </div>

</div>
```

</div>

<script>

    /*
     * ==========================================================
     * IndexedDB
     * ==========================================================
     */

    const DB_NAME = "RegistrationDatabase";
    const DB_VERSION = 1;
    const STORE_NAME = "registrations";

    let db;

    let records = [];

    let sortColumn = "id";
    let sortDirection = "asc";

    let recordToDelete = null;


    /*
     * OPEN DATABASE
     */

    function openDatabase() {

        return new Promise((resolve, reject) => {

            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onupgradeneeded = function(event) {

                db = event.target.result;

                if (!db.objectStoreNames.contains(STORE_NAME)) {

                    db.createObjectStore(STORE_NAME, {
                        keyPath: "id",
                        autoIncrement: true
                    });

                }

            };

            request.onsuccess = function(event) {

                db = event.target.result;

                resolve(db);

            };

            request.onerror = function(event) {

                reject(event.target.error);

            };

        });

    }


    /*
     * GET ALL RECORDS
     */

    function getAllRecords() {

        return new Promise((resolve, reject) => {

            const transaction =
                db.transaction(STORE_NAME, "readonly");

            const store =
                transaction.objectStore(STORE_NAME);

            const request = store.getAll();

            request.onsuccess = function() {

                resolve(request.result);

            };

            request.onerror = function() {

                reject(request.error);

            };

        });

    }


    /*
     * DELETE RECORD
     */

    function deleteRecord(id) {

        return new Promise((resolve, reject) => {

            const transaction =
                db.transaction(STORE_NAME, "readwrite");

            const store =
                transaction.objectStore(STORE_NAME);

            const request = store.delete(id);

            request.onsuccess = function() {

                resolve();

            };

            request.onerror = function() {

                reject(request.error);

            };

        });

    }


    /*
     * NEW RECORD
     */

    function newRecord() {

        window.location.href = "form.html";

    }


    /*
     * EDIT RECORD
     */

    function editRecord(id) {

        window.location.href =
            "form.html?id=" + encodeURIComponent(id);

    }


    /*
     * DELETE DIALOG
     */

    function showDeleteDialog(id) {

        recordToDelete = id;

        const record =
            records.find(r => r.id === id);

        if (record) {

            document.getElementById("deleteMessage").textContent =
                "Delete " +
                record.firstName +
                " " +
                record.lastName +
                "?";

        }

        document.getElementById("deleteDialog").style.display =
            "flex";

    }


    function closeDeleteDialog() {

        recordToDelete = null;

        document.getElementById("deleteDialog").style.display =
            "none";

    }


    async function confirmDelete() {

        if (recordToDelete === null) {
            return;
        }

        try {

            await deleteRecord(recordToDelete);

            closeDeleteDialog();

            await loadRecords();

        }
        catch(error) {

            console.error(error);

            alert("Error deleting record.");

        }

    }


    /*
     * SORT
     */

    function sortTable(column) {

        if (sortColumn === column) {

            sortDirection =
                sortDirection === "asc"
                    ? "desc"
                    : "asc";

        }
        else {

            sortColumn = column;
            sortDirection = "asc";

        }

        updateSortIndicators();

        renderTable();

    }


    function updateSortIndicators() {

        const columns = [
            "id",
            "firstName",
            "lastName",
            "phone",
            "street",
            "city",
            "country",
            "zip"
        ];

        columns.forEach(column => {

            const element =
                document.getElementById("sort-" + column);

            if (!element) {
                return;
            }

            element.textContent = "";

            if (column === sortColumn) {

                element.textContent =
                    sortDirection === "asc"
                        ? "▲"
                        : "▼";

            }

        });

    }


    /*
     * SEARCH
     */

    function matchesSearch(record, searchText) {

        if (!searchText) {
            return true;
        }

        const json =
            JSON.stringify(record).toLowerCase();

        return json.includes(searchText);

    }


    /*
     * RENDER TABLE
     */

    function renderTable() {

        const tableBody =
            document.getElementById("tableBody");

        const searchText =
            document.getElementById("searchInput")
                .value
                .trim()
                .toLowerCase();


        let filteredRecords =
            records.filter(record =>
                matchesSearch(record, searchText)
            );


        /*
         * SORT
         */

        filteredRecords.sort((a, b) => {

            let valueA = a[sortColumn];
            let valueB = b[sortColumn];

            if (valueA === undefined) {
                valueA = "";
            }

            if (valueB === undefined) {
                valueB = "";
            }

            valueA =
                String(valueA).toLowerCase();

            valueB =
                String(valueB).toLowerCase();


            if (sortColumn === "id") {

                valueA = Number(a.id);
                valueB = Number(b.id);

            }


            if (valueA < valueB) {

                return sortDirection === "asc"
                    ? -1
                    : 1;

            }

            if (valueA > valueB) {

                return sortDirection === "asc"
                    ? 1
                    : -1;

            }

            return 0;

        });


        /*
         * CLEAR TABLE
         */

        tableBody.innerHTML = "";


        /*
         * EMPTY
         */

        if (filteredRecords.length === 0) {

            const row =
                document.createElement("tr");

            row.innerHTML = `
                <td colspan="9" class="empty">
                    No records found
                </td>
            `;

            tableBody.appendChild(row);

        }


        /*
         * RECORDS
         */

        filteredRecords.forEach(record => {

            const row =
                document.createElement("tr");

            row.innerHTML = `

                <td>${escapeHtml(record.id)}</td>

                <td>${escapeHtml(record.firstName)}</td>

                <td>${escapeHtml(record.lastName)}</td>

                <td>${escapeHtml(record.phone)}</td>

                <td>${escapeHtml(record.street)}</td>

                <td>${escapeHtml(record.city)}</td>

                <td>${escapeHtml(record.country)}</td>

                <td>${escapeHtml(record.zip)}</td>

                <td class="actions">

                    <button
                        class="edit-btn"
                        onclick="editRecord(${record.id})">
                        Edit
                    </button>

                    <button
                        class="delete-btn"
                        onclick="showDeleteDialog(${record.id})">
                        Delete
                    </button>

                </td>
            `;

            tableBody.appendChild(row);

        });


        document.getElementById("recordCount").textContent =
            "Records: " +
            filteredRecords.length +
            " / " +
            records.length;

    }


    /*
     * HTML ESCAPE
     *
     * Prevents data entered by the user from being
     * interpreted as HTML.
     */

    function escapeHtml(value) {

        if (value === null || value === undefined) {
            return "";
        }

        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");

    }


    /*
     * LOAD
     */

    async function loadRecords() {

        try {

            records = await getAllRecords();

            updateSortIndicators();

            renderTable();

        }
        catch(error) {

            console.error(error);

            alert("Could not load IndexedDB records.");

        }

    }


    /*
     * START APPLICATION
     */

    window.addEventListener("load", async function() {

        try {

            await openDatabase();

            await loadRecords();

        }
        catch(error) {

            console.error(error);

            alert(
                "IndexedDB is not available."
            );

        }

    });

</script>

</body>
</html>

---

# 2. `form.html`

This is your wizard, modified so it works for both **New** and **Edit**.

The important part is that it detects:

```text
form.html
```

as **New**, and:

```text
form.html?id=5
```

as **Edit record 5**.

<!DOCTYPE html>

<html lang="en">

<head>

```
<meta charset="UTF-8">

<meta name="viewport"
      content="width=device-width, initial-scale=1.0">

<title>Registration</title>

<style>

    * {
        box-sizing: border-box;
    }

    body {

        font-family: Arial, sans-serif;

        background-color: #f4f4f4;

        display: flex;

        justify-content: center;

        align-items: center;

        min-height: 100vh;

        margin: 0;

        padding: 20px;

    }


    .container {

        width: 80%;

        max-width: 650px;

        background: white;

        padding: 25px;

        border-radius: 8px;

        box-shadow:
            0 0 10px rgba(0, 0, 0, 0.1);

    }


    h2 {

        text-align: center;

    }


    .mode {

        text-align: center;

        color: #666;

        margin-bottom: 20px;

    }


    .progress-bar {

        display: flex;

        justify-content: space-between;

        margin-bottom: 30px;

        align-items: center;

    }


    .step-container {

        display: flex;

        flex-direction: column;

        align-items: center;

        position: relative;

        width: 25%;

    }


    .step {

        width: 40px;

        height: 40px;

        background-color: #ccc;

        border-radius: 50%;

        display: flex;

        justify-content: center;

        align-items: center;

        font-weight: bold;

        color: white;

        z-index: 2;

    }


    .step.active {

        background-color: #4caf50;

    }


    .progress {

        width: 100%;

        height: 4px;

        background-color: #ccc;

        position: absolute;

        top: 20px;

        left: 50%;

        z-index: 1;

    }


    .progress.active {

        background-color: #4caf50;

    }


    .step-content {

        display: none;

    }


    .step-content.active {

        display: block;

    }


    .field {

        margin-bottom: 15px;

    }


    label {

        display: block;

        margin-bottom: 5px;

        font-weight: bold;

    }


    input {

        width: 100%;

        padding: 10px;

        border: 1px solid #ccc;

        border-radius: 5px;

        font-size: 15px;

    }


    input:focus {

        outline: none;

        border-color: #4caf50;

    }


    .buttons {

        display: flex;

        gap: 10px;

        margin-top: 20px;

    }


    button {

        background-color: #4caf50;

        color: white;

        padding: 10px 18px;

        border: none;

        cursor: pointer;

        border-radius: 5px;

    }


    button:hover {

        opacity: 0.9;

    }


    .prev-btn {

        background-color: #f44336;

    }


    .cancel-btn {

        background-color: #777;

    }


    .success {

        text-align: center;

        padding: 20px;

    }


    .success h3 {

        color: #4caf50;

    }

</style>
```

</head>

<body>

<div class="container">

```
<h2>Registration Process</h2>

<div class="mode" id="modeText">
    New Registration
</div>


<!-- PROGRESS -->

<div class="progress-bar">

    <div class="step-container">

        <div class="step active" id="step1">
            1
        </div>

        <div class="progress" id="progress1">
        </div>

    </div>


    <div class="step-container">

        <div class="step" id="step2">
            2
        </div>

        <div class="progress" id="progress2">
        </div>

    </div>


    <div class="step-container">

        <div class="step" id="step3">
            3
        </div>

        <div class="progress" id="progress3">
        </div>

    </div>


    <div class="step-container">

        <div class="step" id="step4">
            4
        </div>

    </div>

</div>


<form id="progressForm">


    <!-- STEP 1 -->

    <div id="step1-content"
         class="step-content active">

        <h3>
            Step 1: Personal Information
        </h3>


        <div class="field">

            <label for="firstName">
                First Name:
            </label>

            <input
                type="text"
                id="firstName"
                required>

        </div>


        <div class="field">

            <label for="lastName">
                Last Name:
            </label>

            <input
                type="text"
                id="lastName"
                required>

        </div>


        <div class="buttons">

            <button
                type="button"
                onclick="nextStep(1)">

                Next

            </button>


            <button
                type="button"
                class="cancel-btn"
                onclick="cancelForm()">

                Cancel

            </button>

        </div>

    </div>


    <!-- STEP 2 -->

    <div id="step2-content"
         class="step-content">

        <h3>
            Step 2: Communication
        </h3>


        <div class="field">

            <label for="phone">
                Phone Number:
            </label>

            <input
                type="tel"
                id="phone"
                required>

        </div>


        <div class="buttons">

            <button
                type="button"
                class="prev-btn"
                onclick="prevStep(2)">

                Previous

            </button>


            <button
                type="button"
                onclick="nextStep(2)">

                Next

            </button>

        </div>

    </div>


    <!-- STEP 3 -->

    <div id="step3-content"
         class="step-content">

        <h3>
            Step 3: Address
        </h3>


        <div class="field">

            <label for="street">
                Street:
            </label>

            <input
                type="text"
                id="street"
                required>

        </div>


        <div class="field">

            <label for="city">
                City:
            </label>

            <input
                type="text"
                id="city"
                required>

        </div>


        <div class="field">

            <label for="country">
                Country:
            </label>

            <input
                type="text"
                id="country"
                required>

        </div>


        <div class="field">

            <label for="zip">
                ZIP Code:
            </label>

            <input
                type="text"
                id="zip"
                required>

        </div>


        <div class="buttons">

            <button
                type="button"
                class="prev-btn"
                onclick="prevStep(3)">

                Previous

            </button>


            <button
                type="button"
                onclick="nextStep(3)">

                Next

            </button>

        </div>

    </div>


    <!-- STEP 4 -->

    <div id="step4-content"
         class="step-content">

        <h3>
            Step 4: Summary
        </h3>


        <div id="summary"></div>


        <div class="buttons">

            <button
                type="button"
                class="prev-btn"
                onclick="prevStep(4)">

                Previous

            </button>


            <button
                type="submit">

                Save

            </button>

        </div>

    </div>


    <!-- STEP 5 -->

    <div id="step5-content"
         class="step-content">

        <div class="success">

            <h3>
                ✓ Saved Successfully
            </h3>

            <p>
                The registration was saved into
                Chrome IndexedDB.
            </p>

            <button
                type="button"
                onclick="goBackToList()">

                Back to List

            </button>

        </div>

    </div>


</form>
```

</div>

<script>


/*
 * ==========================================================
 * CONFIGURATION
 * ==========================================================
 */

const DB_NAME =
    "RegistrationDatabase";

const DB_VERSION =
    1;

const STORE_NAME =
    "registrations";


let db;

let currentStep = 1;

let editId = null;


/*
 * ==========================================================
 * DETERMINE NEW / EDIT
 * ==========================================================
 */

const urlParams =
    new URLSearchParams(window.location.search);

if (urlParams.has("id")) {

    editId =
        Number(urlParams.get("id"));

}


/*
 * ==========================================================
 * OPEN INDEXEDDB
 * ==========================================================
 */

function openDatabase() {

    return new Promise((resolve, reject) => {

        const request =
            indexedDB.open(
                DB_NAME,
                DB_VERSION
            );


        request.onupgradeneeded =
            function(event) {

                db =
                    event.target.result;


                if (
                    !db.objectStoreNames
                        .contains(STORE_NAME)
                ) {

                    db.createObjectStore(
                        STORE_NAME,
                        {
                            keyPath: "id",
                            autoIncrement: true
                        }
                    );

                }

            };


        request.onsuccess =
            function(event) {

                db =
                    event.target.result;

                resolve(db);

            };


        request.onerror =
            function(event) {

                reject(
                    event.target.error
                );

            };

    });

}


/*
 * ==========================================================
 * GET ONE RECORD
 * ==========================================================
 */

function getRecord(id) {

    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(
                STORE_NAME,
                "readonly"
            );


        const store =
            transaction.objectStore(
                STORE_NAME
            );


        const request =
            store.get(id);


        request.onsuccess =
            function() {

                resolve(request.result);

            };


        request.onerror =
            function() {

                reject(request.error);

            };

    });

}


/*
 * ==========================================================
 * ADD RECORD
 * ==========================================================
 */

function addRecord(record) {

    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(
                STORE_NAME,
                "readwrite"
            );


        const store =
            transaction.objectStore(
                STORE_NAME
            );


        const request =
            store.add(record);


        request.onsuccess =
            function(event) {

                resolve(
                    event.target.result
                );

            };


        request.onerror =
            function() {

                reject(request.error);

            };

    });

}


/*
 * ==========================================================
 * UPDATE RECORD
 * ==========================================================
 */

function updateRecord(record) {

    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(
                STORE_NAME,
                "readwrite"
            );


        const store =
            transaction.objectStore(
                STORE_NAME
            );


        const request =
            store.put(record);


        request.onsuccess =
            function() {

                resolve();

            };


        request.onerror =
            function() {

                reject(request.error);

            };

    });

}


/*
 * ==========================================================
 * LOAD RECORD FOR EDIT
 * ==========================================================
 */

async function loadEditRecord() {

    if (!editId) {
        return;
    }


    const record =
        await getRecord(editId);


    if (!record) {

        alert(
            "Record " +
            editId +
            " was not found."
        );

        window.location.href =
            "index.html";

        return;

    }


    /*
     * FILL FORM
     */

    document.getElementById("firstName").value =
        record.firstName || "";


    document.getElementById("lastName").value =
        record.lastName || "";


    document.getElementById("phone").value =
        record.phone || "";


    document.getElementById("street").value =
        record.street || "";


    document.getElementById("city").value =
        record.city || "";


    document.getElementById("country").value =
        record.country || "";


    document.getElementById("zip").value =
        record.zip || "";


    document.getElementById("modeText").textContent =
        "Edit Registration #" + editId;


    updateSummary();

}


/*
 * ==========================================================
 * VALIDATE STEP
 * ==========================================================
 */

function validateStep(step) {


    if (step === 1) {

        if (
            document.getElementById("firstName")
                .value
                .trim() === "" ||

            document.getElementById("lastName")
                .value
                .trim() === ""
        ) {

            alert(
                "Please fill in First Name and Last Name."
            );

            return false;

        }

    }


    if (step === 2) {

        if (
            document.getElementById("phone")
                .value
                .trim() === ""
        ) {

            alert(
                "Please enter the phone number."
            );

            return false;

        }

    }


    if (step === 3) {

        const fields = [
            "street",
            "city",
            "country",
            "zip"
        ];


        for (const field of fields) {

            if (
                document.getElementById(field)
                    .value
                    .trim() === ""
            ) {

                alert(
                    "Please fill in all address fields."
                );

                return false;

            }

        }

    }


    return true;

}


/*
 * ==========================================================
 * NEXT
 * ==========================================================
 */

function nextStep(step) {


    if (!validateStep(step)) {
        return;
    }


    /*
     * Update summary when entering step 4
     */

    if (step === 3) {

        updateSummary();

    }


    document.getElementById(
        "step" + step + "-content"
    ).classList.remove("active");


    document.getElementById(
        "step" + (step + 1) + "-content"
    ).classList.add("active");


    document.getElementById(
        "step" + step
    ).classList.add("active");


    if (step <= 3) {

        document.getElementById(
            "progress" + step
        ).classList.add("active");

    }


    currentStep = step + 1;

}


/*
 * ==========================================================
 * PREVIOUS
 * ==========================================================
 */

function prevStep(step) {


    document.getElementById(
        "step" + step + "-content"
    ).classList.remove("active");


    document.getElementById(
        "step" + (step - 1) + "-content"
    ).classList.add("active");


    document.getElementById(
        "step" + step
    ).classList.remove("active");


    if (step - 1 <= 2) {

        document.getElementById(
            "progress" + (step - 1)
        ).classList.remove("active");

    }


    currentStep = step - 1;

}


/*
 * ==========================================================
 * SUMMARY
 * ==========================================================
 */

function updateSummary() {

    const firstName =
        escapeHtml(
            document.getElementById(
                "firstName"
            ).value
        );


    const lastName =
        escapeHtml(
            document.getElementById(
                "lastName"
            ).value
        );


    const phone =
        escapeHtml(
            document.getElementById(
                "phone"
            ).value
        );


    const street =
        escapeHtml(
            document.getElementById(
                "street"
            ).value
        );


    const city =
        escapeHtml(
            document.getElementById(
                "city"
            ).value
        );


    const country =
        escapeHtml(
            document.getElementById(
                "country"
            ).value
        );


    const zip =
        escapeHtml(
            document.getElementById(
                "zip"
            ).value
        );


    document.getElementById(
        "summary"
    ).innerHTML = `

        <p>
            <strong>Personal Information:</strong><br>
            ${firstName} ${lastName}
        </p>

        <p>
            <strong>Phone:</strong><br>
            ${phone}
        </p>

        <p>
            <strong>Address:</strong><br>
            ${street},
            ${city},
            ${country},
            ${zip}
        </p>

    `;

}


/*
 * ==========================================================
 * GET FORM DATA
 * ==========================================================
 */

function getFormData() {

    return {

        firstName:
            document.getElementById(
                "firstName"
            ).value.trim(),

        lastName:
            document.getElementById(
                "lastName"
            ).value.trim(),

        phone:
            document.getElementById(
                "phone"
            ).value.trim(),

        street:
            document.getElementById(
                "street"
            ).value.trim(),

        city:
            document.getElementById(
                "city"
            ).value.trim(),

        country:
            document.getElementById(
                "country"
            ).value.trim(),

        zip:
            document.getElementById(
                "zip"
            ).value.trim(),

        /*
         * ISO date/time of last modification
         */

        updatedAt:
            new Date().toISOString()

    };

}


/*
 * ==========================================================
 * SAVE
 * ==========================================================
 */

document.getElementById(
    "progressForm"
).addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        try {

            const data =
                getFormData();


            /*
             * EDIT
             */

            if (editId !== null) {

                data.id =
                    editId;


                await updateRecord(
                    data
                );

            }


            /*
             * NEW
             */

            else {

                await addRecord(
                    data
                );

            }


            /*
             * Show success page
             */

            document.getElementById(
                "step4-content"
            ).classList.remove("active");


            document.getElementById(
                "step5-content"
            ).classList.add("active");


            /*
             * Hide wizard progress
             */

            document.querySelector(
                ".progress-bar"
            ).style.display = "none";

        }
        catch(error) {

            console.error(error);

            alert(
                "Error saving record:\n" +
                error.message
            );

        }

    }
);


/*
 * ==========================================================
 * CANCEL
 * ==========================================================
 */

function cancelForm() {

    window.location.href =
        "index.html";

}


/*
 * ==========================================================
 * BACK TO LIST
 * ==========================================================
 */

function goBackToList() {

    window.location.href =
        "index.html";

}


/*
 * ==========================================================
 * ESCAPE HTML
 * ==========================================================
 */

function escapeHtml(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}


/*
 * ==========================================================
 * START
 * ==========================================================
 */

window.addEventListener(
    "load",
    async function() {

        try {

            await openDatabase();

            await loadEditRecord();

        }
        catch(error) {

            console.error(error);

            alert(
                "Could not open IndexedDB."
            );

        }

    }
);

</script>

</body>
</html>

---

## How it works

The application uses this IndexedDB structure:

```text
RegistrationDatabase
        │
        └── registrations
                │
                ├── id
                ├── firstName
                ├── lastName
                ├── phone
                ├── street
                ├── city
                ├── country
                ├── zip
                └── updatedAt
```

A record will look approximately like this:

```json
{
    "id": 1,
    "firstName": "John",
    "lastName": "Smith",
    "phone": "0501234567",
    "street": "Main Street 10",
    "city": "Tel Aviv",
    "country": "Israel",
    "zip": "6100001",
    "updatedAt": "2026-09-13T07:00:00.000Z"
}
```

### New

From `index.html`:

```text
+ New
   ↓
form.html
   ↓
Step 1
   ↓
Step 2
   ↓
Step 3
   ↓
Step 4 Summary
   ↓
Save
   ↓
IndexedDB
```

### Edit

Click:

```text
Edit
```

It opens:

```text
form.html?id=3
```

The program reads record `3` from IndexedDB and fills the wizard automatically.

When you press **Save**, it performs an IndexedDB `put()` instead of creating a second record.

### Delete

Click:

```text
Delete
```

You get:

```text
Delete record?

Delete John Smith?

             [ N ] [ Y ]
```

`N` cancels.

`Y` permanently deletes that IndexedDB record.

### Search

The search box searches the **whole JSON representation of every record**, so for example:

```text
john
```

finds first name, last name, etc.

And:

```text
tel aviv
```

finds the city.

And:

```text
050
```

finds the phone.

### Sorting

Click any column:

```text
ID
First Name
Last Name
Phone
Street
City
Country
ZIP
```

First click:

```text
▲
```

Second click:

```text
▼
```

---

## Running it

Put the two files in the same directory:

```text
C:\my-registration\
    index.html
    form.html
```

Then open:

```text
index.html
```

in Chrome.

The data is stored in **Chrome's IndexedDB for that browser/origin**, so closing the browser does not delete the records.

One important detail: if you simply double-click the HTML files and use `file://`, browser behavior can vary. For a reliable setup, run the folder through a small local HTTP server, for example VS Code **Live Server**. The application itself remains completely local and does not need an Internet connection.

Put the two files in the same directory:

```text
C:\my-registration\
    index.html
    form.html
```

Then open:

```text
index.html
```

in Chrome.

The data is stored in **Chrome's IndexedDB for that browser/origin**, so closing the browser does not delete the records.

One important detail: if you simply double-click the HTML files and use `file://`, browser behavior can vary. For a reliable setup, run the folder through a small local HTTP server, for example VS Code **Live Server**. The application itself remains completely local and does not need an Internet connection.
