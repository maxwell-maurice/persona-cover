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
