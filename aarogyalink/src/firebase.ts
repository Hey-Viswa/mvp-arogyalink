import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCTwRZelEdCmnGGI-Ucx2iN3HQWkTBylFU",
  authDomain: "mvp-sample-b0467.firebaseapp.com",
  projectId: "mvp-sample-b0467",
  storageBucket: "mvp-sample-b0467.appspot.com",
  messagingSenderId: "449521676789",
  appId: "1:449521676789:web:0602b639afadd0f42e30bc",
  measurementId: "G-KS9L121PS9"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
