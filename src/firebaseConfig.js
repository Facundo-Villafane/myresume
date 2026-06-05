import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAwf7btRNMWp5U5qiGZDc4Mxlhx5LguGj8",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "mycv-648be.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "mycv-648be",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "mycv-648be.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "612834628172",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:612834628172:web:bda0edbeab3b303c799ae9",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-3MB7YGP6CP",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
