# Front End Server

This repository contains the front-end code for a web application that includes a portfolio, a mask detection service, a spam detection service, a Sudoku solver, and a weather application. It utilizes dynamic JavaScript for client-side functionality and integrates with machine learning models for the mask and spam detection features.

## Structure

	@@ -15,17 +15,18 @@ The front-end structure is divided into several directories and files, each serv
- **index.html**: The main entry point of the web application, the homepage.
- **mask_detector.html**: The web interface for the mask detection service.
- **spam_detector.html**: The web interface for the spam detection service.
- **sudoku.html**: The web interface for the Sudoku solver.
- **weather.html**: The web interface for the weather application.

## JavaScript Functionality

- **index_script.js**: Contains general JavaScript code for the homepage, including functions for scrolling, map initialization, content animation, and user interaction responses.
- **mask_script.js**: Handles the mask detection functionality, including file input handling, image preview, and communication with the mask detection API.
- **spam_script.js**: Manages the spam detection feature, processing user input, calling the spam detection API, and displaying the results.
- **sudoku_script.js**: Manages the Sudoku solver functionality, including grid generation, solving the puzzle, and displaying the steps.
- **weather_script.js**: Handles the weather application functionality, including fetching weather data, displaying current weather and forecast, and managing temperature unit conversions.

## PHP Backend

- **contact.php**: Manages the contact form data submission to the backend and database entry.
- **functions.php**: Provides utility functions for database connection and page redirection.
