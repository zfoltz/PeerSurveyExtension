// content.js

// Function to store the survey count in local storage
function storeSurveyCount(surveyCount) {
    chrome.storage.local.set({ surveyCount });
  }

// Function to store survey difficulty in local storage
function storeSurveyDifficulty(surveyId, difficulty) {
  chrome.storage.local.set({ [surveyId]: difficulty });
}

// Function to retrieve survey difficulty from local storage
async function getSurveyDifficulty(surveyId) {
  return new Promise((resolve) => {
    chrome.storage.local.get([surveyId], (result) => {
      resolve(result[surveyId]);
    });
  });
}

// Function to calculate the difficulty of a surveys questions
function calculateDifficulty(surveyQuestions) {
  let totalPoints = 0;
  surveyQuestions.forEach((question) => {
    if (question.required) {
      if (question.type == "text") {
        totalPoints += 7;
      } else if (question.type == "checkbox") {
        totalPoints += 2;
      } else if (question.type == "radio") {
        totalPoints += 1;
      }
      }
    });
    return totalPoints;
}

// Function to fetch the difficulty for a single survey
async function fetchSurveyDifficulty(token, surveyId) {
  try {
    // Check if the difficulty is already cached
    const cachedDifficulty = await getSurveyDifficulty(surveyId);
    
    if (cachedDifficulty !== undefined) {
      // Return the cached difficulty if available
      return cachedDifficulty;
    }

    // If not cached, make the API request
    const apiUrl = 'http://peersurvey.cc.gatech.edu/api/v1/survey/respond-questions';
    
    // Make the POST request for a single survey
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: surveyId }),
    });

    if (response.ok) {
      const data = await response.json();
      const survey = JSON.parse(data.payload);
      const difficultyScore = calculateDifficulty(survey.questions);

      // Store the difficulty score in cache
      storeSurveyDifficulty(surveyId, difficultyScore);

      return difficultyScore;
    } else {
      console.error(`Failed to fetch survey difficulty for survey ID ${surveyId}:`, response.statusText);
      return 0; // Return 0 if there's an error
    }
  } catch (error) {
    console.error(`Error fetching survey difficulty for survey ID ${surveyId}:`, error);
    return 0; // Return 0 if there's an error
  }
}

// Function to add difficulty scores to each row in the table
async function addDifficultyScoresToTable(token, openSurveys) {
  try {
    // Retrieve the list of survey IDs from your data (replace with your data)
    const surveyIds = openSurveys.slice(0,10).map(obj => obj.id);

    // Use Promise.all to parallelize the requests
    const difficultyScores = await Promise.all(
      surveyIds.map((surveyId) => fetchSurveyDifficulty(token, surveyId))
    );

    // Add a header to the table
    const tableHeader = document.querySelector('#tblResponse thead tr');
    const difficultyHeader = document.createElement('th');
    difficultyHeader.textContent = 'Difficulty';
    difficultyHeader.className = 'Difficulty';
    tableHeader.appendChild(difficultyHeader);

    // Add difficulty scores to each row in the table
    const tableRows = document.querySelectorAll('#tblResponse tbody tr');
    tableRows.forEach((row, index) => {
      const difficulty = difficultyScores[index] || '999'; // Use 'N/A' if no difficulty is available
      const difficultyCell = document.createElement('td');
      difficultyCell.textContent = difficulty;
      difficultyCell.className = 'Difficulty';
      row.appendChild(difficultyCell);
    });

    // Now you have added the difficulty scores to each row in the table
  } catch (error) {
    console.error('Error adding difficulty scores to the table:', error);
  }
}

// Function to add difficulty score as a data attribute to each row
function addDifficultyToRows() {
  const tableRows = document.querySelectorAll('#tblResponse tbody tr');
  tableRows.forEach((row) => {
    // Extract the difficulty score from the "difficulty" column
    const difficultyScore = parseInt(row.querySelector('.Difficulty').textContent, 10);
    
    // Add the difficulty score as a data attribute
    row.setAttribute('data-difficulty', difficultyScore);
  });
}

// Function to sort the table by difficulty (ascending order)
function sortTableByDifficulty() {
  const tableBody = document.querySelector('#tblResponse tbody');
  const rows = Array.from(tableBody.querySelectorAll('tr'));

  // Sort the rows based on the data-difficulty attribute
  rows.sort((a, b) => {
    const difficultyA = parseInt(a.getAttribute('data-difficulty'), 10);
    const difficultyB = parseInt(b.getAttribute('data-difficulty'), 10);
    return difficultyA - difficultyB;
  });

  // Append sorted rows back to the table
  rows.forEach((row) => {
    tableBody.appendChild(row);
  });
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
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify({}), 
      });
  
      if (response.ok) {
        const data = await response.json();
        // Process the data as needed
        let surveys = JSON.parse(data.payload);
        const openSurveys = surveys.courseOpenSurveyList;
        
        const openSurveyCount = openSurveys.length; // Adjust this to your data structure
        storeSurveyCount(openSurveyCount);

        // Add difficulty scores to each row in the table
        await addDifficultyScoresToTable(token, openSurveys);
        addDifficultyToRows();
        sortTableByDifficulty();
      
      } else {
        console.error('Failed to fetch survey data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  
  // Send a message to the background script to request the token
  function main() {
    chrome.runtime.sendMessage({ action: 'getToken' }, (response) => {
        if (response && response.token) {
          // If the token is available, make the API request
          makeApiRequest(response.token);
        }
    });
  }


  if (document.readyState !== 'loading') {
    main();
} else {
    document.addEventListener('DOMContentLoaded', function () {
        main();
    });
}