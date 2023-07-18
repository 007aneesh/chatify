import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBNieCLY56Gyv_OTCiE_wW3gn-hfJVYeV4",
  authDomain: "chatify000.firebaseapp.com",
  projectId: "chatify000",
  storageBucket: "chatify000.appspot.com",
  messagingSenderId: "555228505429",
  appId: "1:555228505429:web:c2b1ec7d603ad0ce613bdc",
};


export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
