
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-firestore.js";


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


const welcomeHeader = document.querySelector(".dashboard-header h1");

onAuthStateChanged(auth, async (user) => {
  if (user && user.emailVerified) {
    try {
      const userDocRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const fullName = userData.name || "User";
        welcomeHeader.textContent = `Welcome, ${fullName}`;
      } else {
        welcomeHeader.textContent = "Welcome, User";
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      welcomeHeader.textContent = "Welcome, User";
    }
  } else {
    window.location.href = "login.html";
  }
});
