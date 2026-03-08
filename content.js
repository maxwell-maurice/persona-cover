console.log("Persona Cover content script loaded.");

// Cross-browser extension API
const extAPI = typeof browser !== "undefined" ? browser : chrome;

// Listen for typing in X's compose box
document.addEventListener(
  "input",
  (event) => {
    const target = event.target;
    if (target.getAttribute?.("data-testid") === "tweetTextarea_0") {
      console.log("[Persona Cover] User is typing:", target.textContent);
    }
  },
  true,
);

// Listen for transform requests from the popup
extAPI.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action !== "transformText") return;

  console.log("[Persona Cover] Received request to transform text.");

  const composeBox = document.querySelector('[data-testid="tweetTextarea_0"]');

  if (!composeBox) {
    console.warn(
      "[Persona Cover] Could not find X.com compose box on this page.",
    );
    alert("Could not find the compose box. Are you on the right page?");
    sendResponse({ success: false });
    return;
  }

  const currentText = composeBox.textContent;

  if (!currentText || currentText.trim() === "") {
    console.warn("[Persona Cover] Compose box is empty.");
    alert("Compose box is empty! Please type something first.");
    sendResponse({ success: false });
    return;
  }

  console.log(
    "[Persona Cover] Sending text to background for Groq processing...",
  );

  // Delegate API call to background script
  extAPI.runtime.sendMessage(
    { action: "callGroq", text: currentText, persona: message.persona },
    (response) => {
      if (response.error) {
        console.error("[Persona Cover] Error from Groq:", response.error);
        alert("Persona Cover Error: " + response.error);
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
      }
    },
  );
});
