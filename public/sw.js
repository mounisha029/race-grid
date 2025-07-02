
const CACHE_NAME = 'f1-boxbox-v2';
const STATIC_CACHE = 'f1-static-v2';
const DYNAMIC_CACHE = 'f1-dynamic-v2';
const API_CACHE = 'f1-api-v2';

// Static assets to cache
const STATIC_ASSETS = [
  '/',
  '/drivers',
  '/teams',
  '/races',
  '/calendar',
  '/analytics',
  '/placeholder.svg',
  '/manifest.json'
];

// API endpoints to cache
const API_ENDPOINTS = [
  '/functions/v1/drivers',
  '/functions/v1/teams',
  '/functions/v1/races',
  '/functions/v1/championship'
];

// Cache strategies
const CACHE_STRATEGIES = {
  CACHE_FIRST: 'cache-first',
  NETWORK_FIRST: 'network-first',
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate'
};

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      caches.open(API_CACHE).then(cache => {
        console.log('Preparing API cache');
        return Promise.resolve();
      })
    ])
  );
  
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE && 
              cacheName !== DYNAMIC_CACHE && 
              cacheName !== API_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  self.clients.claim();
});

// Fetch event - handle requests with appropriate caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle different types of requests
  if (isStaticAsset(request)) {
    event.respondWith(handleStaticAsset(request));
  } else if (isApiRequest(request)) {
    event.respondWith(handleApiRequest(request));
  } else if (isNavigationRequest(request)) {
    event.respondWith(handleNavigationRequest(request));
  } else {
    event.respondWith(handleDynamicRequest(request));
  }
});

// Check if request is for static asset
function isStaticAsset(request) {
  const url = new URL(request.url);
  return url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2)$/);
}

// Check if request is for API
function isApiRequest(request) {
  return request.url.includes('/functions/v1/') || 
         request.url.includes('/api/');
}

// Check if request is navigation
function isNavigationRequest(request) {
  return request.mode === 'navigate';
}

// Handle static assets (cache first)
async function handleStaticAsset(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const response = await fetch(request);
    if (response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error('Failed to fetch static asset:', error);
    return new Response('Asset not available offline', { status: 503 });
  }
}

// Handle API requests (stale while revalidate)
async function handleApiRequest(request) {
  const cache = await caches.open(API_CACHE);
  const cachedResponse = await cache.match(request);
  
  // Return cached response immediately if available
  const cachedPromise = cachedResponse ? Promise.resolve(cachedResponse) : null;
  
  // Fetch fresh data in background
  const networkPromise = fetch(request).then(response => {
    if (response.status === 200) {
      // Clone and cache the response
      cache.put(request, response.clone());
    }
    return response;
  }).catch(error => {
    console.error('Network request failed:', error);
    throw error;
  });

  // Return cached response if available, otherwise wait for network
  if (cachedResponse) {
    // Update cache in background
    networkPromise.catch(() => {}); // Ignore network errors when we have cache
    return cachedResponse;
  }
  
  try {
    return await networkPromise;
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Data not available offline',
      offline: true 
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Handle navigation requests
async function handleNavigationRequest(request) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(DYNAMIC_CACHE);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match('/');
    return cachedResponse || new Response('Page not available offline', { 
      status: 503,
      headers: { 'Content-Type': 'text/html' }
    });
  }
}

// Handle other dynamic requests
async function handleDynamicRequest(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  
  try {
    const response = await fetch(request);
    if (response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cachedResponse = await cache.match(request);
    return cachedResponse || new Response('Content not available offline', { 
      status: 503 
    });
  }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(handleOfflineActions());
  }
});

// Handle offline actions when back online
async function handleOfflineActions() {
  // Handle any queued actions from when the app was offline
  try {
    const offlineActions = await getOfflineActions();
    for (const action of offlineActions) {
      await processOfflineAction(action);
    }
    await clearOfflineActions();
  } catch (error) {
    console.error('Failed to process offline actions:', error);
  }
}

// Utility functions for offline action queue
async function getOfflineActions() {
  // Implementation would depend on how you store offline actions
  return [];
}

async function processOfflineAction(action) {
  // Process individual offline action
  console.log('Processing offline action:', action);
}

async function clearOfflineActions() {
  // Clear processed offline actions
  console.log('Clearing offline actions');
}

// Enhanced push notification handling
self.addEventListener('push', (event) => {
  console.log('Push notification received');
  
  let notificationData = {
    title: 'F1 Box Box',
    body: 'New F1 update available!',
    icon: '/placeholder.svg',
    badge: '/placeholder.svg',
    tag: 'f1-update',
    data: {
      url: '/',
      timestamp: Date.now()
    }
  };

  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = { ...notificationData, ...data };
    } catch (error) {
      console.error('Failed to parse push data:', error);
      notificationData.body = event.data.text();
    }
  }

  const options = {
    body: notificationData.body,
    icon: notificationData.icon,
    badge: notificationData.badge,
    tag: notificationData.tag,
    data: notificationData.data,
    vibrate: [100, 50, 100],
    actions: [
      {
        action: 'open',
        title: 'View',
        icon: '/placeholder.svg'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/placeholder.svg'
      }
    ],
    requireInteraction: true
  };

  event.waitUntil(
    self.registration.showNotification(notificationData.title, options)
  );
});

// Enhanced notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event.action);
  
  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        // Check if app is already open
        for (const client of clientList) {
          if (client.url.includes(self.location.origin)) {
            client.focus();
            if (client.navigate) {
              client.navigate(urlToOpen);
            }
            return;
          }
        }
        
        // Open new window if app is not open
        return clients.openWindow(urlToOpen);
      })
  );
});

// Performance monitoring
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PERFORMANCE_METRICS') {
    console.log('Performance metrics received:', event.data.metrics);
    // You could send these to an analytics service
  }
});
