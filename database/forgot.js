import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCnvwSM2KK9JR7k3n7H1rGa6UaF7b0CA90",
  authDomain: "etfs-51c62.firebaseapp.com",
  projectId: "etfs-51c62",
  storageBucket: "etfs-51c62.appspot.com",
  messagingSenderId: "410894331276",
  appId: "1:410894331276:web:fa778466b6146d0499baa9",
  measurementId: "G-Y8N951FX2N"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const resetBtn = document.getElementById("resetBtn");
const emailInput = document.getElementById("resetEmail");
const messageDiv = document.getElementById("resetMessage");

resetBtn.addEventListener("click", async () => {
  const email = emailInput.value.trim();
  messageDiv.textContent = "";
  messageDiv.className = "message";

  if (!email) {
    messageDiv.textContent = "Please enter your email address.";
    messageDiv.classList.add("error");
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    messageDiv.textContent = "Password reset email sent. Please check your inbox.";
    messageDiv.classList.add("success");
  } catch (error) {
    console.error("Reset error:", error.code);
    if (error.code === "auth/user-not-found") {
      messageDiv.textContent = "No account found with that email.";
    } else if (error.code === "auth/invalid-email") {
      messageDiv.textContent = "Invalid email address.";
    } else {
      messageDiv.textContent = "Failed to send reset email. Try again.";
    }
    messageDiv.classList.add("error");
  }
});
