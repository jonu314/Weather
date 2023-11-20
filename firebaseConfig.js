
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, updateProfile } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
import { equalTo, get, getDatabase, onValue, orderByChild, push, query, ref, remove, set } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
apiKey: "AIzaSyDH3MTTgijLG7d5Q4t6nrpEuJnFMrL3ips",
authDomain: "weatherbrainiac.firebaseapp.com",
databaseURL: "https://weatherbrainiac-default-rtdb.firebaseio.com",
projectId: "weatherbrainiac",
storageBucket: "weatherbrainiac.appspot.com",
messagingSenderId: "373997009223",
appId: "1:373997009223:web:e09b0883f6863695a87462",
measurementId: "G-1JLB0DJ69R"
};

  // Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { app, auth, createUserWithEmailAndPassword, database, equalTo, get, onAuthStateChanged, onValue, orderByChild, push, query, ref, remove, sendEmailVerification, sendPasswordResetEmail, set, signInWithEmailAndPassword, signOut, updateProfile };
