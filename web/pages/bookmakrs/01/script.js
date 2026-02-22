let data = {};
let currentFolder = null;
let editLinkIndex = null;

const folderList = document.getElementById("folderList");
const linkList = document.getElementById("linkList");
const currentFolderTitle = document.getElementById("currentFolderTitle");

// Render folders
function renderFolders() {
    folderList.innerHTML = "";

    Object.keys(data).forEach(folder => {
        const div = document.createElement("div");
        div.className = "folder" + (folder === currentFolder ? " active" : "");
        div.textContent = folder;

        div.onclick = () => {
            currentFolder = folder;
            renderFolders();
            renderLinks();
        };

        folderList.appendChild(div);
    });
}

// Render links
function renderLinks() {
    linkList.innerHTML = "";

    if (!currentFolder) {
        currentFolderTitle.textContent = "Select a folder";
        return;
    }

    currentFolderTitle.textContent = currentFolder;

    data[currentFolder].forEach((link, index) => {
        const div = document.createElement("div");
        div.className = "link-item";

        div.innerHTML = `
            <div>
                <strong>${link.name}</strong><br>
                <a href="${link.url}" target="_blank">${link.url}</a>
            </div>
            <div class="link-actions">
                <button class="edit-btn" onclick="editLink(${index})">Edit</button>
                <button class="delete-btn" onclick="deleteLink(${index})">Delete</button>
            </div>
        `;

        linkList.appendChild(div);
    });
}

// Folder functions
function addFolder() {
    const name = prompt("Folder name:");
    if (!name || data[name]) return;

    data[name] = [];
    currentFolder = name;
    renderFolders();
    renderLinks();
}

function deleteFolder() {
    if (!currentFolder) return;

    if (confirm("Delete this folder?")) {
        delete data[currentFolder];
        currentFolder = null;
        renderFolders();
        renderLinks();
    }
}

// Link functions
function addLink() {
    if (!currentFolder) return alert("Select a folder first");

    const name = document.getElementById("linkName").value;
    const url = document.getElementById("linkURL").value;

    if (!name || !url) return;

    const newLink = { name, url };

    if (editLinkIndex !== null) {
        data[currentFolder][editLinkIndex] = newLink;
        editLinkIndex = null;
    } else {
        data[currentFolder].push(newLink);
    }

    document.getElementById("linkName").value = "";
    document.getElementById("linkURL").value = "";

    renderLinks();
}

function editLink(index) {
    const link = data[currentFolder][index];

    document.getElementById("linkName").value = link.name;
    document.getElementById("linkURL").value = link.url;

    editLinkIndex = index;
}

function deleteLink(index) {
    if (confirm("Delete this link?")) {
        data[currentFolder].splice(index, 1);
        renderLinks();
    }
}

// Export JSON
function exportData() {
    const blob = new Blob(
        [JSON.stringify(data, null, 2)],
        { type: "application/json" }
    );

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "bookmarks.json";
    link.click();
}