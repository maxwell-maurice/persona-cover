// Cross-browser extension API
const extAPI = typeof browser !== "undefined" ? browser : chrome;

extAPI.runtime.onInstalled.addListener(() => {
  console.log("Extension installed and background active.");
});

extAPI.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action !== "callGroq") return;

  const { text } = message;

  extAPI.storage.sync.get(["apiKey"], async (result) => {
    if (!result.apiKey) {
      sendResponse({
        error:
          "Missing Groq API Key. Please configure it in the popup settings.",
      });
      return;
    }

    const apiKey = result.apiKey;
    const persona =
      message.persona || "Professional corporate director speaking on LinkedIn";

    const prompt = `Rewrite the following text to sound like a ${persona}. Keep the core meaning the same, just change the tone. Output ONLY the rewritten text, nothing else, no quotes, no introductory conversational fluff.

Text: ${text}`;

    try {
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            max_tokens: 1024,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        sendResponse({
          error: `Groq API error ${response.status}: ${data.error?.message || "Unknown error"}`,
        });
        return;
      }

      const transformedText = data.choices?.[0]?.message?.content;

      if (transformedText) {
        sendResponse({ success: true, text: transformedText.trim() });
      } else {
        sendResponse({ error: "No transformed text returned from Groq API." });
      }
    } catch (err) {
      console.error("Groq API request error:", err);
      sendResponse({ error: err.toString() });
    }
  });

  // Return true to indicate async sendResponse
  return true;
});
