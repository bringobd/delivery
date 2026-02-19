
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, onValue, update, remove } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCcwGEMEegu3KTDJi7sx4KO_GPHRpPkz5k",
  authDomain: "bringo-b66c2.firebaseapp.com",
  databaseURL: "https://bringo-b66c2-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "bringo-b66c2",
  storageBucket: "bringo-b66c2.firebasestorage.app",
  messagingSenderId: "1015048005239",
  appId: "1:1015048005239:web:1223e81179e30a044ac872",
  measurementId: "G-SY3W7Y8EMY"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export { ref, set, get, onValue, update, remove };
