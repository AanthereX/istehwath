importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
    apiKey: "AIzaSyD9BFXji9qfux9AHHBA2J4AEhbOHxBYkKk",
    authDomain: "istehwath-6cdd5.firebaseapp.com",
    projectId: "istehwath-6cdd5",
    storageBucket: "istehwath-6cdd5.appspot.com",
    messagingSenderId: "506151084029",
    appId: "1:506151084029:web:ac7b3211813b0e8f3a4394",
    measurementId: "G-G1NN731EBK",
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
    };

    self.registration.showNotification(notificationTitle,
        notificationOptions);
});