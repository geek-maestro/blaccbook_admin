// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDxKKFGnFi-IBYHJ2jey2-m9akojlCv6ZE",
  authDomain: "blaccbook-dev.firebaseapp.com",
  projectId: "blaccbook-dev",
  storageBucket: "blaccbook-dev.firebasestorage.app",
  messagingSenderId: "547353025123",
  appId: "1:547353025123:web:a24501d57826b653cf7656",
  measurementId: "G-Y9L9KBCNSG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth , db}