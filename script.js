import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

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

// Debug: Log Firebase config
console.log("Firebase Config:", firebaseConfig);

// Initialize Firebase app and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Submit a new phrase to Firestore
function submitMessage() {
  const messageInput = document.getElementById("messageInput");
  const message = messageInput.value.trim();
  console.log("Attempting to submit phrase:", message);
  if (message) {
    addDoc(collection(db, "messages"), {
      text: message,
      timestamp: new Date() // Use client-side timestamp as fallback
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
    alert("Please enter a phrase.");
  }
}

// Real-time listener for phrases
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
