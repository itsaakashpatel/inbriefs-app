import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBw-NMPO7XVc64vGcPi0zBZVQ2U-m6XwRQ",
  authDomain: "inbriefs-b92f2.firebaseapp.com",
  projectId: "inbriefs-b92f2",
  storageBucket: "inbriefs-b92f2.appspot.com",
  messagingSenderId: "519045622067",
  appId: "1:519045622067:web:222d405530f5800b267646",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export default db;
