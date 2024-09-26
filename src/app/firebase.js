// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics, logEvent, Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDkSTrfVNFYiy26b0heGsTrnX6nCZaqVUw",
  authDomain: "fn-support-e5ac9.firebaseapp.com",
  projectId: "fn-support-e5ac9",
  storageBucket: "fn-support-e5ac9.appspot.com",
  messagingSenderId: "734672940110",
  appId: "1:734672940110:web:5cf194766053d357a6a71f",
  measurementId: "G-XVL9ER0BX7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth (these don't depend on the window object)
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);


export { auth, db, analytics, logEvent };
