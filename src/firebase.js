// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCvYO7zyoNVdxC3Q0ShAeLR8PHLDz9u5Cs",
  authDomain: "trio-5fcf0.firebaseapp.com",
  projectId: "trio-5fcf0",
  storageBucket: "trio-5fcf0.appspot.com",
  messagingSenderId: "1047567084584",
  appId: "1:1047567084584:web:bfe68dcc9b7576f9a5191d",
  measurementId: "G-91HNYWKXR3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const db = getFirestore(app);

export default db;