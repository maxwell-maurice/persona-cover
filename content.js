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

// Array of random words for our "cover persona" - NO LONGER USED, KEPT FOR REFERENCE
const randomWords = [
  "synergy", "paradigm", "blockchain", "quantum", "orthogonal", 
  "aesthetic", "vibes", "literally", "mindset", "hustle", 
  "coffee", "grind", "alignment", "bandwidth", "pivot"
];

// Cross-browser extension API
const extAPI = typeof browser !== 'undefined' ? browser : chrome;

extAPI.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "transformText") {
    console.log("[Persona Cover] Received request to transform text.");
    
    // Find the compose box
    const composeBox = document.querySelector('[data-testid="tweetTextarea_0"]');
    
    if (composeBox) {
      // 1. Read existing text
      const currentText = composeBox.textContent;
      
      if (!currentText || currentText.trim() === "") {
        console.warn("[Persona Cover] Compose box is empty.");
        // We could alert here, but we don't have a direct UI, maybe an alert pop
        alert("Compose box is empty! Please type something first.");
        sendResponse({ success: false });
        return;
      }

      console.log("[Persona Cover] Sending text to background for Gemini processing...");

      // 2. Call the background script to talk to Gemini
      extAPI.runtime.sendMessage({ action: "callGemini", text: currentText }, (response) => {
        if (response.error) {
          console.error("[Persona Cover] Error from Gemini:", response.error);
          alert("Persona Cover Error: " + response.error);
          return;
        }

        if (response.success && response.text) {
          const newText = response.text;
          
          // 3. Focus and replace
          composeBox.focus();
          document.execCommand('selectAll', false, null);
          
          const success = document.execCommand('insertText', false, newText);
          
          if (!success) {
            console.warn("[Persona Cover] execCommand failed, fallback to textContent.");
            composeBox.textContent = newText;
            composeBox.dispatchEvent(new Event('input', { bubbles: true }));
          }
          
          console.log("[Persona Cover] Successfully injected transformed text");
        }
      });
      
    } else {
      console.warn("[Persona Cover] Could not find X.com compose box on this page.");
      alert("Could not find the compose box. Are you on the right page?");
    }
  }
});
