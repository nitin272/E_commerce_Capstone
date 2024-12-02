importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyDsHQT0fS_bEtYB0MAQVF4cyxG7mkI6YFM",
    authDomain: "scale-mart1.firebaseapp.com",
    projectId: "scale-mart1",
    storageBucket: "scale-mart1.appspot.com",
    messagingSenderId: "1017488265671",
    appId: "1:1017488265671:web:1a5e22de48dfd4e5b849e2",
    measurementId: "G-FC92258EGT"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message:', payload);

    const notificationTitle = payload.notification.title || 'New Notification';
    const notificationBody = payload.notification.body || 'You have a new update!';
    const notificationIcon = '\src\assets\logo.png'; 
    const notificationImage = payload.notification.image || '/images/default-image.jpg'; 
    const actionUrl = payload.data.click_action || 'https://scale-mart1.vercel.app/chat'; 


    console.log(`[firebase-messaging-sw.js] Notification - Title: ${notificationTitle}, Body: ${notificationBody}`);


    const notificationOptions = {
        body: notificationBody,
        icon: notificationIcon, 
        badge: '/images/badge-icon.png', 
        image: notificationImage,
        vibrate: [200, 100, 200],
        data: {
            click_action: actionUrl 
        },
        actions: [
            {
                action: 'view',
                title: 'View Details',
                icon: '/images/view-icon.png', 
            },
            {
                action: 'dismiss',
                title: 'Dismiss',
                icon: '/images/dismiss-icon.png', 
            }
        ],
        requireInteraction: true, 
        renotify: true,
        sound: '/sounds/notification-sound.mp3', 
    };


    self.registration.showNotification(notificationTitle, notificationOptions)
        .then(() => {
            console.log('[firebase-messaging-sw.js] Notification displayed successfully');
        })
        .catch((error) => {
            console.error('[firebase-messaging-sw.js] Error showing notification:', error);
        });
});


self.addEventListener('notificationclick', (event) => {
    console.log('[firebase-messaging-sw.js] Notification clicked:', event.notification);

    event.notification.close();

    const actionUrl = event.notification.data.click_action;

    clients.openWindow(actionUrl);
});
