let data = [];
let currentFolderIndex = null;
let editLinkIndex = null;

const folderList = document.getElementById("folderList");
const linkList = document.getElementById("linkList");
const currentFolderTitle = document.getElementById("currentFolderTitle");

// --------------------
// Load initial JSON if exists, else create default
// --------------------
fetch("bookmarks.json")
    .then(res => res.json())
    .then(json => {
        data = json;
        renderFolders();
    })
    .catch(() => {
        // default empty data
        data = [];
        renderFolders();
    });

// --------------------
// Render Folders
// --------------------
function renderFolders() {
    folderList.innerHTML = "";

    data.forEach((folder, index) => {
        const div = document.createElement("div");
        div.className = "folder" + (index === currentFolderIndex ? " active" : "");

        div.innerHTML = `
            <span>${folder.name}</span>
            <span>
                <button onclick="moveFolderUp(${index})">⬆</button>
                <button onclick="moveFolderDown(${index})">⬇</button>
            </span>
        `;

        div.onclick = (e) => {
            if (e.target.tagName !== "BUTTON") {
                currentFolderIndex = index;
                renderFolders();
                renderLinks();
            }
        };

        folderList.appendChild(div);
    });
}

// --------------------
// Render Links
// --------------------
function renderLinks() {
    linkList.innerHTML = "";

    if (currentFolderIndex === null) {
        currentFolderTitle.textContent = "Select a folder";
        return;
    }

    const folder = data[currentFolderIndex];
    currentFolderTitle.textContent = folder.name;

    folder.links.forEach((link, index) => {
        const div = document.createElement("div");
        div.className = "link-item";

        div.innerHTML = `
            <div>
                <strong>${link.name}</strong><br>
                <a href="${link.url}" target="_blank">${link.url}</a>
            </div>
            <div class="link-actions">
                <button onclick="moveLinkUp(${index})">⬆</button>
                <button onclick="moveLinkDown(${index})">⬇</button>
                <button class="edit-btn" onclick="editLink(${index})">Edit</button>
                <button class="delete-btn" onclick="deleteLink(${index})">Delete</button>
            </div>
        `;

        linkList.appendChild(div);
    });
}

// --------------------
// Folder Functions
// --------------------
function addFolder() {
    const name = prompt("Folder name:");
    if (!name) return;

    data.push({ name, links: [] });
    currentFolderIndex = data.length - 1;
    renderFolders();
    renderLinks();
}

function deleteFolder() {
    if (currentFolderIndex === null) return;
    if (!confirm("Delete this folder?")) return;

    data.splice(currentFolderIndex, 1);
    currentFolderIndex = null;
    renderFolders();
    renderLinks();
}

function moveFolderUp(index) {
    if (index === 0) return;
    [data[index - 1], data[index]] = [data[index], data[index - 1]];
    if (currentFolderIndex === index) currentFolderIndex = index - 1;
    renderFolders();
}

function moveFolderDown(index) {
    if (index === data.length - 1) return;
    [data[index + 1], data[index]] = [data[index], data[index + 1]];
    if (currentFolderIndex === index) currentFolderIndex = index + 1;
    renderFolders();
}

// --------------------
// Link Functions
// --------------------
function addLink() {
    if (currentFolderIndex === null) return alert("Select a folder first");

    const name = document.getElementById("linkName").value;
    const url = document.getElementById("linkURL").value;
    if (!name || !url) return;

    const folder = data[currentFolderIndex];

    if (editLinkIndex !== null) {
        folder.links[editLinkIndex] = { name, url };
        editLinkIndex = null;
    } else {
        folder.links.push({ name, url });
    }

    document.getElementById("linkName").value = "";
    document.getElementById("linkURL").value = "";

    renderLinks();
}

function editLink(index) {
    const link = data[currentFolderIndex].links[index];
    document.getElementById("linkName").value = link.name;
    document.getElementById("linkURL").value = link.url;
    editLinkIndex = index;
}

function deleteLink(index) {
    if (!confirm("Delete this link?")) return;
    data[currentFolderIndex].links.splice(index, 1);
    renderLinks();
}

function moveLinkUp(index) {
    if (index === 0) return;
    const links = data[currentFolderIndex].links;
    [links[index - 1], links[index]] = [links[index], links[index - 1]];
    renderLinks();
}

function moveLinkDown(index) {
    const links = data[currentFolderIndex].links;
    if (index === links.length - 1) return;
    [links[index + 1], links[index]] = [links[index], links[index + 1]];
    renderLinks();
}

// --------------------
// Export & Load JSON
// --------------------
function exportData() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "bookmarks.json";
    link.click();
}

// Load user JSON file
function loadJSON(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const json = JSON.parse(e.target.result);
            if (Array.isArray(json)) {
                data = json;
                currentFolderIndex = null;
                renderFolders();
                renderLinks();
            } else {
                alert("Invalid JSON format");
            }
        } catch (err) {
            alert("Error parsing JSON");
        }
    };
    reader.readAsText(file);
}