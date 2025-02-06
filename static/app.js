class TimeManager {
    constructor() {
        this.dateTimeSpan = document.getElementById("date-time");
        this.progressBar = document.getElementById("day-progress-bar");
        this.setupProgressBar();
        this.startUpdates();
    }

    setupProgressBar() {
        if (!this.progressBar.querySelector('#day-progress-fill')) {
            const progressFill = document.createElement("div");
            progressFill.id = "day-progress-fill";
            this.progressBar.appendChild(progressFill);
        }
    }

    updateDateTime() {
        const now = new Date();
        const options = { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        this.dateTimeSpan.textContent = now.toLocaleString(undefined, options);
    }

    updateDayProgress() {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const progress = ((now - startOfDay) / (24 * 60 * 60 * 1000)) * 100;
        
        const progressFill = this.progressBar.querySelector('#day-progress-fill');
        progressFill.style.width = `${progress}%`;
        progressFill.setAttribute("aria-valuenow", Math.round(progress));
    }

    startUpdates() {
        this.updateDateTime();
        this.updateDayProgress();
        setInterval(() => {
            this.updateDateTime();
            this.updateDayProgress();
        }, 60000);
    }
}

class TaskManager {
    constructor() {
        this.tasks = [
            { time: '08:00', name: 'Morning Review', duration: '30m' },
            { time: '09:00', name: 'Team Standup', duration: '15m' },
            { time: '10:30', name: 'Client Meeting', duration: '1h' },
            { time: '13:00', name: 'Lunch Break', duration: '1h' },
            { time: '14:30', name: 'Project Planning', duration: '1h' },
            { time: '15:45', name: 'Code Review', duration: '45m' },
            { time: '16:30', name: 'Daily Wrap-up', duration: '30m' }
        ];
    }

    getTaskAtTime(timeString) {
        return this.tasks.find(t => t.time === timeString);
    }

    getAllTasks() {
        return this.tasks;
    }
}

class UIManager {
    constructor(taskManager) {
        this.taskManager = taskManager;
        this.dayView = document.getElementById('day-view');
        this.template = document.getElementById('time-slot-template');
        this.expandCollapseButton = document.getElementById('expand-collapse-button');
        this.expanded = localStorage.getItem('tasksExpanded') === 'true';
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.expandCollapseButton.addEventListener('click', () => this.toggleEmptySlots());
    }

    updateExpandCollapseButton() {
        const icon = this.expandCollapseButton.querySelector('img');
        const text = this.expandCollapseButton.querySelector('.button-text');
        icon.src = `icons/filled/${this.expanded ? 'collapse_all' : 'expand_all'}.svg`;
        text.textContent = this.expanded ? 'Collapse' : 'Expand';
        this.expandCollapseButton.setAttribute('aria-expanded', this.expanded);
    }

    toggleEmptySlots() {
        const emptySlots = document.querySelectorAll('.time-slot[data-empty="true"]');
        emptySlots.forEach(slot => {
            slot.style.display = this.expanded ? 'none' : 'grid';
        });
        this.expanded = !this.expanded;
        localStorage.setItem('tasksExpanded', this.expanded);
        this.updateExpandCollapseButton();
        debugLog(`View ${this.expanded ? 'expanded' : 'collapsed'}`);
    }

    generateTimeSlots() {
        this.dayView.textContent = '';
        for (let hour = 0; hour < 24; hour++) {
            for (let min = 0; min < 60; min += 30) {
                const timeString = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
                const slot = this.template.content.cloneNode(true).children[0];
                
                const timeElement = slot.querySelector('time');
                timeElement.textContent = timeString;
                timeElement.setAttribute('datetime', `2024-01-01T${timeString}:00`);

                const task = this.taskManager.getTaskAtTime(timeString);
                if (task) {
                    slot.querySelector('.task-name').textContent = task.name;
                    slot.querySelector('.duration').textContent = task.duration;
                    slot.dataset.empty = 'false';
                }

                this.dayView.appendChild(slot);
            }
        }
    }

    initialize() {
        this.generateTimeSlots();
        this.updateExpandCollapseButton();
        const emptySlots = document.querySelectorAll('.time-slot[data-empty="true"]');
        emptySlots.forEach(slot => {
            slot.style.display = this.expanded ? 'grid' : 'none';
        });
    }
}

class WeatherManager {
    constructor() {
        this.pollInterval = 5 * 60 * 1000; // 5 minutes
        this.startPolling();
    }

    async fetchWeatherData() {
        try {
            const response = await fetch('/api/weather');
            const data = await response.json();
            this.updateWeatherIcons(data);
            debugLog('Weather data updated');
        } catch (err) {
            debugLog(`Weather fetch error: ${err}`);
        }
    }

    updateWeatherIcons(data) {
        const slots = document.querySelectorAll('.time-slot');
        slots.forEach(slot => {
            const time = slot.querySelector('time').getAttribute('datetime');
            const hour = new Date(time).getHours();
            const weather = data.find(w => w.hour === hour);
            if (weather) {
                const icon = slot.querySelector('.weather-icon');
                icon.src = `icons/filled/${weather.data}.svg`;
                icon.alt = weather.description || '';
            }
        });
    }

    startPolling() {
        this.fetchWeatherData();
        setInterval(() => this.fetchWeatherData(), this.pollInterval);
    }
}

class App {
    constructor() {
        this.debug = new URLSearchParams(window.location.search).has('debug');
        window.debugLog = this.debug ? 
            (msg) => console.log(`[DEBUG] ${msg}`) : 
            () => {};
            
        this.taskManager = new TaskManager();
        this.timeManager = new TimeManager();
        this.uiManager = new UIManager(this.taskManager);
        this.weatherManager = new WeatherManager();
        
        this.uiManager.initialize();
    }
}

// Initialize app when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    window.app = new App();
});
