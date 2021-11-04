let CACHE_NAME = 'larry';

let FILES_TO_CACHE = [
    '/larry.png',
];

self.addEventListener('install', (evt) => {
    evt.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
    );
});

self.addEventListener('activate', (evt) => {
    evt.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys.map((key) => {
                if (!CACHE_NAME.includes(key)) {
                    return caches.delete(key);
                }
            }));
        })
    );
});

self.addEventListener('fetch', (evt) => {
    if (evt.request.mode !== 'navigate') {
        // Not a page navigation, bail.
        return;
    }
    evt.respondWith(
        fetch(evt.request)
            .catch(() => {
                return caches.open(CACHE_NAME)
                    .then((cache) => {
                        return cache.match('/');
                    });
            })
    );

});