  README

Cypress Project - E2E Web Automation
====================================

This project is designed for end-to-end (E2E) testing of a web application using Cypress. It includes tests for user interactions such as logging in, adding products to the cart, filling out address details, selecting delivery options, and completing the order process.

Prerequisites
-------------

Ensure you have the following installed:

1.  **Node.js**: [Download and install Node.js](https://nodejs.org/)
2.  **npm**: Installed along with Node.js
3.  **Cypress**: Installed as part of this project

Dependencies
------------

The project uses the following dependencies:

        `"devDependencies": {   "cypress": "^13.16.0",   "cypress-recurse": "^1.35.3",   "cypress-xpath": "^2.0.1" }, "dependencies": {   "cypress-if": "^1.13.1" }`
        
    

Installation
------------

1.  Clone the repository: `git clone <repository-url>`
2.  Navigate to the project directory: `cd <project-folder>`
3.  Install dependencies: `npm install`

Running Tests
-------------

### Run a Single Spec File

To execute a specific test file, use:

    npx cypress open

### Run in Headless Mode

To run all tests in headless mode, use:

    npx cypress run

Scripts
-------

The following scripts are available in `package.json`:

*   `npm run test:web`: Run Cypress tests
*   `npm run generate-report`: Generate Allure reports

Reporting
---------

Generate test reports using Allure:

    npm run generate-report

File Structure
--------------

       project-root/
├── cypress/
│   ├── e2e/              # Test specs
│   ├── fixtures/         # Test data (JSON files)
│   ├── pages/            # Page Object Models
│   ├── commands.js       # Custom Cypress commands
│   ├── support/          # Support files
├── reports/              # Allure reports folder
├── cypress.config.js     # Cypress configuration
├── package.json          # Dependencies and scripts
        
    

Usage
-----


*   **Writing Tests**

All tests are located in the `cypress/e2e/` directory. Each test case follows the structured pattern of:

1.  Navigating to the application
2.  Performing actions (e.g., logging in, adding products)
3.  Validating the results (e.g., checking basket count, total price)
