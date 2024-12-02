class BasketPage {
  constructor() {
    // Locators
    this.tilesSelector = 'mat-grid-list mat-grid-tile mat-card';
    this.addToBasketButton = 'button[aria-label="Add to Basket"]';
    this.toastMessageSelector = 'simple-snack-bar span.mat-simple-snack-bar-content';
    this.basketCountSelector = "//span[contains(text(), 'Your Basket')]/following-sibling::span";
    this.navbarAccount = '#navbarAccount';
    this.navbarCartButton = 'button[routerlink="/basket"]';
    this.basketPrice = '#price';
    this.tableSelector = 'mat-table.mat-table';
    this.rowSelector = 'mat-row';
    this.quantityCell = 'mat-cell.mat-column-quantity';
    this.deleteButton = 'button.mat-focus-indicator.mat-icon-button.mat-button-base';
    this.checkoutButton = 'button#checkoutButton';
  }

  proceedToAddressPage() {
    cy.get(this.checkoutButton)
      .scrollIntoView() // Scroll the button into view
      .should('be.visible') // Ensure the button is visible
      .click(); // Click the button
    cy.url().should('include', '/address/select'); // Validate navigation to the address page
  }

  getTiles() {
    // Get all product tiles
    return cy.get(this.tilesSelector);
  }

  clickAddToBasket($tile) {
    // Click the "Add to Basket" button within a specific tile
    return cy.wrap($tile).find(this.addToBasketButton).click();
  }

  getToastMessage() {
    // Get the toast/snackbar message text
    return cy.get(this.toastMessageSelector).invoke('text');
  }

  validateBasketCount(expectedCount) {
    // Validate the basket count matches the expected value
    cy.wait(3000)
    cy.xpath(this.basketCountSelector)
      .invoke('text') // Extract the text content
      .then((basketCount) => {
        cy.log(`Basket Count Displayed: ${basketCount}`);
        expect(parseInt(basketCount.trim())).to.equal(expectedCount); // Assert the count
      });
  }

  validateNavbarAccountVisible() {
    cy.get(this.navbarAccount).should('be.visible');
  }

  navigateToBasket() {
    cy.get(this.navbarCartButton)
      .should('be.visible')
      .should('have.attr', 'routerlink', '/basket')
      .click();
    cy.wait(3000);
    cy.url().should('include', '/basket');
  }

  getBasketPrice() {
    return cy
      .get(this.basketPrice)
      .scrollIntoView()
      .should('be.visible')
      .invoke('text')
      .then((text) =>
        parseFloat(
          text.replace('Total Price: ', '').replace('¤', '').trim()
        )
      );
  }

  validateBasketPriceGreaterThan(price) {
    cy.get(this.basketPrice)
      .scrollIntoView()
      .should('be.visible')
      .invoke('text')
      .then((text) => {
        cy.log("Text is", text)
        const rawPrice = text.replace('Total Price: ', '').replace(/[^\d.-]/g, '').trim();
        const updatedPrice = Math.round(parseFloat(rawPrice) * 100) / 100;
        console.log(`Updated total price: ${updatedPrice}`);
        expect(updatedPrice).to.be.a('number');
        console.log("Price is", price)
        expect(price).to.be.a('number');
        expect(updatedPrice).to.be.greaterThan(price);
      });
  }

  increaseItemQuantity(rowIndex) {
    cy.get(this.tableSelector)
      .find(this.rowSelector)
      .eq(rowIndex)
      .within(() => {
        cy.get(this.quantityCell)
          .find('span')
          .invoke('text')
          .then((quantity) => {
            expect(quantity.trim()).to.equal('1');
            cy.get('button[mat-icon-button]').eq(1).click();
          });
      });
      cy.wait(2000);
  }

  validateUpdatedQuantity(rowIndex, expectedQuantity) {
    cy.get(this.tableSelector)
      .find(this.rowSelector)
      .eq(rowIndex)
      .within(() => {
        cy.get(this.quantityCell)
          .find('span')
          .invoke('text')
          .then((updatedQuantity) => {
            expect(updatedQuantity.trim()).to.equal(expectedQuantity.toString());
          });
      });
  }

  removeItem(rowIndex) {
    cy.get(this.tableSelector)
      .find(this.rowSelector)
      .eq(rowIndex)
      .within(() => {
        cy.get(this.deleteButton).eq(2).click();
      });
    cy.wait(1000);
  }

  validatePriceAfterRemoval(expectedPrice) {
    cy.get(this.basketPrice)
      .scrollIntoView()
      .invoke('text')
      .then((text) => {
        const updatedPrice = parseFloat(
          text.replace(/[^\d.-]/g, '').trim()
        );
        cy.log(`Total price after removal: ${updatedPrice}`);
        expect(updatedPrice).to.be.greaterThan(0);
        expect(expectedPrice).to.be.greaterThan(updatedPrice);
  
        // Store the updated price as an alias
        cy.wrap(updatedPrice).as('finalBasketPrice');
      });
  }
}

// Export an instance of the BasketPage class
export const basketPage = new BasketPage();