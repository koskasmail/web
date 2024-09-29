function calculateTime() {
    // Get the values from the input fields
    const fromDate = document.getElementById('fromDate').value;
    const fromHour = document.getElementById('fromHour').value;
    const toDate = document.getElementById('toDate').value;
    const toHour = document.getElementById('toHour').value;

    // Combine date and time into a single string and convert to Date objects
    const fromDateTime = new Date(`${fromDate}T${fromHour}`);
    const toDateTime = new Date(`${toDate}T${toHour}`);

    // Calculate the difference in milliseconds
    const diffInMs = toDateTime - fromDateTime;

    // Check if the difference is negative
    if (diffInMs < 0) {
        document.getElementById('result').innerText = "Error: 'To' date and time must be after 'From' date and time.";
        return;
    }

    // Convert milliseconds to hours and minutes
    const diffInMinutes = Math.floor(diffInMs / 1000 / 60);
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;

    // Display the result
    document.getElementById('result').innerText = `${hours} hour(s) and ${minutes} minute(s) passed.`;
}
