// PWA registration
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/static/sw.js')
        .then(registration => console.log('ServiceWorker registered'))
        .catch(err => console.error('ServiceWorker registration failed:', err));
}

// Basic UI handlers
document.getElementById('menuBtn').addEventListener('click', () => {
    document.getElementById('menu').classList.toggle('open');
});

document.getElementById('refreshPwa').addEventListener('click', async () => {
    if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (let registration of registrations) {
            await registration.unregister();
        }
        window.location.reload();
    }
});

// Initialize WebSocket connection
const ws = new WebSocket(`ws://${window.location.host}/api/ws`);
ws.onmessage = event => {
    // Handle updates from server
    console.log('WebSocket message:', event.data);
};

// State management
const state = {
    currentDate: new Date(),
    tasks: [],
    currentTask: null
};

// Date formatting
function formatDateTime(date) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];

    return `${hours}:${minutes} ${dayName}, ${day} ${month}`;
}

// Update current time
function updateDateTime() {
    const now = new Date();
    const timeElement = document.getElementById('currentDate');
    timeElement.textContent = formatDateTime(now);
    timeElement.setAttribute('datetime', now.toISOString());
}

// Add task modal
function showAddTaskModal() {
    document.getElementById('addTaskModal').classList.add('open');
    document.getElementById('modalBackdrop').classList.add('open');

    // Set current time as default
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    document.getElementById('taskTime').value = timeStr;
    const defaultDuration = 30;
    document.getElementById('durationSlider').value = defaultDuration;
    updateDurationFromSlider(defaultDuration, true);
}

function closeAddTaskModal() {
    document.getElementById('addTaskModal').classList.remove('open');
    document.getElementById('modalBackdrop').classList.remove('open');
}

// Add task form handler
document.getElementById('addTaskForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const task = {
        time: document.getElementById('taskTime').value,
        name: document.getElementById('taskName').value.trim(),
        duration: document.getElementById('taskDuration').value,
        elapsedTime: 0, // Add elapsed time tracking
        done: false,
        current: false
    };

    if (!task.name) return;

    state.tasks.push(task);
    await saveTasks(state.currentDate);
    closeAddTaskModal();
    renderTasks();

    // Reset form
    e.target.reset();
});

// Button handlers
document.getElementById('addTask').addEventListener('click', showAddTaskModal);
document.getElementById('modalBackdrop').addEventListener('click', closeAddTaskModal);

// Sidebar
document.addEventListener('click', (e) => {
    const menu = document.getElementById('menu');
    const menuBtn = document.getElementById('menuBtn');

    if (!menu.contains(e.target) && !menuBtn.contains(e.target) && menu.classList.contains('open')) {
        menu.classList.remove('open');
    }
});

// Date navigation
function formatDate(date) {
    return date.toISOString().split('T')[0];
}

async function loadTasks(date) {
    const response = await fetch(`/api/tasks/${formatDate(date)}`);
    state.tasks = await response.json();
    renderTasks();
    updateProgress();
}

