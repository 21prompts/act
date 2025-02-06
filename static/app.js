document.addEventListener("DOMContentLoaded", function() {
    // Initialize the date and time display
    const dateTimeSpan = document.getElementById("date-time");
    setInterval(() => {
        const now = new Date();
        dateTimeSpan.textContent = now.toLocaleString();
    }, 1000);

    // Day progress calculation
    function updateDayProgress() {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const progress = ((now - startOfDay) / (24 * 60 * 60 * 1000)) * 100;
        
        const progressBar = document.getElementById("day-progress-bar");
        const progressFill = document.createElement("div");
        progressFill.id = "day-progress-fill";
        progressFill.style.width = `${progress}%`;
        progressFill.setAttribute("role", "progressbar");
        progressFill.setAttribute("aria-valuenow", Math.round(progress));
        progressFill.setAttribute("aria-valuemin", "0");
        progressFill.setAttribute("aria-valuemax", "100");
        
        progressBar.innerHTML = '';
        progressBar.appendChild(progressFill);
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
