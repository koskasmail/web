async function fetchData() {
    const options = {
        method: 'GET',
        // headers: {
        // }
    };

    const res = await fetch('https://catfact.ninja/fact', options);
    const record = await res.json();

    console.log(`TIP: ${record.fact}   ...   Length: ${record.length} `);
    document.getElementById("fact").innerHTML = `<li>TIP: ${record.fact} </li> <li> Length: ${record.length} </li>`;
}

fetchData(); 
