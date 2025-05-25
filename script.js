console.log("Phrase Bingo website loaded successfully!");

// Load phrases from sessionStorage on page load
const loadPhrases = () => {
  const displayGrid = document.getElementById("displayGrid");
  const phraseDisplays = displayGrid.getElementsByClassName("phrase-display");
  const phrases = JSON.parse(sessionStorage.getItem("phrases")) || Array(24).fill("");
  
  Array.from(phraseDisplays).forEach((display, index) => {
    display.textContent = phrases[index] || "";
  });
};

// Submit all 24 phrases to sessionStorage
function submitPhrases() {
  const inputGrid = document.getElementById("inputGrid");
  const phraseInputs = inputGrid.getElementsByClassName("phrase-input");
  const phrases = Array.from(phraseInputs).map(input => input.value.trim());
  
  console.log("Attempting to submit phrases:", phrases);
  
  // Validate: Ensure at least one phrase is entered
  if (phrases.every(phrase => phrase === "")) {
    const errorMsg = "Please enter at least one phrase.";
    console.error(errorMsg);
    alert(errorMsg);
    return;
  }
  
  // Store phrases in sessionStorage
  sessionStorage.setItem("phrases", JSON.stringify(phrases));
  console.log("Phrases added successfully!");
  
  // Clear input fields
  Array.from(phraseInputs).forEach(input => input.value = "");
  
  // Reload phrases into display grid
  loadPhrases();
}

// Attach event listener to submit button
const submitButton = document.getElementById("submitButton");
if (submitButton) {
  submitButton.addEventListener("click", submitPhrases);
} else {
  console.error("Submit button not found");
}

// Initial load of phrases
loadPhrases();