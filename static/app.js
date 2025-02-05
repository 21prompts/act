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

// Additional functionality will be implemented here
