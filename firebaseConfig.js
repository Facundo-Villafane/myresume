// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAwf7btRNMWp5U5qiGZDc4Mxlhx5LguGj8",
  authDomain: "mycv-648be.firebaseapp.com",
  projectId: "mycv-648be",
  storageBucket: "mycv-648be.firebasestorage.app",
  messagingSenderId: "612834628172",
  appId: "1:612834628172:web:bda0edbeab3b303c799ae9",
  measurementId: "G-3MB7YGP6CP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);