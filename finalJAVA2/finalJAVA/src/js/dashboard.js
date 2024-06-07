import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  Timestamp
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

let app = null;
let db = null;

function initializeFirebase() {
  if (!app) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  }
}

async function addShift(userId, shiftData) {
  initializeFirebase();
  try {
    if (!userId) {
      console.error("User ID is not defined.");
      return;
    }
    const shiftWithDate = {
      ...shiftData,
      updateDate: Timestamp.now()
    };
    await addDoc(collection(db, "shifts"), shiftWithDate);
    console.log("Shift added with update date");
  } catch (error) {
    console.error("Error adding shift: ", error);
  }
}

async function getShiftsFromFirestore(userId) {
  initializeFirebase();
  try {
    const q = query(collection(db, "shifts"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const shifts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return shifts;
  } catch (error) {
    console.error("Error getting shifts from Firestore:", error);
    return [];
  }
}

async function getUserName(userId) {
  initializeFirebase();
  try {
    const q = query(collection(db, "users"), where("id", "==", userId));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.docs.length > 0) {
      const userData = querySnapshot.docs[0].data();
      console.log("User data:", userData);
      return userData.name;
    } else {
      return "User";
    }
  } catch (error) {
    console.error("Error getting user name from Firestore:", error);
    return "User";
  }
}

setInterval(updateMetrics, 60000);

function displayLastUpdateTime() {
  const lastUpdateTime = new Date();
  const lastUpdateTimeElement = document.getElementById("lastUpdateTime");
  if (lastUpdateTimeElement) {
    const formattedDate = `${String(lastUpdateTime.getDate()).padStart(2, "0")}/${String(lastUpdateTime.getMonth() + 1).padStart(2, "0")}/${lastUpdateTime.getFullYear()} ${lastUpdateTime.toLocaleTimeString()}`;
    lastUpdateTimeElement.innerText = `Last update: ${formattedDate}`;
  }
}

function getShiftsThisMonth(shifts) {
  if (!shifts || shifts.length === 0) return [];
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  return shifts.filter(shift => {
    if (shift.date) {
      const shiftDate = new Date(shift.date);
      return shiftDate >= startOfMonth && shiftDate <= now;
    }
    return false;
  });
}

function calculateConsecutiveDays(shifts) {
  if (!shifts || shifts.length === 0) return 0;

  // Sort shifts by date
  shifts.sort((a, b) => new Date(a.date) - new Date(b.date));

  console.log("Sorted Shifts:", shifts);

  let consecutiveDays = 0;
  let currentStreak = 0;
  let lastShiftDate = null;

  for (let i = 0; i < shifts.length; i++) {
    const shiftDate = new Date(shifts[i].date);
    console.log("Shift Date:", shiftDate);
    if (lastShiftDate) {
      const timeDiff = shiftDate.getTime() - lastShiftDate.getTime();
      const daysDiff = timeDiff / (1000 * 3600 * 24);
      console.log("Days Difference:", daysDiff);

      if (daysDiff === 1) {
        currentStreak++;
      } else if (daysDiff > 1) {
        currentStreak = 1;
      }
    } else {
      currentStreak = 1;
    }
    lastShiftDate = shiftDate;
    consecutiveDays = Math.max(consecutiveDays, currentStreak);
    console.log("Current Streak:", currentStreak);
    console.log("Consecutive Days:", consecutiveDays);
  }

  return consecutiveDays;
}

async function updateMetrics() {
  initializeFirebase();
  const userId = localStorage.getItem("userId");
  if (!userId) {
    console.error("User ID is not defined.");
    return;
  }

  const userName = await getUserName(userId);
  document.getElementById("user-name").innerText = userName;

  const shifts = await getShiftsFromFirestore(userId);
  console.log(shifts);

  let totalHourlyWages = 0;
  let totalShiftWages = 0;
  const branchCounts = {};
  const roleSalaries = {};

  for (let i = 0; i < shifts.length; i++) {
    const shift = shifts[i];
    totalHourlyWages += parseInt(shift.hourlyWage);

    const startTime = new Date(`2000-01-01T${shift.startTime}`);
    const endTime = new Date(`2000-01-01T${shift.endTime}`);
    const hoursWorked = (endTime - startTime) / (1000 * 60 * 60);
    const salaryForShift = Math.ceil(hoursWorked) * parseFloat(shift.hourlyWage);
    totalShiftWages += salaryForShift;

    if (shift.branch) {
      if (!branchCounts[shift.branch]) {
        branchCounts[shift.branch] = 0;
      }
      branchCounts[shift.branch]++;
    }

    if (shift.role) {
      if (!roleSalaries[shift.role]) {
        roleSalaries[shift.role] = 0;
      }
      roleSalaries[shift.role] += salaryForShift;
    }
  }

  const averageHourlyWage = totalHourlyWages / shifts.length;
  const averageShiftWage = totalShiftWages / shifts.length;
  const mostWorkedBranch = Object.keys(branchCounts).reduce((a, b) => branchCounts[a] > branchCounts[b] ? a : b, "N/A");
  const highestPayingRole = Object.keys(roleSalaries).reduce((a, b) => roleSalaries[a] > roleSalaries[b] ? a : b, "N/A");

  const shiftsThisMonth = getShiftsThisMonth(shifts);
  const consecutiveDays = calculateConsecutiveDays(shifts);

  document.getElementById("average-hourly-wage").innerText = averageHourlyWage.toFixed(1);
  document.getElementById("average-shift-wage").innerText = averageShiftWage.toFixed(1);
  document.getElementById("most-worked-branch").innerText = mostWorkedBranch;
  document.getElementById("highest-paying-role").innerText = highestPayingRole;
  document.getElementById("shiftsLastMonth").innerText = shiftsThisMonth.length;
  document.getElementById("consecutiveDays").innerText = consecutiveDays;

  displayLastUpdateTime();
}

document.addEventListener("DOMContentLoaded", updateMetrics);
