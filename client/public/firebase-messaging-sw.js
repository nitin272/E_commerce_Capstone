// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize Firebase in the service worker
const firebaseConfig = {
    apiKey: "AIzaSyDsHQT0fS_bEtYB0MAQVF4cyxG7mkI6YFM",
    authDomain: "scale-mart1.firebaseapp.com",
    projectId: "scale-mart1",
    storageBucket: "scale-mart1.appspot.com",
    messagingSenderId: "1017488265671",
    appId: "1:1017488265671:web:1a5e22de48dfd4e5b849e2",
    measurementId: "G-FC92258EGT"
};

// Initialize Firebase app
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message:', payload);

    const notificationTitle = payload.notification.title || 'Notification'; // Default title if none
    const notificationBody = payload.notification.body || 'You have a new message!'; // Default body if none
    console.log(`[firebase-messaging-sw.js] Notification - Title: ${notificationTitle}, Body: ${notificationBody}`);

    const notificationOptions = {
        body: notificationBody,
        icon: '/firebase-logo.png', // Ensure this icon is accessible
    };

    // Show notification to the user
    self.registration.showNotification(notificationTitle, notificationOptions)
        .then(() => {
            console.log('[firebase-messaging-sw.js] Notification displayed successfully');
        })
        .catch((error) => {
            console.error('[firebase-messaging-sw.js] Error showing notification:', error);
        });
});
