class OrderCompletionPage {
    constructor() {
      // Locators
      this.checkoutButton = '//button[@id="checkoutButton"]';
      this.orderCompletionUrl = /\/order-completion\/[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+/;
      this.thankYouMessage = '//h1';
      this.trackResultLink = '//a[@routerlink="/track-result/new"]';
      this.deliveryAddressDiv = '//b[text()="Delivery Address"]/parent::div/following-sibling::div';
      this.deliveryName = '//b[text()="Delivery Address"]/parent::div/following-sibling::div[1]';
      this.deliveryAddress = '//b[text()="Delivery Address"]/parent::div/following-sibling::div[2]';
      this.deliveryCountry = '//b[text()="Delivery Address"]/parent::div/following-sibling::div[3]';
      this.deliveryPhone = '//b[text()="Delivery Address"]/parent::div/following-sibling::div[4]';
      this.orderSummaryHeader = '//span[text()="Order Summary"]';
      this.matTable = '//table[@class="mat-table"]';
      this.priceAlignTable = '//table[@class="price-align"]/tbody/tr';
      this.labelXPath = '//table[@class="mat-table"]/tr/td';
      this.valueXPath = '//table[@class="price-align"]/tr/td';
    }
  
    // Place an order
    placeOrder() {
      cy.xpath(this.checkoutButton).click();
    }
  
    // Validate the order completion URL
    validateOrderCompletionUrl() {
      cy.url().should('match', this.orderCompletionUrl);
    }
  
    // Validate the thank you message
    validateThankYouMessage() {
      cy.xpath(this.thankYouMessage).should('contain.text', 'Thank you for your purchase!');
    }
  
    // Validate the presence of the Track Result link
    validateTrackResultLink() {
      cy.xpath(this.trackResultLink).should('be.visible');
    }
  
    // Validate the delivery address and its parts
    validateDeliveryAddress({ name, address, country, phone }) {
      cy.xpath(this.deliveryAddressDiv).should('have.length', 4); // Ensure there are 4 delivery address details
      cy.xpath(this.deliveryName).should('be.visible').and('contain.text', name);
      cy.xpath(this.deliveryAddress).should('be.visible').and('contain.text', address);
      cy.xpath(this.deliveryCountry).should('be.visible').and('contain.text', country);
    }
  
    // Validate the Order Summary header
    validateOrderSummaryHeader() {
      cy.xpath(this.orderSummaryHeader).should('be.visible');
    }
  
    // Validate the mat-table rows
    validateMatTableRows(rowCount) {
      cy.xpath(this.matTable).should('be.visible').find('tr').should('have.length', rowCount);
    }
  
    // Map prices from the mat-table
    mapPricesFromTable() {
      let priceMap = new Map();
  
      cy.xpath(this.labelXPath).then(($labels) => {
        cy.xpath(this.valueXPath).then(($values) => {
          expect($labels.length).to.equal($values.length);
  
          for (let i = 0; i < $labels.length; i++) {
            const label = $labels[i].innerText.trim();
            const priceText = $values[i].innerText.trim();
            const cleanedPrice = parseFloat(priceText.replace(/[^\d.-]/g, ''));
            priceMap.set(label, cleanedPrice);
          }
  
          cy.wrap(priceMap).as('priceMap');
        });
      });
    }

  }
  
  export const orderCompletionPage = new OrderCompletionPage();