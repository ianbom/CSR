const CACHE_VERSION = 'pwa-v' + new Date().getTime();
const OFFLINE_CACHE = 'offline-v1';
const STATIC_CACHE = 'static-v1';

const OFFLINE_URL = '/offline';

const STATIC_ASSETS = [
    '/offline',
    '/img/LogoTab.png',
    '/images/icons/icon-72x72.png',
    '/images/icons/icon-96x96.png',
    '/images/icons/icon-128x128.png',
    '/images/icons/icon-144x144.png',
    '/images/icons/icon-152x152.png',
    '/images/icons/icon-192x192.png',
    '/images/icons/icon-384x384.png',
    '/images/icons/icon-512x512.png',
];

// Install event - cache static assets
self.addEventListener("install", event => {
    console.log('[ServiceWorker] Installing...');
    event.waitUntil(
        (async () => {
            const cache = await caches.open(CACHE_VERSION);
            try {
                await cache.addAll(STATIC_ASSETS);
                console.log('[ServiceWorker] Static assets cached');
            } catch (error) {
                console.error('[ServiceWorker] Failed to cache assets:', error);
            }
            await self.skipWaiting();
        })()
    );
});

// Activate event - cleanup old caches
self.addEventListener('activate', event => {
    console.log('[ServiceWorker] Activating...');
    event.waitUntil(
        (async () => {
            const cacheNames = await caches.keys();
            await Promise.all(
                cacheNames
                    .filter(cacheName => cacheName.startsWith("pwa-") && cacheName !== CACHE_VERSION)
                    .map(cacheName => {
                        console.log('[ServiceWorker] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    })
            );
            await self.clients.claim();
        })()
    );
});

// Fetch event - network first, fallback to cache
self.addEventListener("fetch", event => {
    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        (async () => {
            try {
                // Try network first
                const networkResponse = await fetch(event.request);
                
                // Cache successful responses
                if (networkResponse.ok) {
                    const cache = await caches.open(CACHE_VERSION);
                    cache.put(event.request, networkResponse.clone());
                }
                
                return networkResponse;
            } catch (error) {
                // Network failed, try cache
                const cachedResponse = await caches.match(event.request);
                
                if (cachedResponse) {
                    return cachedResponse;
                }
                
                // If it's a navigation request, show offline page
                if (event.request.mode === 'navigate') {
                    const offlineResponse = await caches.match(OFFLINE_URL);
                    if (offlineResponse) {
                        return offlineResponse;
                    }
                }
                
                // For all other requests, return a basic error response
                return new Response('Offline - Resource not available', {
                    status: 503,
                    statusText: 'Service Unavailable',
                    headers: new Headers({
                        'Content-Type': 'text/plain'
                    })
                });
            }
        })()
    );
});