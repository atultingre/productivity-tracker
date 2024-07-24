// firebase.js

import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword as signInWithEmailAndPasswordModular, signOut as signOutModular } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDA9026j1W17mPccHiSa-W4MclmCeiBqio",
  authDomain: "cv-productivity-tracker.firebaseapp.com",
  projectId: "cv-productivity-tracker",
  storageBucket: "cv-productivity-tracker.appspot.com",
  messagingSenderId: "1071051539731",
  appId: "1:1071051539731:web:870685aa5ea7fd103bc6e6",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore, signInWithEmailAndPasswordModular as signInWithEmailAndPassword, signOutModular as signOut };
