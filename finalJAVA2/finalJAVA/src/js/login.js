import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
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
const auth = getAuth(app);

const checkStatus = () => {
  const isAuthenticated = localStorage.getItem("userId");
  if (isAuthenticated) return (window.location.href = "/");
};
checkStatus();

const submitBtn = document.getElementById("submitBtn");

submitBtn.addEventListener("click", (event) => {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      localStorage.setItem("userId", user.uid);
      window.location.href = "/";
    })
    .catch((error) => {
      alert("Invalid email or password!");
    });
});
