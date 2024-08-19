// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBO6eD1AHy37oNC54smzoXweKggR4QFGzk",
  authDomain: "flashcards-7ee64.firebaseapp.com",
  projectId: "flashcards-7ee64",
  storageBucket: "flashcards-7ee64.appspot.com",
  messagingSenderId: "666604319606",
  appId: "1:666604319606:web:b411b0169383f91ce24057",
  measurementId: "G-LRX28WCHLL"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { app, auth, firestore, storage };