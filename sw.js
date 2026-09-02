/* Service worker.
   The version number lives ONLY here. The app asks for it via message and
   compares it against the server's copy. Bump this line after every change
   to index.html, app.js, or sprache.js. */
const VERSION = "v50";
const DATEIEN = ["./","./index.html","./app.js","./sprache.js","./manifest.webmanifest","./icon-192.png","./icon-512.png"];

/* cache:"reload" forces the network. Without it the browser may serve
   individual files from its own cache — GitHub Pages allows that for ten
   minutes. A new index.html could then end up cached alongside an old
   app.js, and the app would crash on an id that exists in one version but
   not the other. If any file fails, installation fails entirely and the
   previous version stays active — a stale but consistent app beats a
   mixed one. */
self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => Promise.all(
    DATEIEN.map(d => fetch(new Request(d, {cache:"reload"})).then(a => {
      if(!a.ok) throw new Error(d + ": " + a.status);
      return c.put(d, a);
    }))
  )).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener("message", e => {
  if(e.data === "version" && e.ports && e.ports[0]) e.ports[0].postMessage(VERSION);
  if(e.data === "sofort") self.skipWaiting();
});
self.addEventListener("notificationclick", e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({type:"window"}).then(l => l.length ? l[0].focus() : self.clients.openWindow("./")));
});
self.addEventListener("fetch", e => {
  if(e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  if(url.origin !== self.location.origin) return;        // pass foreign origins through
  if(url.pathname.endsWith("/sw.js")) return;             // version check must hit the network
  /* Respond from cache first, refresh in the background. Network-first would
     mean waiting out a timeout on bad wifi before anything appears at all. */
  e.respondWith(caches.open(VERSION).then(async c => {
    const gespeichert = await c.match(e.request);
    const ausDemNetz = fetch(e.request)
      .then(a => { if(a && a.ok && a.type === "basic") c.put(e.request, a.clone()); return a; })
      .catch(() => null);
    return gespeichert || await ausDemNetz || c.match("./index.html");
  }));
});
