// script.js

// Fetch the JSON file
fetch('data.json')
  .then(response => response.json())
  .then(data => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lettersContainer = document.getElementById("letters");

    // Dynamically generate the A-Z sidebar
    letters.split("").forEach(letter => {
      const li = document.createElement("li");
      li.textContent = letter;
      li.addEventListener("click", () => {
        highlightLetter(li);
        filterEntries(data, letter);
      });
      lettersContainer.appendChild(li);
    });

    // Last name - Sort and display all entries on load
    ///const sortedData = [...data].sort((a, b) => a.lastName.localeCompare(b.lastName));

    // first Name - Sorting: The sortedData array is now sorted by the firstName property
    const sortedData = [...data].sort((a, b) => a.firstName.localeCompare(b.firstName));

    populateEntries(sortedData);




    // Function to highlight selected letter
    function highlightLetter(selectedLi) {
      // Remove the 'selected' class from all letters
      const allLetters = lettersContainer.querySelectorAll("li");
      allLetters.forEach(li => li.classList.remove("selected"));

      // Add the 'selected' class to the clicked letter
      selectedLi.classList.add("selected");
    }

    // Filter entries by the first letter of last name
    function filterEntries(data, letter) {

      ///lastName
      ///const filteredData = data.filter(entry => entry.lastName.startsWith(letter));

      ///firstName
      const filteredData = data.filter(entry => entry.firstName.startsWith(letter));


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
