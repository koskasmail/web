const phoneList = document.getElementById("phoneList");
const tooltip = document.getElementById("tooltip");
let contacts = [];
let editIndex = null;
let editMode = false;

// Load JSON
fetch("phone.json")
    .then(res => res.json())
    .then(data => {
        contacts = data;
        renderContacts();
    });

// Render contacts
function renderContacts() {
    phoneList.innerHTML = "";

    contacts.sort((a, b) => {
        return (a["last-name"] + a["first-name"])
            .localeCompare(b["last-name"] + b["first-name"]);
    });

    contacts.forEach((contact, index) => {
        const fullName = contact["first-name"] + " " + contact["last-name"];

        const row = document.createElement("div");
        row.className = "contact";

        row.innerHTML = `
            <div>
                <strong>${fullName}</strong><br>
                ${contact.phone}
            </div>
            ${editMode ? `
                <div>
                    <button onclick="editContact(${index})">Edit</button>
                    <button onclick="deleteContact(${index})">Delete</button>
                </div>
            ` : ""}
        `;

        // Tooltip
        row.addEventListener("mousemove", e => {
            tooltip.style.opacity = 1;
            tooltip.style.left = e.pageX + 15 + "px";
            tooltip.style.top = e.pageY + 15 + "px";
            tooltip.innerHTML = `
                <strong>${fullName}</strong><br>
                📞 Office: ${contact.phone}<br>
                📱 Cell: ${contact.cell}
            `;
        });

        row.addEventListener("mouseleave", () => {
            tooltip.style.opacity = 0;
        });

        phoneList.appendChild(row);
    });
}

// Sidebar Controls
function showView() {
    document.getElementById("viewSection").style.display = "block";
    document.getElementById("addSection").style.display = "none";
    editMode = false;
    renderContacts();
}

function showAdd() {
    document.getElementById("viewSection").style.display = "none";
    document.getElementById("addSection").style.display = "block";
    editIndex = null;
}

function enableEditMode() {
    showView();
    editMode = true;
    renderContacts();
}

// Add or Update contact
document.getElementById("addForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const newContact = {
        "first-name": document.getElementById("firstName").value,
        "last-name": document.getElementById("lastName").value,
        "phone": document.getElementById("phone").value,
        "cell": document.getElementById("cell").value
    };

    if (editIndex !== null) {
        contacts[editIndex] = newContact;
        editIndex = null;
    } else {
        contacts.push(newContact);
    }

    this.reset();
    showView();
});

// Edit Contact
function editContact(index) {
    const contact = contacts[index];

    document.getElementById("firstName").value = contact["first-name"];
    document.getElementById("lastName").value = contact["last-name"];
    document.getElementById("phone").value = contact["phone"];
    document.getElementById("cell").value = contact["cell"];

    editIndex = index;
    showAdd();
}

// Delete Contact (Exit from list)
function deleteContact(index) {
    if (confirm("Delete this contact?")) {
        contacts.splice(index, 1);
        renderContacts();
    }
}