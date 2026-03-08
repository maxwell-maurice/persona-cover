const extAPI = typeof browser !== "undefined" ? browser : chrome;

document.addEventListener("DOMContentLoaded", () => {
  const transformBtn = document.getElementById("transformBtn");
  const settingsBtn = document.getElementById("settingsBtn");
  const statusDiv = document.getElementById("status");

  // Pre-fill API key on load
  extAPI.storage.local.get(["apiKey"]).then((result) => {
    if (result.apiKey) {
      document.getElementById("apiKey").value = result.apiKey;
    }
  });

  // Settings
  settingsBtn.addEventListener("click", () => {
    document.getElementById("main-view").style.display = "none";
    document.getElementById("settings-view").style.display = "block";
  });

  document.getElementById("save").addEventListener("click", async () => {
    const saveBtn = document.getElementById("save");
    const key = document.getElementById("apiKey").value.trim();
    await extAPI.storage.local.set({ apiKey: key });
    
    const originalText = saveBtn.textContent;
    saveBtn.textContent = "Saved!";
    setTimeout(() => {
      saveBtn.textContent = originalText;
    }, 2000);
  });

  document.getElementById("back").addEventListener("click", () => {
    document.getElementById("main-view").style.display = "block";
    document.getElementById("settings-view").style.display = "none";
  });

  // Trigger transformation
  transformBtn.addEventListener("click", () => {
    const originalText = transformBtn.textContent;
    transformBtn.textContent = "Transforming...";
    transformBtn.disabled = true;

    // Read persona at runtime from the select element
    const persona = document.getElementById("persona").value;

    extAPI.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) {
        transformBtn.textContent = originalText;
        transformBtn.disabled = false;
        return;
      }
      
      extAPI.tabs.sendMessage(
        tabs[0].id,
        { action: "transformText", persona },
        (response) => {
          if (extAPI.runtime.lastError) {
            statusDiv.textContent = "Error: Please reload the page to use Persona Cover.";
            statusDiv.style.color = "red";
          } else if (response && response.error) {
            statusDiv.textContent = "Error: " + response.error;
            statusDiv.style.color = "red";
          } else if (response && response.success) {
            statusDiv.textContent = "Success!";
            statusDiv.style.color = "green";
            setTimeout(() => {
              if (statusDiv.textContent === "Success!") statusDiv.textContent = "";
            }, 3000);
          } else {
            statusDiv.textContent = "Unknown error occurred.";
            statusDiv.style.color = "red";
          }

          setTimeout(() => {
            transformBtn.textContent = originalText;
            transformBtn.disabled = false;
          }, 500);
        },
      );
    });
  });
});
