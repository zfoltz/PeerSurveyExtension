// popup.js
document.addEventListener('DOMContentLoaded', function () {
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
  