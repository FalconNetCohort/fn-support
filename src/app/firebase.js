// firebase.js
import { initializeApp } from "firebase/app";
import {getDatabase} from "firebase/database";
import { getAuth } from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";
import {getStorage} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDkSTrfVNFYiy26b0heGsTrnX6nCZaqVUw",
  authDomain: "fn-support-e5ac9.firebaseapp.com",
  projectId: "fn-support-e5ac9",
  storageBucket: "gs://fn-support-e5ac9.firebasestorage.app",
  messagingSenderId: "734672940110",
  appId: "1:734672940110:web:5cf194766053d357a6a71f",
  measurementId: "G-XVL9ER0BX7",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth (these don't depend on the window object)
export const auth = getAuth(app);
export const functions = getFunctions(app);
export const storage = getStorage(app);
export const db = getDatabase(app);

export const addAdminRole = httpsCallable(functions, "addAdminRole");
export const removeAdminRole = httpsCallable(functions, "removeAdminRole");
export const listUsers = httpsCallable(functions, "listUsers");
