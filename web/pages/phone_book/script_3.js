// script.js

// Fetch the JSON file
fetch('data.json')
  .then(response => response.json())
  .then(data => {
    // Dynamically generate the A-Z sidebar
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lettersContainer = document.getElementById("letters");
    letters.split("").forEach(letter => {
      const li = document.createElement("li");
      li.textContent = letter;
      li.addEventListener("click", () => filterEntries(data, letter));
      lettersContainer.appendChild(li);
    });

    // Sort and display all entries on load
    const sortedData = [...data].sort((a, b) => a.lastName.localeCompare(b.lastName));
    populateEntries(sortedData);

    // Filter entries by the first letter of last name
    function filterEntries(data, letter) {
      const filteredData = data.filter(entry => entry.lastName.startsWith(letter));
      populateEntries(filteredData);
    }

    // Populate the phone book with entries
    function populateEntries(entries) {
      const entriesContainer = document.getElementById("entries");
      entriesContainer.innerHTML = ""; // Clear previous entries
      entries.forEach(entry => {
        const li = document.createElement("li");
        li.textContent = `${entry.firstName} ${entry.lastName}, ${entry.phone}, ${entry.city}, ${entry.state}`;
        entriesContainer.appendChild(li);
      });
    }
  })
  .catch(error => console.error('Error fetching data:', error));
