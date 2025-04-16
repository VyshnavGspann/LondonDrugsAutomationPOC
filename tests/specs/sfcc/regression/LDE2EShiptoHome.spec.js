const { test, expect } = require('@playwright/test');
// const { E2Eorder } = require('../../../../pageObjects/E2EOrder');
const {CartPage} = require('../../../pageObjects/CartPage');
const {HomePage} = require('../../../pageObjects/HomePage');
const {CheckoutPage} = require('../../../pageObjects/CheckoutPage');
const {SignInPage} = require('../../../pageObjects/SigninPage');

const application = process.env.TEST_APP; // "OMS" or "SFCC"
const environment = process.env.TEST_ENV; // "qa" or "staging" or "uat"
// The commented line will be uncommented while pushing the code to Github
const testData = require(`../../../testData/sfcc/${environment}TestData.js`);

test('E2E Test Ordercreation for Ship to home.',  async ({ browser }) => {
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
    const orderConfirmationPagePage = new OrderConfirmationPagePage(page);
    await homePage.goTo();
    await homePage.searchForProduct('L3166675');
    const productPage = new CartPage(page);
    await productPage.addProductToCart();
    await productPage.proceedToCheckout();
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.fillUserInformation({
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Accept',
        address1: '501 Av Dressage',
        address2: 'Apt 101',
        city: 'Stittsville',
        zipcode: 'K2V 0C8',
        phone: '555-555-5555',
    });
    await checkoutPage.submitOrder();
    await checkoutPage.fillPaymentDetails({
        nameOnCard: 'Test Accept',
        cardNumber: '4111111111111111',
        cvv: '123',
    });
    await checkoutPage.placeyourOrder();
    await orderConfirmationPagePage.searchForProduct();   
    
    // You can add assertions here if necessary
    // For example, ensure the order confirmation page is shown
});
