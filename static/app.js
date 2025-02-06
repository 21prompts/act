document.addEventListener("DOMContentLoaded", function() {
    // Initialize the date and time display
    const dateTimeSpan = document.getElementById("date-time");
    setInterval(() => {
        const now = new Date();
        dateTimeSpan.textContent = now.toLocaleString();
    }, 1000);

    // Initialize other UI elements and event listeners
    // ...
});
