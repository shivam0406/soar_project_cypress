// cypress/pages/BasePage.js

export class BasePage {
    visit(url = 'https://juice-shop.herokuapp.com/#/') {
        cy.visit(url);
    }
}