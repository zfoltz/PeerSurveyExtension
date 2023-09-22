// background.js

let extensionEnabled = true; // Initially enabled

// Add a listener for messages from the popup or content script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'toggleExtension') {
    // Toggle the extension state
    extensionEnabled = !extensionEnabled;

    // Send the updated state back to the popup
    sendResponse({ extensionEnabled });

    // Handle any other actions when the extension is toggled on or off
    if (extensionEnabled) {
      // Extension is enabled, perform any necessary actions
    } else {
      // Extension is disabled, perform any necessary actions
    }
  }
});

// Optionally, you can initialize your extension based on the initial state
if (extensionEnabled) {
  // Extension is enabled, perform any necessary initialization
} else {
  // Extension is disabled, perform any necessary initialization
}

// Function to get the "token" cookie value
function getTokenCookie() {
    return new Promise((resolve) => {
      chrome.cookies.get(
        {
          url: 'http://peersurvey.cc.gatech.edu', // Specify the domain where the cookie is set
          name: 'token', // Specify the name of the cookie
        },
        (cookie) => {
          if (cookie) {
            resolve(cookie.value);
          } else {
            console.error('Token cookie not found.');
            resolve(null);
          }
        }
      );
    });
  }
  
async function sendToken(sendResponse) {
    const token = await getTokenCookie();
    sendResponse({ token });
}


  // Listen for messages from the content script
  chrome.runtime.onMessage.addListener( (request, sender, sendResponse) => {
    //sendResponse('asd');
    if (request.action === 'getToken') {
      sendToken(sendResponse);
      return true;
    }
  });