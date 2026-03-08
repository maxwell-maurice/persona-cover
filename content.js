console.log("Persona Cover content script loaded.");

// Cross-browser extension API
const extAPI = typeof browser !== "undefined" ? browser : chrome;

// Listen for transform requests from the popup
extAPI.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action !== "transformText") return;

  console.log("[Persona Cover] Received request to transform text.");

  const composeBox = document.querySelector('[data-testid="tweetTextarea_0"]');

  if (!composeBox) {
    console.warn(
      "[Persona Cover] Could not find X.com compose box on this page.",
    );
    sendResponse({ success: false, error: "Could not find the compose box. Are you on the right page?" });
    return;
  }

  const currentText = composeBox.textContent;

  if (!currentText || currentText.trim() === "") {
    console.warn("[Persona Cover] Compose box is empty.");
    sendResponse({ success: false, error: "Compose box is empty! Please type something first." });
    return;
  }

  console.log(
    "[Persona Cover] Sending text to background for Groq processing...",
  );

  // Delegate API call to background script
  extAPI.runtime.sendMessage(
    { action: "callGroq", text: currentText, persona: message.persona },
    (response) => {
      if (!response) {
        sendResponse({ success: false, error: extAPI.runtime.lastError?.message || "Unknown error calling background process." });
        return;
      }
      if (response.error) {
        console.error("[Persona Cover] Error from Groq:", response.error);
        sendResponse({ success: false, error: response.error });
        return;
      }

      if (response.success && response.text) {
        composeBox.focus();
        document.execCommand("selectAll", false, null);

        const success = document.execCommand(
          "insertText",
          false,
          response.text,
        );

        if (!success) {
          console.warn(
            "[Persona Cover] execCommand failed, falling back to textContent.",
          );
          composeBox.textContent = response.text;
          composeBox.dispatchEvent(new Event("input", { bubbles: true }));
        }

        console.log("[Persona Cover] Successfully injected transformed text.");
        sendResponse({ success: true });
      } else {
        sendResponse({ success: false, error: "Unknown error processing text." });
      }
    },
  );

  return true;
});
