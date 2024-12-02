// cypress/pages/LoginPage.js

class LoginPage {
    navigateTo() {
        cy.visit('https://juice-shop.herokuapp.com/#/login');
    }

    fillCredentials(email, password) {
        cy.get('#email').type(email);
        cy.get('#password').type(password);
    }

    submit() {
        cy.get('#loginButton').click();
    }

    validateSuccessfulLogin() {
        cy.get('#navbarAccount', { timeout: 5000 })
            .should('be.visible')
            .and('have.attr', 'aria-label', 'Show/hide account menu');
    }
}

export const loginPage = new LoginPage();