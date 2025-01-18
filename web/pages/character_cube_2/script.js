document.querySelectorAll('.char-input').forEach((input, index, inputs) => {
    input.addEventListener('input', (event) => {
        // Move to the next input field if a character is entered
        if (event.target.value.length === 1 && index < inputs.length - 1) {
            inputs[index + 1].focus();
        }
    });

    input.addEventListener('keydown', (event) => {
        // Move to the previous input field if backspace is pressed
        if (event.key === 'Backspace' && index > 0 && event.target.value.length === 0) {
            inputs[index - 1].focus();
        }
    });
});

// Function to log values
function logValues() {
    const values = Array.from(document.querySelectorAll('.char-input')).map(input => input.value).join('');
    console.log(values); // Log the concatenated values
}

// Log values on button click
document.getElementById('log-button').addEventListener('click', logValues);

// Log values on Enter key press in the last input
document.querySelector('.char-input:last-child').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        logValues();
        event.preventDefault(); // Prevent form submission if in a form
    }
});
