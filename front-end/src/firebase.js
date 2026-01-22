import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCOkgzgzvvmiWbOi8wQCJ5qD4QM11eHbtw",
  authDomain: "full-stack-react-a6587.firebaseapp.com",
  projectId: "full-stack-react-a6587",
  storageBucket: "full-stack-react-a6587.firebasestorage.app",
  messagingSenderId: "687494005787",
  appId: "1:687494005787:web:bde5e3c0854ab92e1764be"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);