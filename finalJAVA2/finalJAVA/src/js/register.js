import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBQJKI0TyLdZzZXGsEEDFtXDqNxPLyhBZs",
  authDomain: "shiftwork-65195.firebaseapp.com",
  projectId: "shiftwork-65195",
  storageBucket: "shiftwork-65195.appspot.com",
  messagingSenderId: "928745427237",
  appId: "1:928745427237:web:9fcd5679f4c4833dbbcacc",
  measurementId: "G-CTQLSGFD24"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const checkStatus = () => {
  const isAuthenticated = localStorage.getItem("userId");
  if (isAuthenticated) {
    window.location.href = "index.html";
  }
};

checkStatus();

const submitBtn = document.getElementById("submitBtn");

submitBtn.addEventListener("click", async (event) => {
  event.preventDefault();
  const firstName = document.getElementById("first-name").value;
  const lastName = document.getElementById("last-name").value;
  const username = document.getElementById("username").value;
  const age = document.getElementById("age").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!firstName || !lastName || !username || !age || !email || !password) {
    alert("All fields are required!");
    return;
  }

  console.log("Starting registration process");
  console.log("Email: ", email);
  console.log("Password: ", password);

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("User created:", user);

    const docRef = doc(db, "users", user.uid);
    const newUser = {
      firstName,
      lastName,
      username,
      email,
      age,
    };
    console.log("Adding user to Firestore:", newUser);

    await setDoc(docRef, newUser);
    alert("Register success!");
    window.location.href = "login.html";
  } catch (error) {
    console.error("Error creating user:", error);
    alert(`Error: ${error.message}`);
  }
});
