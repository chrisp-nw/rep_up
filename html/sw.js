const CACHE_VERSION = 'rep_up_v3';
const APP_SHELL = ['./', './rep_up.html', './manifest.json', './sw.js'];

self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(CACHE_VERSION).then((cache) => cache.addAll(APP_SHELL))
	);
	self.skipWaiting();
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.keys().then((keys) =>
			Promise.all(
				keys
					.filter((key) => key !== CACHE_VERSION)
					.map((key) => caches.delete(key))
			)
		)
	);
	self.clients.claim();
});

self.addEventListener('fetch', (event) => {
	if (event.request.method !== 'GET') return;
	event.respondWith(
		caches.match(event.request).then((cached) => {
			if (cached) return cached;
			return fetch(event.request).catch(() => caches.match('./rep_up.html'));
		})
	);
});
