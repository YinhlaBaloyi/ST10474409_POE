// login.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/11.9.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCnvwSM2KK9JR7k3n7H1rGa6UaF7b0CA90",
  authDomain: "etfs-51c62.firebaseapp.com",
  projectId: "etfs-51c62",
  storageBucket: "etfs-51c62.firebasestorage.app",
  messagingSenderId: "410894331276",
  appId: "1:410894331276:web:fa778466b6146d0499baa9",
  measurementId: "G-Y8N951FX2N"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const errorMsg = document.getElementById("errorMsg");

window.login = async function () {
  errorMsg.textContent = "";

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    errorMsg.textContent = "Please enter both email and password.";
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (!user.emailVerified) {
      errorMsg.textContent = "Please verify your email before logging in.";
      await auth.signOut();
      return;
    }

    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      errorMsg.textContent = "User data not found in database.";
      await auth.signOut();
      return;
    }

    setTimeout(() => {
      window.location.href = "userpanel.html";
    }, 2500);

  } catch (error) {
    console.error("Login error:", error.code);
    const code = error.code;

    if (code === 'auth/user-not-found') {
      errorMsg.textContent = "No user found with this email.";
    } else if (code === 'auth/wrong-password') {
      errorMsg.textContent = "Incorrect password.";
    } else if (code === 'auth/too-many-requests') {
      errorMsg.textContent = "Too many failed attempts. Please try again later.";
    } else {
      errorMsg.textContent = "Login failed: " + code;
    }
  }
};
