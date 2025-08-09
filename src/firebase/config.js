import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBnZEk0M-1-fW9o-FOSlC799S73dupXj3U",
  authDomain: "mytimeapp-9da40.firebaseapp.com",
  projectId: "mytimeapp-9da40",
  storageBucket: "mytimeapp-9da40.firebasestorage.app",
  messagingSenderId: "100515320737",
  appId: "1:100515320737:web:bd59b1448b8a79602971e0"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);