# Survey Counter Chrome Extension

## Overview

The Survey Counter Chrome Extension is a handy tool that displays the total number of surveys available on a specific webpage. It works by fetching data from an API endpoint and counting the surveys in the response payload.

![Extension Icon](images/icon128.png)

## Table of Contents

- [Getting Started](#getting-started)
- [How It Works](#how-it-works)
- [License](#license)
- [Contributing](#contributing)
- [Acknowledgments](#acknowledgments)

## Getting Started

To use the Survey Counter Chrome Extension, follow these steps:

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/your-username/survey-counter-extension.git
2. Open Google Chrome and navigate to chrome://extensions/.

3. Enable "Developer mode" in the top right corner of the extensions page.

4. Click on the "Load unpacked" button and select the extension directory (survey-counter-extension) from your local machine.

5. The extension icon Extension Icon should now appear in your Chrome toolbar.

6. Navigate to the webpage where surveys are available, and click the extension icon to see the total number of surveys displayed.

## How It Works
The extension works by:

1. Accessing a specific webpage where surveys are available.

2. Intercepting the API request made by the webpage to retrieve survey data.

3. Counting the number of surveys in the API response payload.

4. Displaying the total survey count in a popup when the extension icon is clicked.

Please note that the exact structure of the API response may vary depending on the webpage. The extension is designed to work with a specific API endpoint (e.g., http://peersurvey.cc.gatech.edu/api/v1/dashboard), so it will not work on other websites without modifications.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing
Contributions are welcome! Here are some ways you can contribute to the project:

- Report bugs or issues by creating a new issue.

- Submit feature requests or suggestions via issues.

- Fork the repository, make changes, and create a pull request to contribute code.

- Please read our Contributing Guidelines for more details on how to contribute to this project.

## Acknowledgments
The Survey Counter Chrome Extension was inspired by the need to count surveys on webpages easily.

Special thanks to the Chrome Extension developer community for their valuable insights and resources.