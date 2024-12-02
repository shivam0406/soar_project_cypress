class DeliveryPage {
    constructor() {
      // Locators
      this.proceedToPaymentButton = 'button[aria-label="Proceed to payment selection"]';
      this.addressContainer = '.addressCont';
      this.deliverySpeedText = 'h1';
      this.deliveryOptionsRow = 'mat-row';
      this.deliveryOptionRadio = 'mat-radio-button';
      this.deliveryOptionPrice = 'mat-cell';
      this.proceedToDeliveryButton = 'button[aria-label="Proceed to delivery method selection"]';
    }
  
    // Navigate to the delivery method page
    navigateToDeliveryMethod() {
      cy.get(this.proceedToPaymentButton).click();
    }
  
    // Validate delivery address details
    validateDeliveryAddress({ name, address, country, phone }) {
      cy.get(this.addressContainer)
        .should('contain', name)
        .and('contain', address)
        .and('contain', country)
        .and('contain', 'Phone Number')
    }
  
    // Validate the delivery speed text
    validateDeliverySpeedText(expectedText) {
      cy.contains(this.deliverySpeedText, expectedText).should('be.visible');
    }
  
    // Validate delivery options
    validateDeliveryOptions({ optionName, price, deliveryTime }) {
      cy.get(this.deliveryOptionsRow).first().within(() => {
        cy.get(this.deliveryOptionPrice).eq(1).should('contain', optionName);
        cy.get(this.deliveryOptionPrice).eq(2).should('contain', price);
        cy.get(this.deliveryOptionPrice).eq(3).should('contain', deliveryTime);
      });
    }
  
    // Select the first delivery option
    selectFirstDeliveryOption() {
      cy.get(this.deliveryOptionsRow).first().within(() => {
        cy.get(this.deliveryOptionRadio).click();
      });
    }
  
    // Store the delivery price
    storeDeliveryPrice() {
      cy.get(this.deliveryOptionPrice).eq(2).invoke('text').then((priceText) => {
        const price = priceText.replace('¤', '').trim(); // Remove special characters and spaces
        cy.wrap(price).as('deliveryPrice');
        cy.log(`Stored delivery price: ${price}`);
      });
    }
  
    // Validate the "Proceed to delivery" button is enabled
    validateProceedToDeliveryButton() {
      cy.get(this.proceedToDeliveryButton).should('not.be.disabled');
    }
  }
  
  export const deliveryPage = new DeliveryPage();