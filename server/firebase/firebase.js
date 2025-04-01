// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAztSjxpgOGCcFUN9aa3Wmz70JUbJOrUoM",
  authDomain: "e-com-fullstack.firebaseapp.com",
  projectId: "e-com-fullstack",
  storageBucket: "e-com-fullstack.firebasestorage.app",
  messagingSenderId: "181314667959",
  appId: "1:181314667959:web:0d693f8e278a11822f1432",
  measurementId: "G-99M6QP8MCH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
