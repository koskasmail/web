
// debugger;
let count = 0;

let countDisplay = document.getElementById('count_display').innerHTML = count;
let count_minus = document.getElementById('count_minus');
let count_plus = document.getElementById('count_plus');

count_minus.onclick = minus;
count_plus.onclick = plus;

function valueValidation() {
    if (count <0) {
        count = 0;
    }
}

function plus() {
    count++;
    valueValidation();
    updateDispay(countDisplay);
}

function minus() {
    count--;
    valueValidation();
    updateDispay(countDisplay);
}

function updateDispay() {
    if (count < 10) {
        document.getElementById('count_display').innerHTML = "00" + count;    
    }
    else if (count < 100)
    {
        document.getElementById('count_display').innerHTML = "0" + count;    
    }
    else {
        document.getElementById('count_display').innerHTML = count;
    }

    // console.error(count);
}

updateDispay();
