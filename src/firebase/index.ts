import * as Firestore from "firebase/firestore";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBfD-yeqFortwzYmrUMcQFZRstig5E9Fbw",
  authDomain: "that-open-master-challenge.firebaseapp.com",
  projectId: "that-open-master-challenge",
  storageBucket: "that-open-master-challenge.appspot.com",
  messagingSenderId: "583262808832",
  appId: "1:583262808832:web:83dc929d0d80f84258e1e5"
};

const app = initializeApp(firebaseConfig);
export const firestoreDB = Firestore.getFirestore()

export function getCollection<T>(path: string) {
  return Firestore.collection(firestoreDB, path) as Firestore.CollectionReference<T>
}

export function deleteDocument(path: string, id: string) {
  const doc = Firestore.doc(firestoreDB,  `${path}/${id}`)
  Firestore.deleteDoc(doc)
}