/*
 * A deliberately dumb service worker. Dugouts have bad signal, so the app has
 * to open with no network; that is the whole job.
 *
 * Cache the shell on install, then network first with a cache fallback. Nothing
 * clever: no precache manifest, no build step, no Workbox. Vite hashes asset
 * filenames, so instead of trying to know them ahead of time this caches each
 * one the first time it is fetched successfully. After one online visit the
 * whole app is available offline.
 *
 * Hashed filenames also mean a new build fetches new URLs, so a stale cache
 * cannot serve an old bundle: the fresh index.html points at the fresh assets.
 * Bump CACHE when this file's own logic changes.
 */

const CACHE = 'bballiq-v1'

// Relative to the service worker's scope, which is the app's base path, so this
// works the same at the root and under /baseballIQ/.
const SHELL = ['./', './index.html', './manifest.webmanifest', './favicon.svg']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      // addAll fails the whole install if any single request fails, and a
      // half-cached shell is better than no service worker at all.
      .then((cache) => Promise.allSettled(SHELL.map((url) => cache.add(url))))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  // Leave anything cross-origin alone. This app has none, and quietly caching
  // someone else's responses is not our business.
  if (new URL(request.url).origin !== self.location.origin) return

  event.respondWith(
    fetch(request)
      .then((response) => {
        // Only cache real, complete responses. An opaque or error response
        // saved here would be served back forever.
        if (response.ok && response.type === 'basic') {
          const copy = response.clone()
          caches.open(CACHE).then((cache) => cache.put(request, copy))
        }
        return response
      })
      .catch(async () => {
        const hit = await caches.match(request)
        if (hit) return hit
        // A page the player has never opened, with no network. Give them the
        // shell rather than the browser's offline error: the app is a single
        // page, so the shell is the app.
        if (request.mode === 'navigate') {
          const shell = await caches.match('./index.html')
          if (shell) return shell
        }
        return Response.error()
      }),
  )
})
