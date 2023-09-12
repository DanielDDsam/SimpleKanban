import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCAN4SKl-mJsWIockFLqY5U8z9fi0LKQFU",
  authDomain: "sobremi-ff987.firebaseapp.com",
  projectId: "sobremi-ff987",
  storageBucket: "sobremi-ff987.appspot.com",
  messagingSenderId: "638911439803",
  appId: "1:638911439803:web:ea64504f05127ea3d05a9e",
  measurementId: "G-1XQ5XT2Y7Y",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Obtener instancias de autenticación y Firestore
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
