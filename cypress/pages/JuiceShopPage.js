// cypress/pages/JuiceShopPage.js

import { BasePage } from './BasePage';

class JuiceShopPage extends BasePage {
    scrollToBottom() {
        cy.get('mat-sidenav-content').then(($container) => {
            const container = $container[0];
            container.scrollTop = container.scrollHeight;
        });
    }

    waitForPageLoad() {
        cy.get('.mat-grid-tile', { timeout: 10000 }).should('exist');
        cy.document().its('readyState').should('eq', 'complete');
    }

    openDropdown() {
        cy.get('div.mat-select-arrow-wrapper').click();
    }

    verifyDropdownIsExpanded() {
        cy.get('mat-select[aria-label="Items per page:"]').should('have.attr', 'aria-expanded', 'true');
    }

    selectLastDropdownOption() {
        cy.get('mat-option').last().click();
    }

    validateItemsDisplayed() {
        cy.get('.mat-paginator-range-label')
            .invoke('text')
            .then((text) => {
                const totalItems = parseInt(text.split('of')[1].trim());
                cy.log(`Total items according to paginator: ${totalItems}`);
                cy.get('.mat-grid-tile').should('have.length', totalItems);
            });
    }
}

export const juiceShopPage = new JuiceShopPage();