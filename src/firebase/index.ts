import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBfD-yeqFortwzYmrUMcQFZRstig5E9Fbw",
  authDomain: "that-open-master-challenge.firebaseapp.com",
  projectId: "that-open-master-challenge",
  storageBucket: "that-open-master-challenge.appspot.com",
  messagingSenderId: "583262808832",
  appId: "1:583262808832:web:83dc929d0d80f84258e1e5"
};

const app = initializeApp(firebaseConfig);
export const firebaseDB = getFirestore()