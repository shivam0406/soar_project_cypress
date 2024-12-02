import { juiceShopPage } from '../pages/JuiceShopPage.js';

describe('Home Page Number of Tiles Loading Tests', () => {
    beforeEach(() => {
        // Visit the Juice Shop page and dismiss initial dialogs
        juiceShopPage.visit();
        cy.dismissDialog();
        cy.dismissCookieConsent();
    });

    it('Should dismiss dialogs, scroll, and handle dropdown correctly', () => {
        // Scroll to the bottom of the page
        juiceShopPage.scrollToBottom();

        // Wait for the page to fully load
        juiceShopPage.waitForPageLoad();

        // Open the dropdown and verify it expands
        juiceShopPage.openDropdown();
        juiceShopPage.verifyDropdownIsExpanded();

        // Select the last option from the dropdown
        juiceShopPage.selectLastDropdownOption();

        // Validate that items are displayed as expected
        juiceShopPage.validateItemsDisplayed();
    });
});