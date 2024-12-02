// cypress/pages/RegistrationPage.js

class RegistrationPage {
    navigateTo() {
        cy.visit('https://juice-shop.herokuapp.com/#/register');
    }

    validateInputField(selector, errorMessage) {
        cy.get(selector).click().blur();
        cy.get('mat-error').should('contain.text', errorMessage);
    }

    validateDropdownError() {
        cy.get('#mat-select-0').click();
        cy.get('body').click();
        cy.get('mat-error').should('contain.text', 'Please select a security question.');
    }

    fillRegistrationForm(userData) {
        cy.get('#emailControl').type(userData.email);
        cy.get('#passwordControl').type(userData.password);
        cy.get('#repeatPasswordControl').type(userData.password);

        // Toggle "Show Password Advice" and validate advice rows
        cy.get('#mat-slide-toggle-1-input').check({ force: true });
        cy.get('mat-card-content .info-row').should('exist');

        // Select a security question and provide an answer
        cy.get('#mat-select-0').click();
        cy.get('mat-option').contains('Your eldest siblings middle name?').click();
        cy.get('#securityAnswerControl').type('Testing');
    }

    submitRegistration() {
        cy.get('#registerButton').click();
    }

    validateSuccessSnackbar() {
        cy.get('.mat-snack-bar-container', { timeout: 5000 })
            .should('be.visible')
            .and('contain.text', 'Registration completed successfully. You can now log in.');
    }
}

export const registrationPage = new RegistrationPage();