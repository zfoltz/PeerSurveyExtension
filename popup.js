// popup.js
document.addEventListener('DOMContentLoaded', function () {
    // Fetch the survey count from local storage (if available)
    chrome.storage.local.get('surveyCount', function (data) {
      const surveyCount = data.surveyCount || 'N/A';
      document.getElementById('surveyCount').textContent = surveyCount;
    });
  });
  