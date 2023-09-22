// popup.js
document.addEventListener('DOMContentLoaded', function () {
    // Add a click event listener to the "Toggle Extension" button
    const toggleExtensionButton = document.getElementById('toggleExtensionButton');

    toggleExtensionButton.addEventListener('click', function () {
      // Send a message to the background script to toggle the extension state
      chrome.runtime.sendMessage({ action: 'toggleExtension' }, function (response) {
        if (response && response.extensionEnabled !== undefined) {
          // Handle the extension state change
          const isEnabled = response.extensionEnabled;
          console.log(`Extension is now ${isEnabled ? 'enabled' : 'disabled'}.`);
        }
      });
    });
      
  // Add a click event listener to the "Clear Cache" button
    const clearCacheButton = document.getElementById('clearCacheButton');

    clearCacheButton.addEventListener('click', function () {
      // Clear the cache in local storage
      chrome.storage.local.clear(function () {
        console.log('Cache cleared.');
      });
    });

    // Fetch the survey count from local storage (if available)
    chrome.storage.local.get('surveyCount', function (data) {
      const surveyCount = data.surveyCount || 'N/A';
      document.getElementById('surveyCount').textContent = surveyCount;
    });
  });
  