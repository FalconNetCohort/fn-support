// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA8ek_byVEr7PwmHDb_OYZUKMz4zVG6-Sc",
  authDomain: "fn-support-44ece.firebaseapp.com",
  projectId: "fn-support-44ece",
  storageBucket: "fn-support-44ece.appspot.com",
  messagingSenderId: "766747324313",
  appId: "1:766747324313:web:df27625d3553445b9fad08",
  measurementId: "G-PT3RVVV81E",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
