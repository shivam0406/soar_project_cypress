// cypress/e2e/appleJuice.cy.js

import { productPage } from '../pages/ProductPage.js';

describe('Apple Juice Product Interaction', () => {
    beforeEach(() => {
        productPage.visit();
        cy.dismissDialog();
        cy.dismissCookieConsent();
    }); 

    it('Should interact with the Apple Juice product and handle reviews', () => {
        productPage.clickProduct('Apple Juice \\(1000ml\\)');

        productPage.validatePopupVisible();

        productPage.validateProductImageIncludes('apple');

        productPage.expandReviewsIfAvailable();

        productPage.closePopup();

        productPage.validatePopupClosed();
    });
});