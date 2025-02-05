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
    document.getElementById('durationSlider').value = 30;
    updateDurationFromSlider(30);
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
    if (formatDate(state.currentDate) === formatDate(new Date())) {
        // Today's view - select as current
        state.currentTask = task;
        state.tasks.forEach(t => t.current = false);
        task.current = true;
        document.getElementById('currentTask').textContent = task.name;
        updateMediaSession(task);
    } else {
        // Past/Future view - enable editing
        enableTaskEdit(index);
    }
    renderTasks();
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

document.addEventListener('touchend', e => {
    if (!touchStart) return;

    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchEnd - touchStart;

    if (Math.abs(diff) > 100) { // Min swipe distance
        if (diff > 0) { // Right swipe - previous day
            state.currentDate.setDate(state.currentDate.getDate() - 1);
        } else { // Left swipe - next day
            state.currentDate.setDate(state.currentDate.getDate() + 1);
        }
        loadTasks(state.currentDate);
    }
    touchStart = null;
});

// Initialize
document.getElementById('todayLink').addEventListener('click', () => {
    state.currentDate = new Date();
    loadTasks(state.currentDate);
});

document.getElementById('playPause').addEventListener('click', () => {
    if (state.currentTask) {
        // Toggle play state
        const button = document.getElementById('playPause');
        button.textContent = button.textContent === '▶' ? '⏸' : '▶';
    }
});

// Initial load
loadTasks(state.currentDate);
setInterval(updateProgress, 60000); // Update progress every minute

// Initialize clock
updateDateTime();
setInterval(updateDateTime, 1000);

// Duration controls
function updateDurationFromSlider(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    let durationText = '';

    if (hours > 0) {
        durationText = hours + (mins > 0 ? `.${Math.floor((mins / 60) * 10)}` : '') + 'hr';
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
    }

    minutes = Math.min(Math.max(minutes, 5), 180);
    document.getElementById('durationSlider').value = minutes;
    document.getElementById('durationDisplay').textContent = `${minutes} min`;
}

// Event listeners for duration controls
document.getElementById('durationSlider').addEventListener('input', (e) => {
    updateDurationFromSlider(parseInt(e.target.value));
});

document.getElementById('taskDuration').addEventListener('change', (e) => {
    updateSliderFromDuration(e.target.value);
});
