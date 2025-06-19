
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import { getAuth, onAuthStateChanged, deleteUser } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";
import { getFirestore, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-firestore.js";


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
const db = getFirestore(app);

const confirmBtn = document.getElementById("confirmDelete");

confirmBtn.addEventListener("click", async () => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userRef = doc(db, "users", user.uid);
      try {
        await deleteDoc(userRef);       
        await deleteUser(user);         
        alert("Your account has been deleted successfully.");
        window.location.href = "userpanel.html";
      } catch (error) {
        console.error("Error deleting account:", error);
        alert("Failed to delete account. Please re-login and try again.");
      }
    }
  });
});