// Save tasks to server
async function saveTasks(date) {
    try {
        const response = await fetch(`/api/tasks/${formatDate(date)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(state.tasks)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // If offline, register for background sync
        if (!navigator.onLine) {
            const registration = await navigator.serviceWorker.ready;
            await registration.sync.register('sync-tasks');
        }
    } catch (error) {
        console.error('Error saving tasks:', error);
        // Store changes locally for later sync
        await storePendingChange(date, state.tasks);
    }
}

// UI Updates
function renderTasks() {
    const list = document.getElementById('taskList');
    list.innerHTML = state.tasks.map((task, index) => `
        <div class="task ${getTaskStatus(task)}" 
             data-index="${index}"
             onclick="handleTaskClick(${index})"
             oncontextmenu="handleTaskLongPress(event, ${index})">
            <input type="checkbox" ${task.done ? 'checked' : ''}>
            <span class="time">${task.time}</span>
            <span class="name">${task.name}</span>
            ${task.duration ? `<span class="duration">(${task.duration})</span>` : ''}
        </div>
    `).join('');
}

function getTaskStatus(task) {
    if (task.done) return 'done';
    if (task.current) return 'current';

    const now = new Date();
    const taskTime = new Date(state.currentDate);
    const [hours, minutes] = task.time.split(':');
    taskTime.setHours(parseInt(hours), parseInt(minutes));

    if (taskTime > now) return 'pending';
    return 'overdue';
}

function updateProgress() {
    // Update day progress
    const now = new Date();
    const dayProgress = (now.getHours() * 60 + now.getMinutes()) / (24 * 60) * 100;
    document.querySelector('.day-progress').style.width = `${dayProgress}%`;

    // Update task progress
    const totalTasks = state.tasks.length;
    const completedTasks = state.tasks.filter(t => t.done).length;
    const taskProgress = totalTasks ? (completedTasks / totalTasks * 100) : 0;
    document.querySelector('.task-progress').style.width = `${taskProgress}%`;
}

// Task interactions
async function handleTaskClick(index) {
    const task = state.tasks[index];

    if (formatDate(state.currentDate) !== formatDate(new Date())) {
        enableTaskEdit(index);
        return;
    }

    // Handle checkbox clicks
    if (event.target.type === 'checkbox') {
        toggleTaskCompletion(index, event.target.checked);
        return;
    }

    // Don't switch if clicking the same current task
    if (task.current) return;

    // Save progress of current task if timer is running
    if (state.currentTask?.current && taskTimer.interval) {
        const currentIndex = state.tasks.findIndex(t => t.current);
        if (currentIndex >= 0) {
            const totalElapsed = taskTimer.accumulated + taskTimer.elapsed;
            state.tasks[currentIndex].elapsedTime = totalElapsed;
            state.tasks[currentIndex].duration = `${Math.ceil(totalElapsed / 60)}min`;
        }
        stopTaskTimer();
        document.getElementById('playPause').textContent = '▶';
    }

    // Switch to new task
    if (state.currentTask) {
        state.currentTask.current = false;
    }
    state.currentTask = task;
    state.tasks.forEach(t => t.current = false);
    task.current = true;
    document.getElementById('currentTask').textContent = task.name;
    updateMediaSession(task);
    renderTasks();
    await saveTasks(state.currentDate);
}

function handleTaskLongPress(event, index) {
    event.preventDefault();
    if (formatDate(state.currentDate) === formatDate(new Date())) {
        enableTaskEdit(index);
    }
}

function enableTaskEdit(index) {
    const task = state.tasks[index];
    const taskEl = document.querySelector(`[data-index="${index}"]`);
    taskEl.innerHTML = `
        <input type="time" value="${task.time}">
        <input type="text" value="${task.name}">
        <input type="text" value="${task.duration || ''}" placeholder="duration">
    `;
}

// Media API integration
function updateMediaSession(task) {
    if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: task.name,
            artist: `Started at ${task.time}`,
            album: 'Daily Schedule'
        });
    }
}

// Gestures
let touchStart = null;
document.addEventListener('touchstart', e => {
    touchStart = e.touches[0].clientX;
});

document.addEventListener('touchend', async e => {
    if (!touchStart) return;

    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchEnd - touchStart;

    if (Math.abs(diff) > 100) {
        if (state.currentTask?.current && taskTimer.interval) {
            const elapsed = Math.ceil((Date.now() - taskTimer.startTime) / 60000);
            state.currentTask.duration = `${elapsed}min`;
            stopTaskTimer();
            document.getElementById('playPause').textContent = '▶';
            await saveTasks(state.currentDate);
        }

        if (diff > 0) {
            state.currentDate.setDate(state.currentDate.getDate() - 1);
        } else {
            state.currentDate.setDate(state.currentDate.getDate() + 1);
        }
        loadTasks(state.currentDate);
    }
    touchStart = null;
});

// Initialize
document.getElementById('todayLink').addEventListener('click', () => {
    if (state.currentTask?.current && taskTimer.interval) {
        const elapsed = Math.ceil((Date.now() - taskTimer.startTime) / 60000);
        state.currentTask.duration = `${elapsed}min`;
        stopTaskTimer();
        document.getElementById('playPause').textContent = '▶';
        saveTasks(state.currentDate);
    }
    state.currentDate = new Date();
    loadTasks(state.currentDate);
});

document.getElementById('playPause').addEventListener('click', () => {
    if (state.currentTask) {
        const button = document.getElementById('playPause');
        if (button.textContent === '▶') {
            button.textContent = '⏸';
            startTaskTimer();
        } else {
            button.textContent = '▶';
            stopTaskTimer();
        }
    }
});

// Add next task button handler
document.getElementById('nextTask').addEventListener('click', () => {
    if (!state.currentTask) return;

    const currentIndex = state.tasks.findIndex(t => t.current);
    if (currentIndex >= 0) {
        toggleTaskCompletion(currentIndex, true);

        // Move to next task if available
        if (currentIndex < state.tasks.length - 1) {
            handleTaskClick(currentIndex + 1);
        } else {
            // Reset play button state when no more tasks
            document.getElementById('playPause').textContent = '▶';
            stopTaskTimer();
            state.currentTask = null;
            document.getElementById('currentTask').textContent = '';
        }
    }
});

// Initial load
loadTasks(state.currentDate);
setInterval(updateProgress, 60000); // Update progress every minute

// Initialize clock
updateDateTime();
setInterval(updateDateTime, 1000);

const DURATION_STEPS = [5, 10, 15, 20, 30, 45, 60, 90, 120, 150, 180];

// Duration controls
function updateDurationFromSlider(minutes, snap = true) {
    if (snap) {
        // Find closest step
        minutes = DURATION_STEPS.reduce((prev, curr) =>
            Math.abs(curr - minutes) < Math.abs(prev - minutes) ? curr : prev
        );
        document.getElementById('durationSlider').value = minutes;
    }

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    let durationText = '';

    if (hours > 0) {
        if (mins === 0) {
            durationText = hours + 'hr';
        } else if (mins === 30) {
            durationText = hours + '.5hr';
        } else {
            durationText = mins + 'min';
        }
    } else {
        durationText = mins + 'min';
    }

    document.getElementById('taskDuration').value = durationText;
    document.getElementById('durationDisplay').textContent = `${minutes} min`;
}

function updateSliderFromDuration(text) {
    const hrMatch = text.match(/^(\d+(?:\.\d+)?)hr$/);
    const minMatch = text.match(/^(\d+)min$/);
    let minutes = 30; // default

    if (hrMatch) {
        minutes = Math.round(parseFloat(hrMatch[1]) * 60);
    } else if (minMatch) {
        minutes = parseInt(minMatch[1]);
    } else {
        // Try to parse just the number
        const numMatch = text.match(/^(\d+(?:\.\d+)?)$/);
        if (numMatch) {
            minutes = parseInt(numMatch[1]);
        }
    }

    minutes = Math.min(Math.max(minutes, 5), 180);
    // Always snap on blur/change to maintain consistent steps
    updateDurationFromSlider(minutes, true);
}

// Event listeners for duration controls
document.getElementById('durationSlider').addEventListener('input', (e) => {
    const minutes = parseInt(e.target.value);
    updateDurationFromSlider(minutes, true);
});

document.getElementById('durationSlider').addEventListener('change', (e) => {
    const minutes = parseInt(e.target.value);
    updateDurationFromSlider(minutes, true);
});

document.getElementById('taskDuration').addEventListener('change', (e) => {
    updateSliderFromDuration(e.target.value);
});

document.getElementById('taskDuration').addEventListener('blur', (e) => {
    updateSliderFromDuration(e.target.value);
});

// Task timing state
const taskTimer = {
    startTime: null,
    interval: null,
    elapsed: 0,
    accumulated: 0 // Add accumulated time tracking
};

// Update task completion
function toggleTaskCompletion(index, completed) {
    const task = state.tasks[index];
    task.done = completed;

    if (task.current && completed) {
        if (taskTimer.interval) {
            const totalElapsed = taskTimer.accumulated + taskTimer.elapsed;
            task.duration = `${Math.ceil(totalElapsed / 60)}min`;
            stopTaskTimer();
        } else if (task.elapsedTime) {
            task.duration = `${Math.ceil(task.elapsedTime / 60)}min`;
        }
    }

    saveTasks(state.currentDate);
    renderTasks();
    updateProgress();
}

// Task timer functions
function startTaskTimer() {
    if (!state.currentTask) return;

    taskTimer.startTime = Date.now();
    taskTimer.elapsed = 0;
    taskTimer.accumulated = state.currentTask.elapsedTime || 0; // Resume from previous elapsed time

    taskTimer.interval = setInterval(() => {
        taskTimer.elapsed = Math.floor((Date.now() - taskTimer.startTime) / 1000);
        const totalElapsed = taskTimer.accumulated + taskTimer.elapsed;
        state.currentTask.elapsedTime = totalElapsed;
        updateTimerDisplay(totalElapsed);
    }, 1000);
}

function stopTaskTimer() {
    if (taskTimer.interval) {
        // Save accumulated time when stopping
        if (state.currentTask) {
            state.currentTask.elapsedTime = taskTimer.accumulated + taskTimer.elapsed;
        }
        clearInterval(taskTimer.interval);
        taskTimer.interval = null;
    }
}

function updateTimerDisplay(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const display = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    document.getElementById('currentTask').textContent =
        `${state.currentTask?.name} (${display})`;
}
