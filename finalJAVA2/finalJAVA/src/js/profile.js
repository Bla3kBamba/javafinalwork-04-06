import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

const isAuthenticated = localStorage.getItem("userId");

const checkStatus = () => {
  if (!isAuthenticated) return (window.location.href = "/pages/login.html");
};
checkStatus();

const loadUserData = async () => {
  const docRef = doc(db, "users", isAuthenticated);
  const docSnap = await getDoc(docRef);

  const firstName = document.getElementById("first-name");
  const lastName = document.getElementById("last-name");
  const username = document.getElementById("username");
  const age = document.getElementById("age");
  const email = document.getElementById("email");

  if (docSnap.exists()) {
    const data = docSnap.data();
    firstName.value = data.firstName;
    lastName.value = data.lastName;
    username.value = data.username;
    age.value = data.age;
    email.value = data.email;
  } else {
    console.log("No such document!");
  }
};

document.addEventListener("DOMContentLoaded", loadUserData);

const submitBtn = document.getElementById("submitBtn");
const userId = localStorage.getItem("userId");

submitBtn.addEventListener("click", async (event) => {
  event.preventDefault();
  const docRef = doc(db, "users", userId);
  const updatedUser = {
    firstName: document.getElementById("first-name").value,
    lastName: document.getElementById("last-name").value,
    username: document.getElementById("username").value,
    email: document.getElementById("email").value,
    age: document.getElementById("age").value,
  };
  try {
    await setDoc(docRef, updatedUser);
    alert("User Updated!");
    window.location.reload();
  } catch (error) {
    alert("Something went wrong");
  }
});
