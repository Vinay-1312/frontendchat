// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA1XJWgd5FwOFl2N1pI5sBA3B86lkVo-Ck",
  authDomain: "chatapplication-b563a.firebaseapp.com",
  projectId: "chatapplication-b563a",
  storageBucket: "chatapplication-b563a.appspot.com",
  messagingSenderId: "105898981577",
  appId: "1:105898981577:web:f11d84022403b811d67518",
  measurementId: "G-0R0J1L2Z8P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth();
