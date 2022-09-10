let count = 0;
let min = 0;
let max = 10;

const countDisplay = document.getElementById('count_display');
const count_minus = document.getElementById('count_minus');
const count_plus = document.getElementById('count_plus');

function plus() {
    if (count < max )
        count++;
    updateDispay();
}

function minus() {
    if (count > min)
        count--;

    updateDispay();
}

function updateDispay() {
    countDisplay.innerHTML = count;
}

function validateValue() {
    console.log("validate value to be bigger then 0");
}

updateDispay();