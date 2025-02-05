const CACHE_NAME = 'daily-schedule-v1';
const ASSETS = [
    '/',
    '/static/app.css',
    '/static/app.js',
    '/static/index.html',
    '/manifest.json'
];

// Install event - cache assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
});

// Activate event - cleanup old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(keys => {
                return Promise.all(
                    keys.filter(key => key !== CACHE_NAME)
                        .map(key => caches.delete(key))
                );
            })
            .then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') return;

    // Skip API and WebSocket requests
    if (event.request.url.includes('/api/')) return;
    if (event.request.url.includes('/ws')) return;

    event.respondWith(
        caches.match(event.request)
            .then(cached => {
                const networked = fetch(event.request)
                    .then(response => {
                        // Cache valid responses
                        if (response.ok) {
                            const clone = response.clone();
                            caches.open(CACHE_NAME)
                                .then(cache => cache.put(event.request, clone));
                        }
                        return response;
                    })
                    .catch(() => cached); // Offline fallback

                return cached || networked;
            })
    );
});

// Handle sync events for offline support
self.addEventListener('sync', event => {
    if (event.tag === 'sync-tasks') {
        event.waitUntil(syncTasks());
    }
});

// Function to sync pending changes
async function syncTasks() {
    const pendingChanges = await getPendingChanges();
    for (const change of pendingChanges) {
        try {
            await fetch('/api/tasks/' + change.date, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(change.tasks)
            });
            await removePendingChange(change.date);
        } catch (err) {
            console.error('Sync failed:', err);
            return Promise.reject(err); // Retry later
        }
    }
}

// IndexedDB helpers for offline changes
async function getPendingChanges() {
    // Implementation would use IndexedDB to store/retrieve changes
    return [];
}

async function removePendingChange(date) {
    // Implementation would remove synced change from IndexedDB
}
