import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

console.log("Phrase Bingo website loaded successfully!");

// Debug: Log environment variables
console.log("Environment variables:", window.env);

// Initialize Firebase using environment variables
const firebaseConfig = {
  apiKey: window.env.FIREBASE_API_KEY,
  authDomain: window.env.FIREBASE_AUTH_DOMAIN,
  projectId: window.env.FIREBASE_PROJECT_ID,
  storageBucket: window.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: window.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: window.env.FIREBASE_APP_ID,
  measurementId: window.env.MEASUREMENT_ID
};

// Debug: Log Firebase config and validate
console.log("Firebase Config:", firebaseConfig);
try {
  Object.values(firebaseConfig).forEach((value, index) => {
    if (!value || value.includes('$') || value.includes('${')) {
      throw new Error(`Invalid Firebase config at key ${Object.keys(firebaseConfig)[index]}: ${value}`);
    }
  });
} catch (error) {
  console.error("Firebase config validation error:", error.message);
  alert("Firebase configuration error: " + error.message);
}

// Initialize Firebase app and Firestore
let app, db;
try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Firebase initialization error:", error);
  alert("Failed to initialize Firebase: " + error.message);
}

// Submit a new phrase to Firestore
function submitMessage() {
  const messageInput = document.getElementById("messageInput");
  const message = messageInput.value.trim();
  console.log("Attempting to submit phrase:", message);
  if (message && db) {
    addDoc(collection(db, "messages"), {
      text: message,
      timestamp: serverTimestamp()
    })
    .then(() => {
      console.log("Phrase added successfully!");
      messageInput.value = "";
    })
    .catch((error) => {
      console.error("Error adding phrase: ", error);
      alert("Failed to submit phrase: " + error.message);
    });
  } else {
    const errorMsg = !message ? "Please enter a phrase." : "Firestore not initialized.";
    console.error(errorMsg);
    alert(errorMsg);
  }
}

// Attach event listener to submit button
const submitButton = document.getElementById("submitButton");
if (submitButton) {
  submitButton.addEventListener("click", submitMessage);
} else {
  console.error("Submit button not found");
}

// Real-time listener for phrases
if (db) {
  const q = query(collection(db, "messages"), orderBy("timestamp", "desc"));
  onSnapshot(q, (snapshot) => {
    console.log("Snapshot received, size:", snapshot.size);
    const messageList = document.getElementById("messageList");
    messageList.innerHTML = "";
    if (snapshot.empty) {
      console.log("No phrases found");
      messageList.innerHTML = "<li>No phrases available</li>";
    }
    snapshot.forEach((doc) => {
      const message = doc.data().text;
      const li = document.createElement("li");
      li.textContent = message;
      messageList.appendChild(li);
    });
  }, (error) => {
    console.error("Error fetching phrases: ", error);
    alert("Failed to fetch phrases: " + error.message);
  });
} else {
  console.error("Firestore not initialized, skipping listener setup");
  alert("Firestore not initialized, cannot fetch phrases.");
}
