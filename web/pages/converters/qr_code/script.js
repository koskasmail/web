function generateQR() {
    var myUrl = document.getElementById("url").value;
    if (myUrl) {
        // clean old result (if exist)
        document.getElementById('output').innerText = "";
        var qrcode = new QRCode(document.getElementById("output"), {
            text: myUrl,
            width: 200,
            height: 200,
        });
    } else {
        alert("Please enter a URL!");
    }
}

function clearQR() {
    // clear url
    var txt = document.getElementById('url');
    txt.value = "";
    txt.focus();

    // clear result
    document.getElementById('output').innerText = " ";
}

function first() {
    document.getElementById('output').innerText = "";
    var qrcode = new QRCode(document.getElementById("output"), {
        text: "https://koskasmail.github.io/web/web/pages/converters/qr_code/",
        width: 200,
        height: 200,
    });
}

document.addEventListener('DOMContentLoaded', function () {
    first(); // Call your first function when the DOM content is fully loaded
});
