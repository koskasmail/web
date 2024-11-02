document.addEventListener("DOMContentLoaded", function() {
    fetch('subjects.json')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('subjects-container');
            data.subjects.forEach(subject => {
                const subjectDiv = document.createElement('div');
                subjectDiv.className = 'subject';

                const subjectTitle = document.createElement('h2');
                subjectTitle.textContent = subject.name;
                subjectDiv.appendChild(subjectTitle);

                const linksList = document.createElement('ul');
                linksList.className = 'links';
                
                subject.links.forEach(link => {
                    const listItem = document.createElement('li');
                    const anchor = document.createElement('a');
                    anchor.href = link.url;
                    anchor.textContent = link.title;
                    anchor.target = '_blank'; // Opens link in new tab
                    listItem.appendChild(anchor);
                    linksList.appendChild(listItem);
                });

                subjectDiv.appendChild(linksList);
                container.appendChild(subjectDiv);
            });
        })
        .catch(error => console.error('Error fetching the JSON:', error));
});
