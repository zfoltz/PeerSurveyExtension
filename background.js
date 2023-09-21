// background.js

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