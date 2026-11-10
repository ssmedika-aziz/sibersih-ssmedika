/* ============================================================
 *  Service Worker Si B3RSIH (PWA)
 *  - Cache app shell agar aplikasi bisa DIBUKA saat offline.
 *  - Cache Chart.js CDN agar grafik tetap tampil offline.
 *  - POST API (doPost) TIDAK di-cache di sini; antrian tulis
 *    offline ditangani di level aplikasi (IndexedDB) dan
 *    disinkronkan otomatis saat online.
 *  Naikkan versi CACHE setiap kali ada update file statis.
 * ============================================================ */
var CACHE = 'sibersih-v2';
var CORE = [
  './',
  './index.html',
  './config.js',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE)
      .then(function (c) { return c.addAll(CORE); })
      .then(function () { return self.skipWaiting(); })
      .catch(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys()
      .then(function (ks) {
        return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
      })
      .then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  // POST ke API GAS tidak disentuh (offline queue di app level)
  if (req.method !== 'GET') return;

  // Navigasi: network-first, fallback ke index.html cache (buka offline)
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(function (r) {
        var cp = r.clone();
        caches.open(CACHE).then(function (c) { c.put('./index.html', cp); }).catch(function () {});
        return r;
      }).catch(function () {
        return caches.match('./index.html');
      })
    );
    return;
  }

  // Aset statis & CDN: cache-first, fallback network lalu simpan
  e.respondWith(
    caches.match(req).then(function (cached) {
      if (cached) return cached;
      return fetch(req).then(function (r) {
        if (r && r.status === 200 && (r.type === 'basic' || r.type === 'cors')) {
          var cp = r.clone();
          caches.open(CACHE).then(function (c) { c.put(req, cp); }).catch(function () {});
        }
        return r;
      }).catch(function () { return cached; });
    })
  );
});
