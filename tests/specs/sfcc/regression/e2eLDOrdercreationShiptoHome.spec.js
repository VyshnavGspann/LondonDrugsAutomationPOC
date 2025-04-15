const { test, expect } = require('@playwright/test');
// const { E2Eorder } = require('../../../../pageObjects/E2EOrder');
// const {E2Eorder} = require('../../../pageObjects/E2Eorder');
const {CartPage} = require('../../../pageObjects/CartPage');
const {HomePage} = require('../../../pageObjects/HomePage');
const {CheckoutPage} = require('../../../pageObjects/CheckoutPage');
// const { CartPage } = require('../../../../pageObjects/CartPage');
// const { HomePage } = require('../../../../pageObjects/HomePage');
// const { CheckoutPage } = require('../../../../pageObjects/CheckoutPage');

// Utility functions for common tasks
// const commonlib = require('../../../../utils/commonUtil');

// Retrieve and log environment variables to dynamically configure the test environment and application under test.
// This allows for flexible test execution across different settings.
// const environment = process.env.TEST_ENV; // Expected values: "qa" or "staging"
// console.log(`Current working directory: ${process.cwd()}`);

// // Note: This line is commented out for development purposes and should be uncommented in production.
// const testDataFilePath = `../../../../testData/sfcc/${environment}TestData.js`;

// Use a placeholder for test data to prevent IDE errors during script development. This is a temporary solution until the above dynamic path is utilized.
// const testData = require('../../../../testData/sfcc/qaTestData');

// Intended for dynamic test data import based on the application and environment. Uncomment and use this line in production for more flexible test data management.
// const testData = require(testDataFilePath);

test('E2E Test Ordercreation for Ship to home.',  async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goTo();
    // const captchaFrame = page.frameLocator('iframe'); // Adjust if CAPTCHA is inside an iframe

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
