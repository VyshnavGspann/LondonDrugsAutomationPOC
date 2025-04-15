const { test, expect } = require('@playwright/test');
// const { E2Eorder } = require('../../../../pageObjects/E2EOrder');
const {CartPage} = require('../../../pageObjects/CartPage');
const {HomePage} = require('../../../pageObjects/HomePage');
const {CheckoutPage} = require('../../../pageObjects/CheckoutPage');

const application = process.env.TEST_APP; // "OMS" or "SFCC"
const environment = process.env.TEST_ENV; // "qa" or "staging" or "uat"
// The commented line will be uncommented while pushing the code to Github
const testData = require(`../../../testData/sfcc/${environment}TestData.js`);

test('E2E Test Ordercreation for Ship to home.',  async ({ browser }) => {
    const context = await browser.newContext();
    
    // Parse your raw cookie string
    const rawCookieString = `'datadome=JOhKWiI2EewsiCk7hda~p5sXLFsCny7620mwgNIzQklpgUUTPh4QIBL35UA~r673w_KdaaB1AFQhfAAbBsCbtLeLthlUaNld6DV8VqD_NAvDQqSD4Xnq81EoQZQOLsgT'`;
    
    const domain = 'london-drugs-uat-origin.kibology.us'; // 🔁 Replace with your actual domain (no https or path)
  
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
        expires: -1, // Set to -1 for session cookies
      };
    });

    console.log('Parsed cookies:', cookies);
    await context.addCookies(cookies);

    const page = await context.newPage();
    const homePage = new HomePage(page);
    await homePage.goTo();
    await page.waitForTimeout(10000);
// Detect if the slider is visible
if (await page.locator('text=Slide right to complete the puzzle.').isVisible({ timeout: 5000 }).catch(() => false)) {
    const sliderHandle = await page.locator('//div[contains(@class, "slider")]'); // Update this selector
    const box = await sliderHandle.boundingBox();

    if (box) {
        // Move the mouse and simulate the slider drag
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await page.mouse.down();
        await page.mouse.move(box.x + box.width / 2 + 150, box.y + box.height / 2, { steps: 30 }); // Adjust x distance
        await page.mouse.up();

        // Optionally wait for validation
        await page.waitForTimeout(2000);
    }
}
    // await page.waitForTimeout(60000);
    await homePage.searchForProduct('L3166635');
    const productPage = new CartPage(page);
    await productPage.addProductToCart();
    await productPage.proceedToCheckout();
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.fillUserInformation({
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        address1: '123 Test St',
        address2: 'Apt 101',
        city: 'Test City',
        zipcode: '12345',
        phone: '555-555-5555',
    });
    await checkoutPage.submitOrder();
    await checkoutPage.fillPaymentDetails({
        nameOnCard: 'John Doe',
        cardNumber: '4111111111111111',
        cvv: '123',
    });
    
    // You can add assertions here if necessary
    // For example, ensure the order confirmation page is shown
});
