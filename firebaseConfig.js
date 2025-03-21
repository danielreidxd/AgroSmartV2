import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getApps, getApp } from 'firebase/app';


const firebaseConfig = {
    apiKey: "AIzaSyDYl_CN7pfedkTnYldg9YWNqbtt4H-q0_M",
    authDomain: "app-demo-19005.firebaseapp.com",
    projectId: "app-demo-19005",
    storageBucket: "app-demo-19005.appspot.com",
    messagingSenderId: "128373155312",
    appId: "1:128373155312:android:8fa1679f2db54506912935",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
