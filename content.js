console.log("Persona Cover content script loaded on X.");

// Listen to all input events on the page using event delegation
document.addEventListener('input', (event) => {
  const target = event.target;

  // X's compose box typically has data-testid="tweetTextarea_0"
  // It's a localized div with contenteditable="true"
  if (target.getAttribute && target.getAttribute('data-testid') === 'tweetTextarea_0') {
    // We can read textContent to grab the raw text
    const typedText = target.textContent;
    console.log("[Persona Cover] User is typing:", typedText);
  }
}, true); // Use capture phase to ensure we catch changes early

// Array of random words for our "cover persona"
const randomWords = [
  "synergy", "paradigm", "blockchain", "quantum", "orthogonal", 
  "aesthetic", "vibes", "literally", "mindset", "hustle", 
  "coffee", "grind", "alignment", "bandwidth", "pivot"
];

function generateRandomPhrase() {
  const numWords = Math.floor(Math.random() * 5) + 3; // 3 to 7 words
  const phrase = [];
  for (let i = 0; i < numWords; i++) {
    const randomIndex = Math.floor(Math.random() * randomWords.length);
    phrase.push(randomWords[randomIndex]);
  }
  return phrase.join(" ") + ".";
}

// Cross-browser extension API
const extAPI = typeof browser !== 'undefined' ? browser : chrome;

extAPI.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "injectRandomWords") {
    console.log("[Persona Cover] Received request to inject random words.");
    
    // Find the compose box
    const composeBox = document.querySelector('[data-testid="tweetTextarea_0"]');
    
    if (composeBox) {
      const newText = generateRandomPhrase();
      
      // Need to focus for document.execCommand to target it
      composeBox.focus();
      
      // Select all existing text if we want to replace it entirely
      document.execCommand('selectAll', false, null);
      
      // Use execCommand to insert text; this tricks React/Draft.js into 
      // registering the change and updating its internal state
      const success = document.execCommand('insertText', false, newText);
      
      if (!success) {
        console.warn("[Persona Cover] execCommand failed, fallback to textContent (may not trigger React).");
        composeBox.textContent = newText;
        
        // Dispatching input events as fallback
        composeBox.dispatchEvent(new Event('input', { bubbles: true }));
      }
      
      console.log("[Persona Cover] Injected:", newText);
    } else {
      console.warn("[Persona Cover] Could not find X.com compose box on this page.");
    }
  }
});
