// cypress/pages/ProductPage.js

import { BasePage } from './BasePage';

class ProductPage extends BasePage {
    clickProduct(productName) {
        cy.get('.mat-grid-tile')
            .contains(new RegExp(productName, 'i'))
            .click();
    }

    validatePopupVisible() {
        cy.get('mat-dialog-container').should('be.visible');
    }

    validateProductImageIncludes(keyword) {
        cy.get('mat-dialog-container')
            .find('img')
            .should('have.attr', 'src')
            .and('include', keyword);
    }

    expandReviewsIfAvailable() {
        cy.get('mat-dialog-container')
            .find('.mat-expansion-panel-header-title')
            .should('exist')
            .then(($header) => {
                const reviewCountText = $header.find('span:last').text();
                const reviewCount = parseInt(reviewCountText.replace(/[()]/g, '').trim());
                cy.log(`Review count: ${reviewCount}`);

                if (reviewCount > 0) {
                    cy.wrap($header).click();
                } else {
                    cy.log('No reviews available. Skipping expansion.');
                }
            });
    }

    closePopup() {
        cy.get('mat-dialog-container')
            .find('button')
            .contains(/Close|Dismiss/i)
            .click();
    }

    validatePopupClosed() {
        cy.get('mat-dialog-container').should('not.exist');
    }
}

export const productPage = new ProductPage();