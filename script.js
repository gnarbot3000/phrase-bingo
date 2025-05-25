console.log("Phrase Bingo website loaded successfully!");

// Load phrases from sessionStorage on page load
const loadPhrases = () => {
  const messageList = document.getElementById("messageList");
  messageList.innerHTML = "";
  const phrases = JSON.parse(sessionStorage.getItem("phrases")) || [];
  if (phrases.length === 0) {
    messageList.innerHTML = "<li>No phrases added this session</li>";
  } else {
    phrases.forEach((phrase) => {
      const li = document.createElement("li");
      li.textContent = phrase.text;
      messageList.appendChild(li);
    });
  }
};

// Submit a new phrase to sessionStorage
function submitMessage() {
  const messageInput = document.getElementById("messageInput");
  const message = messageInput.value.trim();
  console.log("Attempting to submit phrase:", message);
  if (message) {
    const phrases = JSON.parse(sessionStorage.getItem("phrases")) || [];
    phrases.push({ text: message, timestamp: new Date().toISOString() });
    sessionStorage.setItem("phrases", JSON.stringify(phrases));
    console.log("Phrase added successfully!");
    messageInput.value = "";
    loadPhrases();
  } else {
    const errorMsg = "Please enter a phrase.";
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

// Initial load of phrases
loadPhrases();