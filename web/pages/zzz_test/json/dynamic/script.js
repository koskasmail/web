fetch('data.json')
    .then(response => response.json())
    .then(data => {
        fetch('template.json')
            .then(response => response.json())
            .then(template => {
                const container = document.getElementById("user-container");

                function createElement(node) {
                    const element = document.createElement(node.tag);
                    if (node.id) element.id = node.id;
                    if (node.class) element.className = node.class;
                    if (node.content) element.textContent = node.content;
                    if (node.id && data[node.id]) element.textContent = data[node.id];

                    if (node.children) {
                        node.children.forEach(child => {
                            element.appendChild(createElement(child));
                        });
                    }

                    return element;
                }

                template.tree.forEach(node => {
                    container.appendChild(createElement(node));
                });
            });
    })
    .catch(error => console.error("Error loading JSON:", error));
