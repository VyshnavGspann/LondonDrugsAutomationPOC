// Import necessary modules and page objects for the test
const { test, expect } = require('@playwright/test');
// const { LoginPage } = require('../../pageObjects/LoginPage');
// const { HomePage } = require('../../../../pageObjects/HomePage');
// const { ProductPage } = require('../../../../pageObjects/ProductPage');

// Utility functions for common tasks
// const commonlib = require('../../../../utils/commonUtil');

// Retrieve and log environment variables to dynamically configure the test environment and application under test.
// This allows for flexible test execution across different settings.
const environment = process.env.TEST_ENV; // Expected values: "qa" or "staging"
console.log(`Current working directory: ${process.cwd()}`);

// Note: This line is commented out for development purposes and should be uncommented in production.
const testDataFilePath = `../../../../testData/sfcc/${environment}TestData.js`;

// Use a placeholder for test data to prevent IDE errors during script development. This is a temporary solution until the above dynamic path is utilized.
// const testData = require('../../../../testData/sfcc/qaTestData');

// Intended for dynamic test data import based on the application and environment. Uncomment and use this line in production for more flexible test data management.
// const testData = require(testDataFilePath);

// Test case to Verify UI of Sign In form displays properly as designs
test('C15295 : Sign In/Join > Verify UI of Sign In form displays properly as designs', { tag: ['@regression'] }, async ({ page }) => {
    page1 = page;
    let skip = test.skip;
    const loginPage = new LoginPage(page)
    // const homepage = new HomePage(page)
    // const productpage = new ProductPage(page)

    // console.log('[INFO] Test Case starts.....')
    // console.log('[INFO] Navigate to the URL.....')
    await loginPage.goToLoginPage(testData.baseUrl); // Navigate to the login page
    // await loginPage.closeModal();
    await loginPage.validateAsGuestUser();
    console.log('[INFO] Click On Sign In Button from Account.....')
    await loginPage.clickOnProfileSigInModal();
    console.log('[INFO] Verify Sign In JOIN UI.....')
    await homepage.verifyLoginDrawerAppears();
    await loginPage.verifySinInDrawerUI(testData.loginPageMsgs.signInWithoutPasswordButton, testData.loginPageMsgs.noPasswordNeededText);
    console.log('[SUCCESS] Complete Order Successful.....')
    console.log('[SUCCESS] Test case Ends.....')
    
})

let page1;

test.afterEach(async ({}, testInfo) => {
    const title = testInfo.title;
    const screenshotPath = `test-results/screenshots/TestRail/${title}.png`;
    await page1.screenshot({ path: screenshotPath, fullPage: true });
    await commonlib.testRail.updateTestRail(testInfo, screenshotPath);
});