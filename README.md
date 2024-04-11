Order Form Application
This repository contains the code for a web-based order form application, designed to streamline the process of collecting and managing orders. The application utilizes Google Apps Script for server-side operations and plain JavaScript for client-side interactivity. It's structured to interact with Google Sheets as a backend database to store and retrieve order-related data.

Features
User Authentication: Implements a login system to authenticate users before accessing the order form.
Dynamic Dropdowns: Populates dropdown fields dynamically based on the data fetched from Google Sheets.
Order Management: Allows users to create, update, and delete orders.
Data Validation: Ensures data integrity with client-side validation before submitting the form.
Responsive UI: Utilizes Bootstrap to create a responsive and user-friendly interface.
Structure
The application is divided into two main parts:

Client-Side (HTML/CSS/JavaScript)

index.html: The main HTML file containing the structure of the order form.
style.css: CSS file for custom styling.
script.js: JavaScript file for handling client-side logic and interacting with server-side functions.
Server-Side (Google Apps Script)

Code.gs: Contains server-side functions for interacting with Google Sheets, including functions to fetch and update data.
Setup
Spreadsheet Configuration: Set up a Google Sheet to act as your database. Define sheets for orders, users, and any other necessary data.

Google Apps Script:

Create a new Google Apps Script project linked to your Google Sheet.
Copy the server-side script code into Code.gs.
Deploy the script as a web app.
Web Application:

Host the HTML, CSS, and JavaScript files on a suitable platform, or use the Google Apps Script's web app deployment feature.
Data Fetching:

Ensure the client-side script correctly calls server-side functions to fetch and update data.
Usage
Users log in with their credentials.
Upon successful authentication, the user is redirected to the order form.
Users can fill in the order details, with certain fields populated dynamically based on the linked Google Sheet data.
The form supports adding, updating, and deleting orders, with real-time data synchronization with Google Sheets.
Note
Ensure that the Google Apps Script project has the necessary permissions to access and modify the linked Google Sheet.
Configure the web app deployment settings in Google Apps Script to allow access to the intended users.
Contributing
Contributions are welcome. If you have suggestions or improvements, please fork the repo and submit a pull request.

License
This project is open-source and available under the MIT License. See the LICENSE file for more details.
