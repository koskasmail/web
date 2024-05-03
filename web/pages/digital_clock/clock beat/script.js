const idHour = document.getElementById("hour");
const idMinutes = document.getElementById("minutes");
const idSeconds = document.getElementById("seconds");

function updateClock() {
    let hh = new Date().getHours();
    let mm = new Date().getMinutes();
    let ss = new Date().getSeconds();

    // if hh < 0 add 0 .
    hh = hh < 10 ? "0" + hh : hh;
    mm = mm < 10 ? "0" + mm : mm;
    ss = ss < 10 ? "0" + ss : ss;

    idHour.innerText = hh;
    idMinutes.innerText = mm;
    idSeconds.innerHTML = ss;

    //excute again after 1 sec (1000-ms)
    setTimeout(() => {
        updateClock();
    }, 1000);
}

updateClock();
