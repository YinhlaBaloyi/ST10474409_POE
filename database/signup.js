// signup.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification
} from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";
import {
  getFirestore,
  setDoc,
  doc
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
const successMsg = document.getElementById("successMsg");

window.signup = async function () {
  errorMsg.textContent = "";
  successMsg.textContent = "";

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const contact = document.getElementById("contact").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();

  if (!name || !email || !contact || !password || !confirmPassword) {
    errorMsg.textContent = "Please fill in all fields.";
    return;
  }

  if (password !== confirmPassword) {
    errorMsg.textContent = "Passwords do not match.";
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await sendEmailVerification(user);

    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
      contact,
      uid: user.uid,
      createdAt: new Date().toISOString()
    });

    successMsg.textContent = "Account created! Please check your email.";

    setTimeout(() => {
      window.location.href = "login.html";
    }, 3000);

  } catch (error) {
    console.error("Signup error:", error.code);
    const code = error.code;

    if (code === 'auth/email-already-in-use') {
      errorMsg.textContent = "Email already in use.";
    } else if (code === 'auth/weak-password') {
      errorMsg.textContent = "Password should be at least 6 characters.";
    } else {
      errorMsg.textContent = "Signup failed: " + code;
    }
  }
};
