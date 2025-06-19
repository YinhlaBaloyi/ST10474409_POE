
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import { getAuth, onAuthStateChanged, updateEmail, sendEmailVerification } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-firestore.js";

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

const fullNameInput = document.getElementById("fullName");
const contactInput = document.getElementById("contact");
const emailInput = document.getElementById("email");
const updateBtn = document.getElementById("updateBtn");
const messageDiv = document.getElementById("message");


onAuthStateChanged(auth, async (user) => {
  if (user) {
    emailInput.value = user.email;

    try {
      const userDocRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userDocRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        fullNameInput.value = data.name || "";
        contactInput.value = data.contact || "";
      }
    } catch (error) {
      messageDiv.textContent = "Failed to load user data.";
      messageDiv.className = "msg error";
      console.error("Firestore fetch error:", error);
    }
  } else {
    window.location.href = "login.html";
  }
});

updateBtn.addEventListener("click", async () => {
  messageDiv.textContent = "";
  messageDiv.className = "msg";

  const user = auth.currentUser;
  if (!user) {
    messageDiv.textContent = "User not logged in.";
    messageDiv.className = "msg error";
    return;
  }

  const newName = fullNameInput.value.trim();
  const newContact = contactInput.value.trim();
  const newEmail = emailInput.value.trim();

  if (!newName || !newContact || !newEmail) {
    messageDiv.textContent = "Please fill all fields.";
    messageDiv.className = "msg error";
    return;
  }

  try {
    if (newEmail !== user.email) {
      await updateEmail(user, newEmail);
      await sendEmailVerification(user);
      messageDiv.textContent = "Email updated. Verification email sent. Please verify your new email.";
      messageDiv.className = "msg success";
    }

    const userDocRef = doc(db, "users", user.uid);
    await setDoc(userDocRef, {
      name: newName,
      contact: newContact,
      email: newEmail,
      uid: user.uid,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    if (newEmail === user.email) {
      messageDiv.textContent = "Profile updated successfully.";
      messageDiv.className = "msg success";
    }

  } catch (error) {
    console.error("Update error:", error);
    messageDiv.textContent = "Update failed: " + error.message;
    messageDiv.className = "msg error";

    if (error.code === 'auth/requires-recent-login') {
      messageDiv.textContent += " Please log out and log back in before changing your email.";
    }
  }
});
