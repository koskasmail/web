

let request = new XMLHttpRequest();
request.open("GET","http://gnituvtest01/FileNetWebApi/api/FilenetApi/GetDocument?id={046DEFF9-AB40-4636-8579-19793DB1EAC5} ");
request.send();
request.onload = () => {
    console.log(request);
    if (request.status === 200) {
        console.log(JSON.parse(request.response));
    }
    else {
        console.error(`error ${request.status} ${request.statusText}`);
    }
}
