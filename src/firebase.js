import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAKJAcu2t1iyzFFIiQM-G6bk34OtCB2wRE",
  authDomain: "getraenkeliste.firebaseapp.com",
  projectId: "getraenkeliste-app",
  storageBucket: "getraenkeliste.appspot.com",
  messagingSenderId: "288625417392",
  appId: "1:288625417392:web:fa07d851ee3dcda991ef75",
  measurementId: "G-N3QT2FB0P5"
};

const app = initializeApp(firebaseConfig);

// Authentifizierungsdienst initialisieren
const auth = getAuth(app);

// Firestore-Datenbank initialisieren
const db = getFirestore(app);

export { auth, db };
