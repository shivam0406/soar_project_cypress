class OrderSummaryPage {
    constructor() {
      // Locators
      this.url = 'https://juice-shop.herokuapp.com/#/order-summary';
      this.deliveryAddressHeader = '//b[text()="Delivery Address"]';
      this.buyerName = '//b[text()="Delivery Address"]/parent::div/following-sibling::div[1]';
      this.buyerAddress = '//b[text()="Delivery Address"]/parent::div/following-sibling::div[2]';
      this.buyerCountry = '//b[text()="Delivery Address"]/parent::div/following-sibling::div[3]';
      this.buyerPhone = '//b[text()="Delivery Address"]/parent::div/following-sibling::div[4]';
      this.basketHeader = '//h1';
      this.tableRole = '//mat-table[@role="table"]';
      this.orderSummaryDiv = '//div[@class="order-summary"]';
      this.siblingTableToOrderSummary = '//div[@class="order-summary"]/following-sibling::table';
      this.checkoutButton = '//button[@id="checkoutButton"]';
    }
  
    // Validate page URL
    validateUrl() {
      cy.url().should('eq', this.url);
    }
  
    // Validate delivery address
    validateDeliveryAddress({ name, address, country, phone }) {
      cy.xpath(this.deliveryAddressHeader).should('be.visible');
      cy.xpath(this.buyerName).should('be.visible').and('contain.text', name);
      cy.xpath(this.buyerAddress).should('be.visible').and('contain.text', address);
      cy.xpath(this.buyerCountry).should('be.visible').and('contain.text', country);
    }
  
    // Validate basket header
    validateBasketHeader() {
      cy.xpath(this.basketHeader).should('be.visible');
    }
  
    // Validate table rows
    validateTableRows(rowCount) {
      cy.xpath(this.tableRole)
        .should('be.visible')
        .find('mat-row')
        .should('have.length', rowCount);
    }
  
    // Validate order summary table visibility
    validateOrderSummaryTable() {
      cy.xpath(this.orderSummaryDiv).should('be.visible');
    }
  
    // Validate sibling table row data
    validateSiblingTableRowData() {
      cy.xpath(this.siblingTableToOrderSummary)
        .find('tr')
        .should('have.length', 4)
        .each(($tr) => {
          cy.wrap($tr).find('td').should('have.length', 2);
        });
    }
  
    // Get delivery price
    getDeliveryPrice() {
      return cy.xpath('//div[@class="order-summary"]/following-sibling::table//tr[2]')
        .within(() => {
          return cy.get('td').eq(1).invoke('text').then((text) => {
            return parseFloat(text.replace('¤', '').trim());
          });
        });
    }
  
    getTotalPrice() {
      return cy
        .xpath('//div[@class="order-summary"]/following-sibling::table//tr[4]')
        .within(() => {
          return cy
            .get('td')
            .eq(1) // Target the second column (price)
            .invoke('text') // Get the text content of the cell
            .then((text) => {
              const cleanedPrice = parseFloat(text.replace(/[^\d.-]/g, '').trim()); // Clean and parse the price
              cy.log(`Extracted Total Price: ${cleanedPrice}`); // Log for debugging
              return cy.wrap(cleanedPrice); // Wrap the value in Cypress's command queue
            });
        });
    }
  
    // Get final basket price
    getBasketPrice() {
      return cy.xpath('//div[@class="order-summary"]/following-sibling::table//tr[1]')
        .within(() => {
          return cy.get('td').eq(1).invoke('text').then((text) => {
            return parseFloat(text.replace('¤', '').trim());
          });
        });
    }
  
    // Validate checkout button
    validateCheckoutButton() {
      cy.xpath(this.checkoutButton).should('be.visible');
    }
  
    // Click checkout button
    clickCheckoutButton() {
      cy.xpath(this.checkoutButton).click();
    }
  }
  
  export const orderSummaryPage = new OrderSummaryPage();