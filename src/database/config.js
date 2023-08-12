
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDmCdqAGzmIdi39GQm26K1Lczj9nVupAbg",
    authDomain: "inbriefnews-5c3f8.firebaseapp.com",
    projectId: "inbriefnews-5c3f8",
    storageBucket: "inbriefnews-5c3f8.appspot.com",
    messagingSenderId: "42056160837",
    appId: "1:42056160837:web:bb876c982055d5b182b52c",
    measurementId: "G-63BY5P67FE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);