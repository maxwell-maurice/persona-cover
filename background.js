// Cross-browser extension API
const extAPI = typeof browser !== 'undefined' ? browser : chrome;

// Fires when the extension is first installed or updated
extAPI.runtime.onInstalled.addListener(() => {
  console.log('Extension installed and background active.');
});

extAPI.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'callGemini') {
    const { text } = message;

    extAPI.storage.sync.get(['apiKey', 'persona'], async (result) => {
      if (!result.apiKey) {
        sendResponse({ error: "Missing Gemini API Key. Please configure it in the Persona Cover popup." });
        return;
      }

      const apiKey = result.apiKey;
      const persona = result.persona || "Professional corporate director speaking on LinkedIn";

      const prompt = `Rewrite the following text to sound like a ${persona}. Keep the core meaning the same, just change the tone. Output ONLY the rewritten text, nothing else, no quotes, no introductory conversational fluff.

Text: ${text}`;

      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
            }
          })
        });

        const data = await response.json();

        if (data.error) {
          sendResponse({ error: data.error.message || "Unknown API Error" });
          return;
        }

        const transformedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (transformedText) {
          sendResponse({ success: true, text: transformedText.trim() });
        } else {
          sendResponse({ error: "No transformed text returned from Gemini API." });
        }

      } catch (err) {
        console.error("Gemini API Request error:", err);
        sendResponse({ error: err.toString() });
      }
    });

    // Return true to indicate we will send a response asynchronously
    return true; 
  }
});
