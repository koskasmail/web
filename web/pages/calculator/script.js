// script.js
function clearDisplay() {
    document.getElementById('display').value = '';
}

function appendToDisplay(value) {
    document.getElementById('display').value += value;
}

function calculate() {
    try {
        const display = document.getElementById('display');
        display.value = eval(display.value);

        // let result = Function("return " + display.value);
        // console.log(result);
    } catch (e) {
        alert('Invalid Expression');
    }
}
