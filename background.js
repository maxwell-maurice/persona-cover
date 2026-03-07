// Fires when the extension is first installed or updated
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed and background service worker active.');
  
  // Example of saving an initial value using the storage API
  chrome.storage.sync.set({ initialized: true });
});
