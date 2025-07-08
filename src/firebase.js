import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';
const firebaseConfig = {
  apiKey: "AIzaSyBSBZmuHCtsCxkDVVBl5YoZWkwLNTuE2tY",
  authDomain: "productsproject-baef1.firebaseapp.com",
  projectId: "productsproject-baef1",
  storageBucket: "productsproject-baef1.firebasestorage.app",
  messagingSenderId: "90710568451",
  appId: "1:90710568451:web:cef735740dc86cc7cde836",
  databaseURL: 
        "https://productsproject-baef1-default-rtdb.europe-west1.firebasedatabase.app/",
};
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);