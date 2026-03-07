const extAPI = typeof browser !== 'undefined' ? browser : chrome;

document.addEventListener('DOMContentLoaded', () => {
  const transformBtn = document.getElementById('transformBtn');
  const settingsBtn = document.getElementById('settingsBtn');
  const statusDiv = document.getElementById('status');

  // Settings
  settingsBtn.addEventListener('click', () => {
    document.getElementById("main-view").style.display = "none";
    document.getElementById("settings-view").style.display = "block";
  });

  document.getElementById("save").addEventListener("click", async () => {
    const key = document.getElementById("apiKey").value.trim();
    await browser.storage.local.set({ groqApiKey: key });
    alert("Saved!");
  });

  document.getElementById("back").addEventListener("click", () => {
    document.getElementById("main-view").style.display = "block";
    document.getElementById("settings-view").style.display = "none";
  });

  // Trigger transformation
  transformBtn.addEventListener('click', () => {
    // Briefly show loading
    const originalText = transformBtn.textContent;
    transformBtn.textContent = "Transforming...";
    transformBtn.disabled = true;


    const personaSelect = document.getElementById('persona');
    extAPI.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        extAPI.tabs.sendMessage(tabs[0].id, { action: "transformText" }, (response) => {
          // Reset button after slight delay to ensure user sees interaction
          setTimeout(() => {
            transformBtn.textContent = originalText;
            transformBtn.disabled = false;
          }, 500);
        });
      }
    });
  });
});
