import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBQJKI0TyLdZzZXGsEEDFtXDqNxPLyhBZs",
  authDomain: "shiftwork-65195.firebaseapp.com",
  projectId: "shiftwork-65195",
  storageBucket: "shiftwork-65195.appspot.com",
  messagingSenderId: "928745427237",
  appId: "1:928745427237:web:9fcd5679f4c4833dbbcacc",
  measurementId: "G-CTQLSGFD24"
};

let app = null;
let db = null;

function initializeFirebase() {
  if (!app) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  }
}

async function getShiftsFromFirestore(userId) {
  try {
    initializeFirebase();
    const q = query(collection(db, "shifts"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const shifts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return shifts;
  } catch (error) {
    console.error("Error getting shifts from Firestore:", error);
    return [];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const isAuthenticated = localStorage.getItem("userId");

  const withAuth = document.querySelector(".with-auth");
  const withoutAuth = document.querySelector(".without-auth");

  const renderNav = () => {
    if (isAuthenticated && withoutAuth) withoutAuth.classList.add("remove");
    if (!isAuthenticated && withAuth) withAuth.classList.add("remove");
  };
  
  renderNav();

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("userId");
      window.location.href = "/pages/login.html";
    });
  }
});
