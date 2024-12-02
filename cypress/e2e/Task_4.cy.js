import { basketPage } from '../pages/BasketPage';
import { loginPage } from '../pages/LoginPage';

describe('E2E Shopping Flow Automation', () => {
  let userData = {};
  let addressDetails;
  let deliveryDetails;
  let paymentDetails;

  // Load fixture data before the tests
  before(() => {
    cy.fixture('userData.json').then((data) => (userData = data));
    cy.fixture('addressDetails.json').then((data) => (addressDetails = data));
    cy.fixture('deliveryDetails.json').then((data) => (deliveryDetails = data));
    cy.fixture('paymentDetails.json').then((data) => (paymentDetails = data));
  });

  // Common pre-conditions for each test
  beforeEach(() => {
    loginPage.navigateTo();
    cy.dismissDialog();
    cy.dismissCookieConsent();
    cy.login(userData.email, userData.password);
  });

  // Test case: Add products to the basket and validate
  it('Should log in, add products to the basket, and validate cart updates', () => {
    cy.addProductsToBasket(4).then(() => {
      cy.log('Successfully added 5 items to the cart.');
    });
    basketPage.validateBasketCount(5);
  });

  // Test case: Update basket items and validate price changes
  it('Should update basket items and validate total price changes', () => {
    cy.navigateToBasket();
    cy.storeBasketPrice();
    cy.validateAndIncreaseItemQuantity(0);
    cy.wait(1000);
    cy.validateBasketPriceAfterUpdate();
    cy.removeItemFromBasket(0);
  });

  // Test case: Add a new address
  it('Should add a new address', () => {
    cy.navigateToBasket();
    cy.proceedToAddressPage();
    cy.addNewAddress(addressDetails);
  });

  // Test case: Select delivery options, place an order, and validate
  it('Should complete the order process end-to-end', () => {
    // Navigate to the basket and address page
    cy.navigateToBasket();
    cy.proceedToAddressPage();

    // Select the delivery address
    cy.selectAddress(addressDetails);

    // Navigate to and validate the delivery method page
    cy.navigateToDeliveryMethod();
    cy.validateDeliveryAddress(addressDetails);
    cy.validateDeliverySpeedText('Choose a delivery speed');
    cy.validateDeliveryOptions(deliveryDetails);

    // Select delivery option and store its price
    cy.selectFirstDeliveryOption();
    cy.storeDeliveryPrice();

    // Validate and proceed to the payment page
    cy.validateProceedToDeliveryButton();
    cy.proceedToPaymentMethod();

    // Add a new payment method if needed
    cy.openAddNewCardPanel();
    cy.fillPaymentForm(paymentDetails);
    cy.validateAndSubmitPaymentForm();

    // Select the first payment method and proceed
    cy.selectFirstPaymentMethod();
    cy.proceedToReview();

    // Store basket price and validate the order summary
    cy.storeFinalBasketPrice();
    cy.validateOrderSummary(addressDetails);

    // Proceed to checkout and validate order completion
    cy.proceedToCheckout();
    cy.placeOrder();
    cy.validateOrderCompletionPage(addressDetails);
  });
});