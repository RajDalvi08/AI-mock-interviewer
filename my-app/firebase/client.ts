// Import the functions you need from the SDKs you need


import { initializeApp, getApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAuedJdh44Y_ebAOjlXzxbX9Gz4ib0ppn0",
  authDomain: "prepwise-dd5ef.firebaseapp.com",
  projectId: "prepwise-dd5ef",
  storageBucket: "prepwise-dd5ef.firebasestorage.app",
  messagingSenderId: "30607811376",
  appId: "1:30607811376:web:33db1f4e56a60da6c55ef5",
  measurementId: "G-HNCQYNWLLK"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app)