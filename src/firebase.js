import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDebvWNMqbRW6KvtK5Hgk1fb_PsprRVta0",
  authDomain: "application-test-planner.firebaseapp.com",
  projectId: "application-test-planner",
  storageBucket: "application-test-planner.firebasestorage.app",
  messagingSenderId: "119134118089",
  appId: "1:119134118089:web:a85f30ba689c889c12ad18",
  measurementId: "G-CEZQKDKYLQ"
};

const app = initializeApp(firebaseConfig);