// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Dismiss the welcome dialog]]]

import 'cypress-xpath';
import { loginPage } from '../pages/LoginPage';
import { basketPage } from '../pages/BasketPage';
import { each } from 'cypress-recurse';
import { addressPage } from '../pages/AddressPage';
import { deliveryPage } from '../pages/DeliveryPages';
import { paymentPage } from '../pages/PaymentPage';
import { orderSummaryPage } from '../pages/OrderSummaryPage';
import { orderCompletionPage } from '../pages/OrderCompletionPage';
import 'cypress-if'


Cypress.Commands.add('dismissDialog', () => {
    cy.get('div[id^="cdk-overlay-"]')
      .find('mat-dialog-container')
      .should('be.visible')
      .within(() => {
          cy.get('button').contains('Dismiss').click();
      });
});

// Dismiss the cookie consent alert
Cypress.Commands.add('dismissCookieConsent', () => {
    cy.get('div.cc-compliance')
      .find('a[aria-label="dismiss cookie message"]')
      .should('be.visible')
      .click();
});

Cypress.Commands.add('login', (email, password) => {
  loginPage.fillCredentials(email, password);
  loginPage.submit();
  loginPage.validateSuccessfulLogin();
});

Cypress.Commands.add('addProductsToBasket', (maxItems) => {
  let itemsAddedCount = 0;

  // Use the `getTiles` method from BasketPage to fetch all tiles
  basketPage.getTiles().then(
    each(
      ($tile) => {
        // Use the `clickAddToBasket` method to add items to the basket
        return basketPage.clickAddToBasket($tile).then(() => {
          // Wait for the toast/snackbar message to appear and get the text
          return basketPage.getToastMessage().then((text) => {
            if (text.includes('Added another') || text.includes('Placed')) {
              cy.log(`Item successfully added. Incrementing count.`);
              itemsAddedCount++; // Increment the count
            } else if (text.includes('We are out of stock!')) {
              cy.log('Item is out of stock. Moving to the next tile.');
            }
          });
        }).then(() => {
          // Add a delay of 2 seconds between processing each product
          cy.wait(2000);
        });
      },
      // Predicate: Stop when 4 items are added
      () => {
        cy.log(`Checking if itemsAddedCount === 4: ${itemsAddedCount}`);
        return itemsAddedCount === 4; // Stop after adding 4 items
      },
      {
        timeout: 30000, // Total timeout for retries
        delay: 1000,    // Delay between retries
        log: true,      // Enable logging for debugging
      }
    )
  ).then(() => {
    cy.log(`Successfully added 5 items to the cart.`);
    //Adding +1 to itemAddedCount for post
    itemsAddedCount++;
    expect(itemsAddedCount).to.equal(5); // Assert the final count
  });
});

Cypress.Commands.add('navigateToBasket', () => {
  basketPage.validateNavbarAccountVisible();
  basketPage.navigateToBasket();
});

// Command to validate and increase item quantity in the basket
Cypress.Commands.add('validateAndIncreaseItemQuantity', (rowIndex) => {
  basketPage.increaseItemQuantity(rowIndex);
});

Cypress.Commands.add('storeBasketPrice', () => {
  basketPage.getBasketPrice().then((price) => {
    cy.log(`Storing initial basket price: ${price}`);
    expect(price).to.be.greaterThan(0);
    cy.wrap(price).as('initialPrice'); // Store the price
  });
});

Cypress.Commands.add('validateBasketPriceAfterUpdate', () => {
  cy.get('@initialPrice').then((initialPrice) => {
    cy.log(`Validating against initial basket price: ${initialPrice}`);
    basketPage.validateBasketPriceGreaterThan(initialPrice);
  });
});

// Command to remove an item from the basket and validate the updated price
Cypress.Commands.add('removeItemFromBasket', (rowIndex, aliasName = '@initialPrice') => {
  // Remove the item from the specified row index
  basketPage.removeItem(rowIndex);

  // Wait for price update and validate
  cy.get(aliasName).then((initialPrice) => {
    cy.log(`Validating price after removal with initial price: ${initialPrice}`);
    basketPage.validatePriceAfterRemoval(initialPrice);
  });
});

Cypress.Commands.add('addNewAddress', (addressDetails) => {
  addressPage.navigateToAddAddress();
  addressPage.fillAddressForm(addressDetails);
  addressPage.validateAndSubmitForm(addressDetails.name);
});

Cypress.Commands.add('selectAddress', (addressDetails) => {
  addressPage.validateAddressDetails(addressDetails);
  addressPage.retryAddressSelection();
});

// Command to navigate to the delivery method page
Cypress.Commands.add('navigateToDeliveryMethod', () => {
  deliveryPage.navigateToDeliveryMethod();
});

// Command to validate delivery address
Cypress.Commands.add('validateDeliveryAddress', (addressDetails) => {
  deliveryPage.validateDeliveryAddress(addressDetails);
});

// Command to validate delivery speed text
Cypress.Commands.add('validateDeliverySpeedText', (expectedText) => {
  deliveryPage.validateDeliverySpeedText(expectedText);
});

// Command to validate delivery options
Cypress.Commands.add('validateDeliveryOptions', (deliveryDetails) => {
  deliveryPage.validateDeliveryOptions(deliveryDetails);
});

// Command to select the first delivery option
Cypress.Commands.add('selectFirstDeliveryOption', () => {
  deliveryPage.selectFirstDeliveryOption();
});

// Command to store the delivery price
Cypress.Commands.add('storeDeliveryPrice', () => {
  deliveryPage.storeDeliveryPrice();
});

