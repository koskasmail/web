async function fetchData() {
    const options = {
        method: 'GET',
        // headers: {
        // }
    };

    const res = await fetch('https://dog.ceo/api/breeds/image/random', options);
    const record = await res.json();

    console.log(`TIP: ${record.message}   `);
    document.getElementById("url").innerHTML = `<li>TIP: ${record.message} </li>
    <li><img src="${record.message}" alt="" width="30%"> </li> `;
}

fetchData(); 
