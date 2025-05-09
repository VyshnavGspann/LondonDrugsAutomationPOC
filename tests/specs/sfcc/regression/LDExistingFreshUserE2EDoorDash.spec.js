const { test, expect } = require('@playwright/test');
// const { E2Eorder } = require('../../../../pageObjects/E2EOrder');
const { CartPage } = require('../../../pageObjects/CartPage');
const { HomePage } = require('../../../pageObjects/HomePage');
const { CheckoutPage } = require('../../../pageObjects/CheckoutPage');
const { SignInPage } = require('../../../pageObjects/SigninPage');
const { OrderConfirmationPage } = require('../../../pageObjects/OrderConfirmationPage');

const application = process.env.TEST_APP; // "OMS" or "SFCC"
const environment = process.env.TEST_ENV; // "qa" or "staging" or "uat"
// The commented line will be uncommented while pushing the code to Github
const testData = require(`../../../testData/sfcc/${environment}TestData.js`);

test('E2E Test Ordercreation for Door Dash.', async ({ browser }) => {
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
  const signInPage = new SignInPage(page);
  const productPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);
  const orderConfirmationPage = new OrderConfirmationPage(page);

  await homePage.goTo();
  await homePage.navigateToLoginPage();
  await signInPage.performLogin(testData.userEmail, testData.password);
  await homePage.searchForProduct1('L8211682');
  await productPage.saveProductNameAndGoToProductPage();
  await productPage.validateProductTitle();
  await productPage.saveProductPrice();
  await productPage.addProductToCart();
  await productPage.validateProductPriceInCart();
  await productPage.viewAndCheckoutButtonForDoorDash();
  await productPage.clickDoorDashRadioButton();
  await productPage.enterDoorDashDayDeliveryAddress(testData.doorDash);
  await productPage.clickCheckAddressButton();
  await productPage.clickCheckoutButtonForDoorDash();
  await checkoutPage.addShippingAddress(testData.doorDashShipping)
  await checkoutPage.proceedToBilling();
  await checkoutPage.selectCardType();
  await checkoutPage.cardPayment(testData.payment.CreditCard.master);
  await checkoutPage.placeyourOrder();
  await orderConfirmationPage.verifythanksMessageAppears();
  await orderConfirmationPage.getOrderNumber();
});
