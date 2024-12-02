class AddressPage {
    constructor() {
      // Locators
      this.addNewAddressButton = 'button[aria-label="Add a new address"]';
      this.submitButton = '#submitButton';
      this.addressTable = 'mat-table.mat-table';
      this.radioLabel = 'label.mat-radio-label';
      this.firstRow = 'mat-row:first-of-type';
      this.continueButton = 'button[aria-label="Proceed to payment selection"]';
  
      // Form fields
      this.countryInput = 'input[placeholder="Please provide a country."]';
      this.nameInput = 'input[placeholder="Please provide a name."]';
      this.mobileInput = 'input[placeholder="Please provide a mobile number."]';
      this.zipInput = 'input[placeholder="Please provide a ZIP code."]';
      this.addressTextarea = 'textarea#address[placeholder="Please provide an address."]';
      this.cityInput = 'input[placeholder="Please provide a city."]';
      this.stateInput = 'input[placeholder="Please provide a state."]';
    }
  
    // Navigate to Add New Address form
    navigateToAddAddress() {
      cy.get(this.addNewAddressButton).click();
      cy.url().should('include', '/address/create');
      cy.get('h1').contains('Add New Address').should('be.visible');
    }
  
   // Fill the address form
    fillAddressForm({ country, name, mobile, zip, address, city, state }) {
    // Assert that each field is visible and interactable before typing
    cy.get(this.countryInput).should('be.visible').and('be.enabled').type(country);
    cy.get(this.nameInput).should('be.visible').and('be.enabled').type(name);
    cy.get(this.mobileInput).should('be.visible').and('be.enabled').type(mobile);
    cy.get(this.zipInput).should('be.visible').and('be.enabled').type(zip);
    cy.get(this.addressTextarea).should('be.visible').and('be.enabled').type(address);
    cy.get(this.cityInput).should('be.visible').and('be.enabled').type(city);
    cy.get(this.stateInput).should('be.visible').and('be.enabled').type(state);
  
    // Optional: Log the completion of the form fill process
    cy.log('Address form has been filled successfully');
  }
  
    // Validate and submit the form
    validateAndSubmitForm(name) {
      cy.get(this.nameInput).clear();
      cy.get(this.submitButton).should('be.disabled');
      cy.get(this.nameInput).type(name);
      cy.get(this.submitButton).should('be.enabled').click();
      cy.url().should('include', '/address/select');
      cy.get(this.addressTable).should('exist');
    }
  
    // Retry address selection process
    retryAddressSelection(retryCount = 0, maxRetries = 3) {
      cy.get(this.firstRow).within(() => {
        cy.get(this.radioLabel).scrollIntoView().should('be.visible').click({ force: true });
      });
  
      cy.wait(1000);
  
      cy.get(this.continueButton).then(($button) => {
        if ($button.is(':disabled') && retryCount < maxRetries) {
          cy.log('Continue button is still disabled. Retrying...');
          this.retryAddressSelection(retryCount + 1, maxRetries);
        } else {
          cy.log('Continue button is enabled. Proceeding to next step.');
        }
      });
    }
  
    // Validate address details
    validateAddressDetails({ name, address, country }) {
      cy.get(this.firstRow).within(() => {
        cy.get('mat-cell').eq(1).should('contain.text', name);
        cy.get('mat-cell').eq(2).should('contain.text', address);
        cy.get('mat-cell').eq(3).should('contain.text', country);
      });
    }
  }
  
  export const addressPage = new AddressPage();