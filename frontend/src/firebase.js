import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyClTE_B8T4uLow27fOMm0NjpQrMI0ZBnYw",
  authDomain: "x03-project.firebaseapp.com",
  projectId: "x03-project",
  storageBucket: "x03-project.appspot.com",
  messagingSenderId: "697042901208",
  appId: "1:697042901208:web:e0dcefb37b419654525fad",
  measurementId: "G-Z9CHT9MQ7G",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// For Authentication
export const auth = firebase.auth();
// For Google Sign In
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
