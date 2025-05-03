fetch('data.json')
    .then(response => response.json())
    .then(users => {
        const container = document.getElementById("user-container");

        users.forEach(user => {
            const userDiv = document.createElement("div");
            userDiv.className = `user-card ${user.size}`;
            userDiv.id = user.id;

            userDiv.innerHTML = `
                <h2>${user.name}</h2>
                <p><strong>Phone:</strong> ${user.phone}</p>
                <p><strong>Address:</strong> ${user.address}</p>
            `;

            container.appendChild(userDiv);
        });
    })
    .catch(error => console.error("Error loading JSON:", error));
