document.addEventListener("DOMContentLoaded", function() {
    // Initialize the date and time display with minutes precision
    const dateTimeSpan = document.getElementById("date-time");
    function updateDateTime() {
        const now = new Date();
        const options = { 
            weekday: 'short', 
            month: 'short', 
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

    // Placeholder tasks data
    const placeholderTasks = [
        { time: '08:00', name: 'Morning Review', duration: '30m' },
        { time: '09:00', name: 'Team Standup', duration: '15m' },
        { time: '10:30', name: 'Client Meeting', duration: '1h' },
        { time: '13:00', name: 'Lunch Break', duration: '1h' },
        { time: '14:30', name: 'Project Planning', duration: '1h' },
        { time: '15:45', name: 'Code Review', duration: '45m' },
        { time: '16:30', name: 'Daily Wrap-up', duration: '30m' }
    ];

    // Generate time slots
    function generateTimeSlots() {
        const dayView = document.getElementById('day-view');
        const template = document.getElementById('time-slot-template');
        dayView.textContent = ''; // Clear existing slots

        // Generate slots for each 30-minute increment
        for (let hour = 0; hour < 24; hour++) {
            for (let min = 0; min < 60; min += 30) {
                const timeString = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
                const slot = template.content.cloneNode(true).children[0];
                
                const timeElement = slot.querySelector('time');
                timeElement.textContent = timeString;
                timeElement.setAttribute('datetime', `2024-01-01T${timeString}:00`);

                // Check if there's a task for this time
                const task = placeholderTasks.find(t => t.time === timeString);
                if (task) {
                    slot.querySelector('.task-name').textContent = task.name;
                    slot.querySelector('.duration').textContent = task.duration;
                    slot.dataset.empty = 'false';
                }

                dayView.appendChild(slot);
            }
        }
    }

    // Handle expand/collapse with localStorage
    const expandCollapseButton = document.getElementById('expand-collapse-button');
    let expanded = localStorage.getItem('tasksExpanded') === 'true';

    function updateExpandCollapseButton() {
        const icon = expandCollapseButton.querySelector('img');
        const text = expandCollapseButton.querySelector('.button-text');
        icon.src = `icons/filled/${expanded ? 'collapse_all' : 'expand_all'}.svg`;
        text.textContent = expanded ? 'Collapse' : 'Expand';
        expandCollapseButton.setAttribute('aria-expanded', expanded);
    }

    function toggleEmptySlots() {
        const emptySlots = document.querySelectorAll('.time-slot[data-empty="true"]');
        emptySlots.forEach(slot => {
            slot.style.display = expanded ? 'none' : 'grid';
        });
        expanded = !expanded;
        localStorage.setItem('tasksExpanded', expanded);
        updateExpandCollapseButton();
        debugLog(`View ${expanded ? 'expanded' : 'collapsed'}`);
    }

    function applyInitialState() {
        const emptySlots = document.querySelectorAll('.time-slot[data-empty="true"]');
        emptySlots.forEach(slot => {
            slot.style.display = expanded ? 'grid' : 'none';
        });
        updateExpandCollapseButton();
        debugLog(`Initial view ${expanded ? 'expanded' : 'collapsed'}`);
    }

    expandCollapseButton.addEventListener('click', toggleEmptySlots);

    // Initialize the view
    generateTimeSlots();
    applyInitialState();
    // Initialize other UI elements and event listeners
    // ...
});
