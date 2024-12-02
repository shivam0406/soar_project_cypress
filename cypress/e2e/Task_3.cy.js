// cypress/e2e/userRegistration.cy.js

import { registrationPage } from '../pages/RegistrationPage';
import { loginPage } from '../pages/LoginPage';

describe('User Registration Validation and Login', () => {
    let userData = {};

    before(() => {
        // Load fixture data
        cy.log("We are moving to before section of R&L Page")
        cy.fixture('inputFields_For_Error_Validation.json').as('inputFields');
    });

    it('Should validate input fields, complete registration, and login process', function () {
        // Step 1: Navigate to the registration page
        registrationPage.navigateTo();
        cy.dismissDialog();
        cy.dismissCookieConsent();

        // Step 2: Validate input fields for required error messages
        cy.log('Validating input fields for required error messages...');
        this.inputFields.forEach((field) => {
            registrationPage.validateInputField(field.selector, field.errorMessage);
        });

        // Validate security question dropdown error
        cy.log('Validating the security question dropdown...');
        registrationPage.validateDropdownError();

        // Step 3: Fill in the registration form with generated data
        cy.log('Filling in registration form...');
        userData = {
            email: `user${Math.random().toString(36).substring(7)}@example.com`,
            password: 'Password@123',
        };

        registrationPage.fillRegistrationForm(userData);

        // Step 4: Submit the registration form
        cy.log('Submitting the registration form...');
        registrationPage.submitRegistration();

        // Save user data to a file for later use
        cy.writeFile('cypress/fixtures/userData.json', userData);

        // Validate success snack-bar message
        cy.log('Validating the snack-bar success message...');
        registrationPage.validateSuccessSnackbar();

        // Step 5: Validate redirection to the login page
        cy.log('Validating redirection to the login page...');
        cy.url().should('include', '/login');

        // Step 6: Log in with the registered credentials
        cy.log('Logging in with registered credentials...');
        cy.login(userData.email, userData.password);        
    });
});