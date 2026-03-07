document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('actionBtn');

  button.addEventListener('click', () => {
    // Cross-browser extension API
    const extAPI = typeof browser !== 'undefined' ? browser : chrome;

    extAPI.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        extAPI.tabs.sendMessage(tabs[0].id, { action: "injectRandomWords" })
          .catch(err => console.error("Could not send message to tab. Is the page a compatible URL?", err));
      }
    });
  });
});
