const extAPI = typeof browser !== 'undefined' ? browser : chrome;

document.addEventListener('DOMContentLoaded', () => {
  const apiKeyInput = document.getElementById('apiKey');
  const personaSelect = document.getElementById('persona');
  const saveBtn = document.getElementById('saveBtn');
  const transformBtn = document.getElementById('transformBtn');
  const statusDiv = document.getElementById('status');

  // Load saved config
  extAPI.storage.sync.get(['apiKey', 'persona'], (result) => {
    if (result.apiKey) apiKeyInput.value = result.apiKey;
    if (result.persona) personaSelect.value = result.persona;
  });

  // Save config
  saveBtn.addEventListener('click', () => {
    const apiKey = apiKeyInput.value.trim();
    const persona = personaSelect.value;
    
    extAPI.storage.sync.set({ apiKey, persona }, () => {
      statusDiv.textContent = 'Configuration saved!';
      setTimeout(() => { statusDiv.textContent = ''; }, 2000);
    });
  });

  // Trigger transformation
  transformBtn.addEventListener('click', () => {
    // Briefly show loading
    const originalText = transformBtn.textContent;
    transformBtn.textContent = "Transforming...";
    transformBtn.disabled = true;

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
