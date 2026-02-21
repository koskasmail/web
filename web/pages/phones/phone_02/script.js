const phoneList = document.getElementById("phoneList");
let contacts = [];
let editIndex = null;

// Load initial JSON
fetch("phone.json")
    .then(res => res.json())
    .then(data => {
        contacts = data;
        renderContacts();
    });

// Render contacts
function renderContacts() {
    phoneList.innerHTML = "";

    contacts.sort((a, b) =>
        (a["last-name"] + a["first-name"])
        .localeCompare(b["last-name"] + b["first-name"])
    );

    contacts.forEach((contact, index) => {

        const row = document.createElement("div");
        row.className = "contact";

        row.innerHTML = `
            <div class="contact-info">
                <strong>${contact["first-name"]} ${contact["last-name"]}</strong><br>
                📞 ${contact.phone} | 📱 ${contact.cell}
            </div>
            <div class="contact-actions">
                <button class="edit-btn" onclick="editContact(${index})">Edit</button>
                <button class="delete-btn" onclick="deleteContact(${index})">Delete</button>
            </div>
        `;

        phoneList.appendChild(row);
    });
}

// Add or Update
document.getElementById("addForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const newContact = {
        "first-name": firstName.value,
        "last-name": lastName.value,
        "phone": phone.value,
        "cell": cell.value
    };

    if (editIndex !== null) {
        contacts[editIndex] = newContact;
        editIndex = null;
    } else {
        contacts.push(newContact);
    }

    this.reset();
    showView();
    renderContacts();
});

// Edit contact
function editContact(index) {
    const c = contacts[index];

    firstName.value = c["first-name"];
    lastName.value = c["last-name"];
    phone.value = c.phone;
    cell.value = c.cell;

    editIndex = index;
    showAdd();
}

// Delete contact
function deleteContact(index) {
    if (confirm("Delete this contact?")) {
        contacts.splice(index, 1);
        renderContacts();
    }
}

// Export updated JSON
function exportJSON() {
    const blob = new Blob(
        [JSON.stringify(contacts, null, 2)],
        { type: "application/json" }
    );

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "phone.json";
    link.click();
}

// Navigation
function showView() {
    document.getElementById("viewSection").style.display = "block";
    document.getElementById("addSection").style.display = "none";
}

function showAdd() {
    document.getElementById("viewSection").style.display = "none";
    document.getElementById("addSection").style.display = "block";
}