/** @format */

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getEnvVariable } from "../constants/validate";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD9BFXji9qfux9AHHBA2J4AEhbOHxBYkKk",
  authDomain: "istehwath-6cdd5.firebaseapp.com",
  projectId: "istehwath-6cdd5",
  storageBucket: "istehwath-6cdd5.appspot.com",
  messagingSenderId: "506151084029",
  appId: "1:506151084029:web:ac7b3211813b0e8f3a4394",
  measurementId: "G-G1NN731EBK",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export const fetchTokenValue = () => {
  return getToken(messaging, {
    vapidKey:
     getEnvVariable('VITE_APP_NOTIFICATION_VAPID_KEY'),
  })
    .then((currentToken) => {
      if (currentToken) {
        return currentToken;
      } else {
        return "";
      }
    })
    .catch((err) => {
      console.log("An error occurred while retrieving token. ", err);
    });
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
