/* Orbit Performance offline support: keeps the app shell on the phone so it opens with no signal.
   Pages and app files: network first (so updates arrive), falling back to the saved copy after 4 s or offline.
   Google Fonts: saved after first load. Google Sheets data is not cached here; the app keeps its own last good copy. */
const V = "orbit-shell-v1";
const CORE = ["./", "index.html", "manifest.webmanifest", "icon-180.png", "icon-192.png", "icon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(V).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== V).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
const timeout = (p, ms) => new Promise((res, rej) => { const t = setTimeout(() => rej(new Error("timeout")), ms); p.then(v => { clearTimeout(t); res(v); }, e => { clearTimeout(t); rej(e); }); });
self.addEventListener("fetch", e => {
  const r = e.request; if (r.method !== "GET") return;
  const u = new URL(r.url);
  if (u.origin !== location.origin) {
    if (/(^|\.)fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)) {
      e.respondWith(caches.open(V).then(c => c.match(r).then(m => m || fetch(r).then(res => { c.put(r, res.clone()); return res; }))));
    }
    return;
  }
  e.respondWith(timeout(fetch(r), r.mode === "navigate" ? 4000 : 8000)
    .then(res => { if (res && res.ok) { const cp = res.clone(); caches.open(V).then(c => c.put(r, cp)); } return res; })
    .catch(() => caches.match(r).then(m => m || (r.mode === "navigate" ? caches.match("index.html") : Response.error()))));
});
