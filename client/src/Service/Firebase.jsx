import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';
import axios from 'axios';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDsHQT0fS_bEtYB0MAQVF4cyxG7mkI6YFM",
  authDomain: "scale-mart1.firebaseapp.com",
  projectId: "scale-mart1",
  storageBucket: "scale-mart1.appspot.com",
  messagingSenderId: "1017488265671",
  appId: "1:1017488265671:web:1a5e22de48dfd4e5b849e2",
  measurementId: "G-FC92258EGT"
};
const apiUrl = "https://e-commerce-capstone.onrender.com";
// Initialize Firebase app
const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

// Register Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/firebase-messaging-sw.js')
    .then((registration) => {
      console.log('Service Worker registered:', registration);
    })
    .catch((error) => {
      console.error('Service Worker registration failed:', error);
    });
}

// Request FCM token
export const requestPermission = async () => {
  console.log('Requesting permission for notifications...');

  try {
    if (Notification.permission === 'granted') {
      console.log('Notification permission granted.');
      const token = await getToken(messaging, {
        vapidKey: 'BC6PMw2Z27T9vd8ZQEd8qlbKsch1z9IyO3W8j-ENKTBfG9RJv7UQn5PHyalbiU4DX_pPxRsWmfYr9OsaHxX5ezA'
      });
      if (token) {
        console.log('FCM Token:', token);
        await saveFcmToken(token); // Save token to the database
        return token;
      }
    } else {
      console.log('Notification permission was denied.');
    }
  } catch (error) {
    console.error('Error getting FCM token:', error);
  }
};

export const saveFcmToken = async (token) => {
  try {
    const response = await axios.post(`${apiUrl}/auth/fcm-token`, { fcmToken: token }, { withCredentials: true });
    console.log('FCM token saved:', response.data);
  } catch (error) {
    console.error('Error saving FCM token:', error);
  }
};

// Call requestPermission once to avoid redundant calls
// requestPermission();
// saveFcmToken();
