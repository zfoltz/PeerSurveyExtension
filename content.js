// content.js

// Function to store the survey count in local storage
function storeSurveyCount(surveyCount) {
    chrome.storage.local.set({ surveyCount });
  }

// Function to make the API request
async function makeApiRequest(token) {
    try {
      const apiUrl = 'http://peersurvey.cc.gatech.edu/api/v1/dashboard';
  
      // Make the API request with the token in the Authorization header
      const response = await fetch(apiUrl, {
        method: 'POST',  // Adjust the method as needed
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json', // Adjust content type as needed
        },
        body: JSON.stringify({}), // Include the request payload if necessary
      });
  
      if (response.ok) {
        const data = await response.json();
        // Process the data as needed
        console.log(data)
        storeSurveyCount(data.courseOpenSurveyList.length);
        const surveyCount = data.courseOpenSurveyList.length; // Adjust this to your data structure
        console.log('Survey Count:', surveyCount);
        // Now you can display the count or perform any other actions
      } else {
        console.error('Failed to fetch survey data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  
  // Send a message to the background script to request the token
  function main() {
    console.log('content.js main() called')
    chrome.runtime.sendMessage({ action: 'getToken' }, (response) => {
        console.log("response is: ", response)
        if (response && response.token) {
        // If the token is available, make the API request
        makeApiRequest(response.token);
      }
    });
  }


  if (document.readyState !== 'loading') {
    console.log('document is already ready, just execute code here');
    main();
} else {
    document.addEventListener('DOMContentLoaded', function () {
        console.log('document was not ready, place code here');
        main();
    });
}