import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // NEW IMPORT

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "flip-quizzer.firebaseapp.com",
  projectId: "flip-quizzer",
  storageBucket: "flip-quizzer.firebasestorage.app",
  messagingSenderId: "114431554756",
  appId: "1:114431554756:web:f824cb6169e28b7bdb0591"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the tools we need
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app); // NEW DATABASE EXPORT9