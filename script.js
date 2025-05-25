console.log("Phrase Bingo website loaded successfully!");

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Initialize Firebase using environment variables
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.MEASUREMENT_ID
};

//debug:
console.log("Firebase Config:", firebaseConfig);

// Initialize Firebase app and Firestore
firebase.initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = firebase.firestore();

// Submit a new phrase to Firestore
function submitMessage() {
  const messageInput = document.getElementById("messageInput");
  const message = messageInput.value.trim();
  
  if (message) {
    db.collection("messages").add({
      text: message,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
      console.log("Phrase added successfully!");
      messageInput.value = ""; // Clear input
    })
    .catch((error) => {
      console.error("Error adding phrase: ", error);
      alert("Failed to submit phrase.");
    });
  } else {
    alert("Please enter a phrase.");
  }
}

// Real-time listener for phrases
db.collection("messages")
  .orderBy("timestamp", "desc")
  .onSnapshot((snapshot) => {
    const messageList = document.getElementById("messageList");
    messageList.innerHTML = ""; // Clear existing list
    snapshot.forEach((doc) => {
      const message = doc.data().text;
      const li = document.createElement("li");
      li.textContent = message;
      messageList.appendChild(li);
    });
  }, (error) => {
    console.error("Error fetching phrases: ", error);
  });
