import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBpPbfcT9W32mwvMblJkfEuF-tiKBZ455c",
  authDomain: "aarogyalink-469512.firebaseapp.com",
  projectId: "aarogyalink-469512",
  storageBucket: "aarogyalink-469512.appspot.com",
  messagingSenderId: "871645691298",
  appId: "1:871645691298:web:5bcd6a20f97c4eea1f06fb",
  measurementId: "G-CVH10CQC4M"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
