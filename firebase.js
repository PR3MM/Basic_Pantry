// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore  } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBm20bmOttlPc6iB7D2LDWXvgw1wQp2stk",
  authDomain: "hspantry-8b68f.firebaseapp.com",
  projectId: "hspantry-8b68f",
  storageBucket: "hspantry-8b68f.appspot.com",
  messagingSenderId: "188341291658",
  appId: "1:188341291658:web:0eb0e0c4b190a01a887b73",
  measurementId: "G-QGTEM71919"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export {
    app,
    firestore
}