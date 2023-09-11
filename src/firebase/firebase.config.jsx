// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCAN4SKl-mJsWIockFLqY5U8z9fi0LKQFU",
  authDomain: "sobremi-ff987.firebaseapp.com",
  projectId: "sobremi-ff987",
  storageBucket: "sobremi-ff987.appspot.com",
  messagingSenderId: "638911439803",
  appId: "1:638911439803:web:ea64504f05127ea3d05a9e",
  measurementId: "G-1XQ5XT2Y7Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app)