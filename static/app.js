document.addEventListener("DOMContentLoaded", function() {
    // Initialize the date and time display with minutes precision
    const dateTimeSpan = document.getElementById("date-time");
    function updateDateTime() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        dateTimeSpan.textContent = now.toLocaleString(undefined, options);
    }
    updateDateTime();
    setInterval(updateDateTime, 60000); // Update every minute

    // Day progress calculation
    function updateDayProgress() {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const progress = ((now - startOfDay) / (24 * 60 * 60 * 1000)) * 100;
        
        const progressBar = document.getElementById("day-progress-bar");
        if (!progressBar.querySelector('#day-progress-fill')) {
            const progressFill = document.createElement("div");
            progressFill.id = "day-progress-fill";
            progressBar.appendChild(progressFill);
        }
        
        const progressFill = progressBar.querySelector('#day-progress-fill');
        progressFill.style.width = `${progress}%`;
        progressFill.setAttribute("aria-valuenow", Math.round(progress));
    }

    // Update progress every minute
    updateDayProgress();
    setInterval(updateDayProgress, 60000);

    // Debug logging
    const debug = new URLSearchParams(window.location.search).has('debug');
    if (debug) {
        window.debugLog = (msg) => console.log(`[DEBUG] ${msg}`);
    } else {
        window.debugLog = () => {};
    }

    // Initialize weather icons
    function updateWeatherIcons(data) {
        debugLog('Updating weather icons');
        const dayView = document.getElementById("day-view");
        // Implementation will depend on weather data structure
    }

    // Initialize other UI elements and event listeners
    // ...
});
