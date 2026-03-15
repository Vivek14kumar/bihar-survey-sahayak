// public/sw.js

// ========================================================
// नया फिक्स: पुराने सर्विस वर्कर को हटाकर इसे तुरंत लागू करें
// ========================================================
self.addEventListener('install', (event) => {
  self.skipWaiting(); // यह ब्राउज़र को इंतज़ार करने से रोकता है
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim()); // यह पेज का कंट्रोल तुरंत ले लेता है
});
// ========================================================


// 1. Listen for the push event from the backend
self.addEventListener('push', (event) => {
  const data = event.data.json();
  
  const options = {
    body: data.body,
    icon: '/icon.png', // Add a square logo (e.g., 192x192) to your public folder
    badge: '/badge.png', // Optional: A small white-transparent icon for Android top bar
    data: { url: data.url } // Store the blog link to open later
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// 2. Handle what happens when the user clicks the notification
self.addEventListener('notificationclick', (event) => {
  event.notification.close(); // Close the popup
  
  // Open the specific blog URL in a new browser tab
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});