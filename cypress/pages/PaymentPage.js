class PaymentPage {
  constructor() {
    // Locators
    this.firstPaymentRadioButton = '//mat-table/mat-row[1]/mat-cell/child::mat-radio-button';
    this.proceedToPaymentButton = 'button[aria-label="Proceed to delivery method selection"]';
    this.paymentOptionsHeader = '//h1[text()="My Payment Options"]';
    this.addNewCardPanel = '//mat-panel-title[text()=" Add new card "]/parent::span/parent::mat-expansion-panel-header';
    this.cardNameInput = '//div[@role="region"]//label[mat-label[text()="Name"]]/parent::span/preceding-sibling::input';
    this.cardNumberInput = '//div[@role="region"]//label[mat-label[text()="Card Number"]]/parent::span/preceding-sibling::input';
    this.expiryMonthSelect = '//div[@role="region"]//label[mat-label[text()="Expiry Month"]]/parent::span/preceding-sibling::select';
    this.expiryYearSelect = '//div[@role="region"]//label[mat-label[text()="Expiry Year"]]/parent::span/preceding-sibling::select';
    this.submitButton = '//button[@id="submitButton"]';
    this.radioLabel = 'label.mat-radio-label';
    this.proceedToReviewButton = '//button[@aria-label="Proceed to review"]';
  }

  /**
   * Navigate to the payment method page
   */
  proceedToPaymentMethod() {
    cy.get(this.proceedToPaymentButton).click();
    cy.xpath(this.paymentOptionsHeader).should('be.visible');
  }

  /**
   * Open the "Add New Card" panel
   */
  openAddNewCardPanel() {
    cy.xpath(this.addNewCardPanel).click();
  }

  /**
   * Fill out the payment form with the provided details
   * @param {Object} paymentDetails - Payment details including name, card number, expiry month, and year
   */
  fillPaymentForm(paymentDetails) {
    const { name, cardNumber, expiryMonth, expiryYear } = paymentDetails;

    cy.xpath(this.cardNameInput).should('be.visible').type(name);
    cy.xpath(this.cardNumberInput).should('be.visible').type(cardNumber);
    cy.xpath(this.expiryMonthSelect).should('be.visible').select(expiryMonth);
    cy.xpath(this.expiryYearSelect).should('be.visible').select(expiryYear);
  }

  /**
   * Validate the payment form and submit
   */
  validateAndSubmitPaymentForm() {
    cy.xpath(this.submitButton).should('not.be.disabled').click();
  }

  /**
   * Select the first payment method in the table
   */
  selectFirstPaymentMethod() {
    cy.xpath(this.firstPaymentRadioButton)
      .scrollIntoView()
      .should('be.visible')
      .click({ force: true });
  }

  /**
   * Proceed to the review page
   */
  proceedToReview() {
    cy.xpath(this.proceedToReviewButton).should('not.be.disabled').click();
  }
}

export const paymentPage = new PaymentPage();