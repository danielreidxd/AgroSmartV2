import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getApps, getApp } from 'firebase/app';

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDYl_CN7pfedkTnYldg9YWNqbtt4H-q0_M",
    authDomain: "app-demo-19005.firebaseapp.com",
    projectId: "app-demo-19005",
    storageBucket: "app-demo-19005.appspot.com",
    messagingSenderId: "128373155312",
    appId: "1:128373155312:android:8fa1679f2db54506912935",
};

// Inicializa la aplicación de Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Inicializa los servicios de Firebase
const auth = getAuth(app);
const db = getFirestore(app);

// Exporta los servicios para ser utilizados en otros archivos
export { auth, db };
