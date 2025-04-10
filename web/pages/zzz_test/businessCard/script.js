let data = [];
let currentIndex = 0;

const fullName = document.getElementById("fullName");
const phone = document.getElementById("phone");
const department = document.getElementById("department");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

async function loadData() {
  const response = await fetch("data.json");
  data = await response.json();
  displayCard(currentIndex);
}

function displayCard(index) {
  const person = data[index];
  fullName.textContent = `${person.firstName} ${person.lastName}`;
  phone.textContent = person.phone;
  department.textContent = person.department;
}

prevBtn.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + data.length) % data.length;
  displayCard(currentIndex);
});

nextBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % data.length;
  displayCard(currentIndex);
});

loadData();