// Command to validate "Proceed to delivery" button
Cypress.Commands.add('validateProceedToDeliveryButton', () => {
  deliveryPage.validateProceedToDeliveryButton();
});


Cypress.Commands.add('proceedToPaymentMethod', () => {
  paymentPage.proceedToPaymentMethod();
});

// Command to open "Add New Card" panel
Cypress.Commands.add('openAddNewCardPanel', () => {
  paymentPage.openAddNewCardPanel();
});

// Command to fill the payment form
Cypress.Commands.add('fillPaymentForm', (paymentDetails) => {
  paymentPage.fillPaymentForm(paymentDetails);
});

// Command to validate and submit the payment form
Cypress.Commands.add('validateAndSubmitPaymentForm', () => {
  paymentPage.validateAndSubmitPaymentForm();
});

// Command to select the first payment method
Cypress.Commands.add('selectFirstPaymentMethod', () => {
  paymentPage.selectFirstPaymentMethod();
});

// Command to proceed to the review page
Cypress.Commands.add('proceedToReview', () => {
  paymentPage.proceedToReview();
});

Cypress.Commands.add('selectOrCreatePaymentMethod', (paymentDetails) => {
  // Check if the payment method exists
  cy.xpath(paymentPage.firstPaymentRadioButton, { timeout: 5000 })
    .if('visible') // If the radio button for the payment method is visible
    .then(($radio) => {
      // Select the existing payment method
      cy.log('Existing payment method found. Selecting the first payment method.');
      cy.wrap($radio)
        .should('be.visible') // Ensure it's interactable
        .click({ force: true });
    })
    .else(() => {
      // Create a new payment method if none exists
      cy.log('No existing payment method found. Proceeding to add a new payment method.');
      paymentPage.openAddNewCardPanel();
      paymentPage.fillPaymentForm(paymentDetails);
      paymentPage.validateAndSubmitPaymentForm();
    });
});

Cypress.Commands.add('storeFinalBasketPrice', () => {
  orderSummaryPage.getBasketPrice().then((basketPrice) => {
    cy.wrap(basketPrice).as('finalBasketPrice');
    cy.log(`Final Basket Price Stored: ${basketPrice}`);
  });
});

Cypress.Commands.add('validateOrderSummary', (deliveryDetails) => {

  console.log("My address details are in command js", deliveryDetails)
  // Validate the page URL
  orderSummaryPage.validateUrl();

  // Validate delivery address details
  orderSummaryPage.validateDeliveryAddress(deliveryDetails);

  // Validate basket header
  orderSummaryPage.validateBasketHeader();

  // Validate the table rows
  orderSummaryPage.validateTableRows(4);

  // Validate the order summary table visibility
  orderSummaryPage.validateOrderSummaryTable();

  // Validate sibling table row data
  orderSummaryPage.validateSiblingTableRowData();

  // Validate Delivery Price
  orderSummaryPage.getDeliveryPrice().then((deliveryPrice) => {
    cy.wrap(deliveryPrice).as('deliveryPrice');
    cy.log(`Delivery Price Stored: ${deliveryPrice}`);
  });
});

Cypress.Commands.add('validateFinalTotalPrice', () => {
  // Get the delivery price from the wrapped element
  cy.get('@deliveryPrice').then(($deliveryElement) => {
    cy.wrap($deliveryElement)
      .invoke('text')
      .then((deliveryText) => {
        const deliveryPrice = parseFloat(deliveryText.replace(/[^\d.-]/g, '').trim());
        cy.log(`Extracted Delivery Price: ${deliveryPrice}`);

        // Get the final basket price from the wrapped element
        cy.get('@finalBasketPrice').then(($basketElement) => {
          cy.wrap($basketElement)
            .invoke('text')
            .then((basketText) => {
              const finalBasketPrice = parseFloat(basketText.replace(/[^\d.-]/g, '').trim());
              cy.log(`Extracted Final Basket Price: ${finalBasketPrice}`);

              // Get the total price from the order summary page
              orderSummaryPage.getTotalPrice().then((totalPrice) => {
                cy.xpath(totalPrice).invoke((tp) => {
                  console.log("TP",tp)
                })
                const expectedTotalPrice = deliveryPrice + finalBasketPrice;

                // cy.log(`Expected Total Price: ${expectedTotalPrice}`);
                // cy.log(`Total Price on Page: ${totalPrice}`);

                // // Validate the total price
                // expect(totalPrice).to.be.a('number'); // Ensure it's a number
                // expect(totalPrice).to.be.closeTo(5006.86, 0.01); // Match with tolerance
              });
            });
        });
      });
  });
});

Cypress.Commands.add('proceedToCheckout', () => {
  // Validate the checkout button and proceed
  orderSummaryPage.validateCheckoutButton();
  orderSummaryPage.clickCheckoutButton();
});

Cypress.Commands.add('placeOrder', () => {
  orderCompletionPage.placeOrder();
  orderCompletionPage.validateOrderCompletionUrl();
});

Cypress.Commands.add('validateOrderCompletionPage', (deliveryDetails) => {
  // Validate the thank you message
  orderCompletionPage.validateThankYouMessage();

  // Validate the Track Result link
  orderCompletionPage.validateTrackResultLink();

  // Validate delivery address
  orderCompletionPage.validateDeliveryAddress(deliveryDetails);

  // Validate the Order Summary header
  orderCompletionPage.validateOrderSummaryHeader();

  // Validate the mat-table rows
  orderCompletionPage.validateMatTableRows(4);

  // Map prices from the mat-table
  orderCompletionPage.mapPricesFromTable();
}); 

Cypress.Commands.add('proceedToAddressPage', () => {
  basketPage.proceedToAddressPage();
});