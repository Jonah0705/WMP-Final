import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCsFiE3A9NnTXAIJSqdRj3m_XU8PgHvtGg",
  authDomain: "travel-10474.firebaseapp.com",
  projectId: "travel-10474",
  storageBucket: "travel-10474.firebasestorage.app",
  messagingSenderId: "155347889323",
  appId: "1:155347889323:web:0651d6e0ed5366ba091bee",
  measurementId: "G-MBE7XP6FPD"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);