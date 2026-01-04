const CACHE_NAME = 'digital-patro-v15';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    'https://cdn.tailwindcss.com',
    'https://cdn.jsdelivr.net/npm/nepali-date-converter@3.3.1/dist/nepali-date-converter.umd.js'
];

// 1. Install Event: Cache essential files
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                // console.log('Opened cache');
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

// 2. Fetch Event: Serve from cache if offline
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached version if found, else fetch from network
                return response || fetch(event.request);
            })
            .catch(() => {
                // If both fail (offline & not cached), you could return a fallback here
            })
    );
});

// 3. Activate Event: Cleanup old caches (e.g., if you update the version)
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
