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
        this.tasks = [];
        this.fetchTasks();
    }

    async fetchTasks() {
        try {
            const response = await fetch('/api/tasks');
            const data = await response.json();
            this.tasks = data;
            window.app.uiManager.generateTimeSlots(); // Refresh UI
            debugLog('Tasks updated');
        } catch (err) {
            debugLog(`Error fetching tasks: ${err}`);
        }
    }

    getTaskAtTime(timeString) {
        return this.tasks.find(t => t.start_time === timeString);
    }

    getAllTasks() {
        return this.tasks;
    }

    async createTask(task) {
        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(task)
            });
            
            if (!response.ok) {
                throw new Error('Failed to create task');
            }
            
            await this.fetchTasks(); // Refresh task list
            return true;
        } catch (err) {
            debugLog(`Error creating task: ${err}`);
            return false;
        }
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
            slot.style.display = this.expanded ? 'grid' : 'none';
        });
        this.expanded = !this.expanded;
        localStorage.setItem('tasksExpanded', this.expanded);
        this.updateExpandCollapseButton();
    }

    generateTimeSlots() {
        this.dayView.textContent = '';
        const now = new Date();
        const today = now.toISOString().split('T')[0];

        for (let hour = 0; hour < 24; hour++) {
            for (let min = 0; min < 60; min += 30) {
                const timeString = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
                const slot = this.template.content.cloneNode(true).children[0];
                
                const timeElement = slot.querySelector('time');
                timeElement.textContent = timeString;
                timeElement.setAttribute('datetime', `${today}T${timeString}:00`);

                const task = this.taskManager.getTaskAtTime(timeString);
                if (task) {
                    slot.querySelector('.task-name').textContent = task.name;
                    slot.querySelector('.duration').textContent = task.duration;
                    slot.dataset.empty = 'false';
                } else {
                    slot.querySelector('.task-name').textContent = '';
                    slot.querySelector('.duration').textContent = '';
                    slot.dataset.empty = 'true';
                }

                // Set a default weather icon for slots without weather data
                const weatherIcon = slot.querySelector('.weather-icon');
                weatherIcon.src = 'icons/weather/01d.svg';
                weatherIcon.alt = 'No weather data';

                this.dayView.appendChild(slot);
            }
        }

        // Initial weather update
        if (window.app.weatherManager) {
            window.app.weatherManager.fetchWeatherData();
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
                icon.src = `icons/weather/${weather.data.icon}.svg`;
                icon.alt = weather.data.description;
            }
        });
    }

    startPolling() {
        this.fetchWeatherData();
        setInterval(() => this.fetchWeatherData(), this.pollInterval);
    }
}

class SidebarManager {
    constructor(taskManager) {
        this.sidebar = document.getElementById('sidebar');
        this.form = document.getElementById('task-form');
        this.taskManager = taskManager;
        this.setupEventListeners();
    }

    setupEventListeners() {
        const menuButton = document.getElementById('menu-button');
        const closeButton = document.getElementById('close-sidebar');
        
        menuButton.addEventListener('click', () => this.toggle());
        closeButton.addEventListener('click', () => this.close());
        
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    toggle() {
        const isHidden = this.sidebar.getAttribute('aria-hidden') === 'true';
        this.sidebar.setAttribute('aria-hidden', !isHidden);
    }

    close() {
        this.sidebar.setAttribute('aria-hidden', 'true');
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const task = {
            name: formData.get('name'),
            start_time: formData.get('start_time'),
            duration: formData.get('duration'),
            repeat: formData.get('repeat') || null
        };

        const success = await this.taskManager.createTask(task);
        if (success) {
            this.form.reset();
            this.close();
        }
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
        this.sidebarManager = new SidebarManager(this.taskManager);
        
        this.uiManager.initialize();
    }
}

// Initialize app when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    window.app = new App();
});
