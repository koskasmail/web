function loadPage(page) {
    fetch(page)
    .then(response => response.text())
    .then(content => {
        document.getElementById('content').innerHTML = content;
        if(page == `page1.html`)
        {
            document.getElementById("pageTitle").innerHTML = "Dev";
        }
        if(page == `page2.html`)
        {
            document.getElementById("pageTitle").innerHTML = "Test";
        }
        if(page == `page3.html`)
        {
            document.getElementById("pageTitle").innerHTML = "Prod";
        }
    })
    .catch(err => console.log('Error loading page:', err));
}
