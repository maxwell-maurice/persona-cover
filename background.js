// Cross-browser extension API
const extAPI = typeof browser !== 'undefined' ? browser : chrome;

// Fires when the extension is first installed or updated
extAPI.runtime.onInstalled.addListener(() => {
  console.log('Extension installed and background active.');
  
  // Example of saving an initial value using the storage API
  extAPI.storage.sync.set({ initialized: true });
});
