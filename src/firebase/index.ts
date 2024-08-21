import * as Firestore from "firebase/firestore";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCQBahUXL24Yd4liv1S-crW8oobEKM8MK4",
  authDomain: "felipe-s-tou-challenge.firebaseapp.com",
  projectId: "felipe-s-tou-challenge",
  storageBucket: "felipe-s-tou-challenge.appspot.com",
  messagingSenderId: "806615442606",
  appId: "1:806615442606:web:331c3bc6024b845a12f93f",
};

const app = initializeApp(firebaseConfig);
export const firestoreDB = Firestore.getFirestore();
export const DatabaseVisibility = "public";

export function getCollection<T>(path: string) {
  return Firestore.collection(
    firestoreDB,
    path,
  ) as Firestore.CollectionReference<T>;
}

export async function deleteDocument(path: string, id: string) {
  const doc = Firestore.doc(firestoreDB, `${path}/${id}`);
  await Firestore.deleteDoc(doc);
}

export async function updateDocument<T extends Record<string, any>>(
  path: string,
  id: string,
  data: T,
) {
  const doc = Firestore.doc(firestoreDB, `${path}/${id}`);
  await Firestore.updateDoc(doc, data);
}
