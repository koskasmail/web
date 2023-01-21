async function fetchData() {
    const options = {
        method: 'GET',
        headers: {
        }
    };

    const res = await fetch('https://api.publicapis.org/entries', options)
    const record = await res.json()

    // document.getElementById("data").innerHTML = record.data.map(item => `<li>${item.API}</li>`).join('');

    // document.getElementById("data").innerHTML = record.data.map(item => `<li>${item.API}</li>`).join('');
    
    // document.getElementById("concerts").innerHTML = record.data.map(item => `<li>${item.API}</li> 
    // <li>${item.Description}</li> 
    // <li>${item.Auth}</li> 
    // <li>${item.HTTPS}</li> 
    // <li>${item.Cors}</li> 
    // <li>${item.Link}</li> 
    // <li>${item.Category}</li>` 
    // ).join('');

    console.table([record]);
}

fetchData(); 
