const { test, expect } = require('@playwright/test');
const {CartPage} = require('../../../pageObjects/CartPage');
const {HomePage} = require('../../../pageObjects/HomePage');
const {CheckoutPage} = require('../../../pageObjects/CheckoutPage');
const {SignInPage} = require('../../../pageObjects/SigninPage');
const {OrderConfirmationPage} = require('../../../pageObjects/OrderConfirmationPage');

const application = process.env.TEST_APP; // "OMS" or "SFCC"
const environment = process.env.TEST_ENV; // "qa" or "staging" or "uat"
// The commented line will be uncommented while pushing the code to Github
const testData = require(`../../../testData/sfcc/${environment}TestData.js`);

test('E2E Test Ordercreation for In Store Pickup.',  async ({ browser }) => {
    const context = await browser.newContext();
    
    const rawCookieString = testData.dataDomekey
    const domain = testData.domain;
    const cookies = rawCookieString.split('; ').map(cookie => {
      const [name, ...rest] = cookie.split('=');
      return {
        name,
        value: rest.join('='),
        domain,
        path: '/',
        httpOnly: false,
        secure: true,
        sameSite: 'Lax',
      };
    });

    console.log('Parsed cookies:', cookies);
    await context.addCookies(cookies);

    const page = await context.newPage();
    const homePage = new HomePage(page);
  //  const signInPage = new SignInPage(page);
    await homePage.goTo();
    await homePage.searchForProduct('L3166675');
    const productPage = new CartPage(page);
    await productPage.saveProductNameAndGoToProductPage();
    await productPage.validateProductTitle();
    await productPage.saveProductPrice();
    await productPage.selectInStorePickUpRadioButton();
    await productPage.enterPostalCode();
    await productPage.clickOnSearchPostalButton();
    await productPage.clickOnSetStoreButton();
    await productPage.addProductToCart();
    await productPage.validateProductPriceInCart();
    await productPage.proceedToCheckout();
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.enterEmail();
    await checkoutPage.proceedToBilling();
    await checkoutPage.addShippingAddressforInStorePickup(testData.shippingInStore); 
    await checkoutPage.cardPayment(testData.payment.CreditCard.visa);
    await checkoutPage.placeyourOrder();
    const orderConfirmationPage = new OrderConfirmationPage(page);
    await orderConfirmationPage.verifythanksMessageAppears();   
    await orderConfirmationPage.getOrderNumber();
});
