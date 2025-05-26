console.log("Phrase Bingo website loaded successfully!");

// Import Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getFirestore, doc, setDoc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

// Log window.env to debug environment variables
console.log("window.env:", window.env);

// Firebase configuration using window.env
const firebaseConfig = {
  apiKey: window.env.FIREBASE_API_KEY,
  authDomain: window.env.FIREBASE_AUTH_DOMAIN,
  projectId: window.env.FIREBASE_PROJECT_ID,
  storageBucket: window.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: window.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: window.env.FIREBASE_APP_ID,
  measurementId: window.env.FIREBASE_MEASUREMENT_ID
};

// Log firebaseConfig to debug
console.log("firebaseConfig:", firebaseConfig);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Load phrases from sessionStorage and display them
const loadPhrases = () => {
  const displayGrid = document.getElementById("displayGrid");
  const phraseDisplays = displayGrid.getElementsByClassName("phrase-display");
  const phrases = JSON.parse(sessionStorage.getItem("phrases")) || Array(24).fill("");
  
  Array.from(phraseDisplays).forEach((display, index) => {
    display.textContent = phrases[index] || "";
  });
};

// Display validation message
const showValidationMessage = (messages) => {
  const validationMessage = document.getElementById("validationMessage");
  validationMessage.textContent = messages.join(" ");
};

// Clear validation message
const clearValidationMessage = () => {
  const validationMessage = document.getElementById("validationMessage");
  validationMessage.textContent = "";
};

// Submit all 24 phrases to sessionStorage and toggle visibility
function submitPhrases() {
  const inputGrid = document.getElementById("inputGrid");
  const phraseInputs = inputGrid.getElementsByClassName("phrase-input");
  const phrases = Array.from(phraseInputs).map(input => input.value.trim());
  
  console.log("Attempting to submit phrases:", phrases);
  
  // Reset any previous highlights and validation message
  Array.from(phraseInputs).forEach(input => input.classList.remove("duplicate"));
  clearValidationMessage();
  
  // Collect all validation errors
  const errors = [];
  
  // Validate: Check for empty fields and highlight them
  const emptyIndices = [];
  phrases.forEach((phrase, index) => {
    if (phrase === "") {
      emptyIndices.push(index);
    }
  });
  if (emptyIndices.length > 0) {
    emptyIndices.forEach(index => {
      phraseInputs[index].classList.add("duplicate");
    });
    errors.push("All 24 cells must have a value. Empty cells are highlighted in red.");
  }
  
  // Validate: Check for duplicates and highlight them
  const seenPhrases = new Set();
  const duplicates = new Set();
  phrases.forEach((phrase, index) => {
    if (phrase && seenPhrases.has(phrase)) {
      duplicates.add(phrase);
    } else {
      seenPhrases.add(phrase);
    }
  });
  
  if (duplicates.size > 0) {
    phrases.forEach((phrase, index) => {
      if (duplicates.has(phrase)) {
        phraseInputs[index].classList.add("duplicate");
      }
    });
    errors.push("All phrases must be unique. Duplicate phrases are highlighted in red.");
  }
  
  // If there are any errors, display them and stop
  if (errors.length > 0) {
    console.error("Validation errors:", errors);
    showValidationMessage(errors);
    return;
  }
  
  // Store phrases in sessionStorage
  sessionStorage.setItem("phrases", JSON.stringify(phrases));
  console.log("Phrases added successfully!");
  
  // Clear input fields
  Array.from(phraseInputs).forEach(input => input.value = "");
  
  // Hide input section and show display section
  document.getElementById("inputSection").style.display = "none";
  document.getElementById("displaySection").style.display = "block";
  
  // Load phrases into display grid
  loadPhrases();
}

// Enable/disable Create Game button based on Game Name input
function setupGameNameInput() {
  const gameNameInput = document.getElementById("gameNameInput");
  const createGameButton = document.getElementById("createGameButton");
  
  gameNameInput.addEventListener("input", () => {
    const gameName = gameNameInput.value.trim();
    createGameButton.disabled = gameName === "";
  });
}

// Store game data in Firestore
async function createGame() {
  const gameNameInput = document.getElementById("gameNameInput");
  const gameName = gameNameInput.value.trim();
  const phrases = JSON.parse(sessionStorage.getItem("phrases")) || Array(24).fill("");
  
  try {
    // Use gameName as the document ID in the 'games' collection
    await setDoc(doc(db, "games", gameName), {
      gameName: gameName,
      phrases: phrases,
      createdAt: new Date().toISOString()
    });
    console.log("Game created successfully in Firestore with name:", gameName);
    alert("Game created successfully!");
  } catch (error) {
    console.error("Error creating game in Firestore:", error);
    alert("Failed to create game. Please try again.");
  }
}

// Attach event listeners
const submitButton = document.getElementById("submitButton");
if (submitButton) {
  submitButton.addEventListener("click", () => {
    submitPhrases();
    setupGameNameInput();
  });
} else {
  console.error("Submit button not found");
}

const createGameButton = document.getElementById("createGameButton");
if (createGameButton) {
  createGameButton.addEventListener("click", createGame);
} else {
  console.error("Create Game button not found");
}