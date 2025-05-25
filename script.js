console.log("Phrase Bingo website loaded successfully!");

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
const showValidationMessage = (message) => {
  const validationMessage = document.getElementById("validationMessage");
  validationMessage.textContent = message;
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
  
  // Reset any previous duplicate highlights and validation message
  Array.from(phraseInputs).forEach(input => input.classList.remove("duplicate"));
  clearValidationMessage();
  
  // Validate: Ensure all fields are non-empty
  if (phrases.some(phrase => phrase === "")) {
    const errorMsg = "All 24 cells must have a value.";
    console.error(errorMsg);
    showValidationMessage(errorMsg);
    return;
  }
  
  // Validate: Check for duplicates
  const seenPhrases = new Set();
  const duplicates = new Set();
  phrases.forEach((phrase, index) => {
    if (seenPhrases.has(phrase)) {
      duplicates.add(phrase);
    } else {
      seenPhrases.add(phrase);
    }
  });
  
  if (duplicates.size > 0) {
    // Highlight duplicate cells
    phrases.forEach((phrase, index) => {
      if (duplicates.has(phrase)) {
        phraseInputs[index].classList.add("duplicate");
      }
    });
    const errorMsg = "All phrases must be unique. Duplicate phrases are highlighted in red.";
    console.error(errorMsg);
    showValidationMessage(errorMsg);
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

// Attach event listener to submit button
const submitButton = document.getElementById("submitButton");
if (submitButton) {
  submitButton.addEventListener("click", submitPhrases);
} else {
  console.error("Submit button not found");
}