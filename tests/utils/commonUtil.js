// Import necessary modules from Playwright for testing, assertions, and browser control.
const { expect, chromium } = require('@playwright/test');
const { HomePage } = require('../pageObjects/HomePage');
const { LoginPage } = require('../pageObjects/LoginPage');
const { ProductPage } = require('../pageObjects/ProductPage');
const { CartPage } = require('../pageObjects/CartPage');
const { CheckoutPage } = require('../pageObjects/CheckoutPage');
const { NewCheckoutPage } = require('../pageObjects/NewCheckouPage');
const { OrderConfirmationPage } = require('../pageObjects/OrderConfirmationPage');
const device = process.env.DEVICE;
const environment = process.env.TEST_ENV; // "qa" or "staging"

const fs = require('fs');
const path = require('path');
const { parseStringPromise } = require('xml2js');

const axios = require('axios');
const FormData = require('form-data'); // Import FormData for uploading attachments
// Replace with your actual TestRail credentials and URL
const CI = process.env.CI;
const TESTRAIL_USERNAME = process.env.TESTRAIL_USERNAME; //'vyshnav.chavala@worldmarket.com';
const TESTRAIL_API_KEY = process.env.TESTRAIL_API_KEY; //'111Acute$$';
const TESTRAIL_URL = 'https://worldmarket.testrail.io/';
const OMS_TEST_RUN_ID = process.env.OMS_TEST_RUN_ID ? process.env.OMS_TEST_RUN_ID : 674;  // Existing TestRail test run ID
const SFCC_TEST_RUN_ID = process.env.SFCC_TEST_RUN_ID ? process.env.SFCC_TEST_RUN_ID : 669;  // Existing TestRail test run ID
const StatusMap = new Map([
    ["failed", 5],
    ["passed", 1],
    ["skipped", 4],
    ["timedOut", 5],
    ["interrupted", 5],
]);

const { OrderHubPage } = require('../pageObjects/OrderHubPage');
const { StoreHubPage } = require('../pageObjects/StoreHubPage');
const { error } = require('console');

// Function to write data to a JSON file
function writeDataToFile(fileName, data) {
    const filePath = path.join(process.cwd(), 'tests', 'testData', fileName);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Data written to ${filePath}`);
}

async function sleep(ms) {
    try {
        console.log(`\n\n ---- Started waiting for ${ms} milliseconds.. ⏰`);
        await new Promise(resolve => setTimeout(resolve, ms));
        console.log(` ---- Wait over for ${ms} milliseconds.. ⏰\n`);
    } catch (err) {
        console.log(`Error while waiting for ${ms} milliseconds:` + err);
    }
}



async function createSTH_Order(page, testData) {
    let orderDetails = {};
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    console.log('------Launch the URL---------')
    await loginPage.goToLoginPage(testData.baseUrl);
    const userEmailaddress = await returnRandomEmail(testData.userEmail)
    await loginPage.login(userEmailaddress, testData.password);
    console.log('------Verify the login--------')
    const loginSuccess = await loginPage.verifySuccessfulLogin('Hi');
    expect(loginSuccess).toBeTruthy();

    await page.waitForLoadState('domcontentloaded');

    console.log('------Check for Inventory availability-------')
    await selectStore(page, testData.inventory.storeName);

    console.log('----------Empty the cart------------');
    await emptyCart(page);
    await homePage.clickWorldMarketLogo();

    console.log('------Search for Products--------------------')
    await homePage.searchForProduct(skip,testData.productData.regular.productCode);
    console.log('-------Select store pickup and Add product to Cart---------')
    await productPage.selectShipToHomeRadioButton();
    await productPage.clickOnAddToCart();
    let productPrice = await productPage.getProductPrice();
    const priceMatch = productPrice.match(/\$\d+\.\d+/);
    if (priceMatch) {
        const priceValue = parseFloat(priceMatch[0].substring(1)); // Extract the number after the '$' and convert it to a float
        productPrice = priceValue.toString(); // Convert the price value to a string
        console.log(`Product Price: ${productPrice}`);
    } else {
        console.log("Price not found");
    }

    console.log('--------Proceed to Checkout-------------')
    await cartPage.proceedToCheckout();

    console.log('--------Review and complete Order----------')
    await checkoutPage.completeCheckout('737');
    console.log('--------Extract Order Details-------------')
    orderDetails = await checkoutPage.getOrderDetails();
    orderDetails.productPrice = await productPrice;
    console.log('orderDetails: ' + orderDetails);

    expect(orderDetails).toBeTruthy();
    expect(orderDetails.orderNumber).toBeTruthy();

    const jsonData = JSON.stringify(orderDetails, null, 2);
    console.log('Order Details.. \n' + jsonData);
    return orderDetails;
}

async function createPickUpOrder(page, testData) {
    let orderDetails = {};
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    console.log('------Launch the URL---------')
    await loginPage.goToLoginPage(testData.baseUrl);
    const userEmailaddress = await returnRandomEmail(testData.userEmail)
    await loginPage.login(userEmailaddress, testData.password);
    console.log('------Verify the login--------')
    const loginSuccess = await loginPage.verifySuccessfulLogin('Hi');
    expect(loginSuccess).toBeTruthy();
    // await page.waitForTimeout(5000);
    await page.waitForLoadState('domcontentloaded');

    console.log('------Check for Inventory availability-------')
    await selectStore(page, testData.inventory.storeName);

    console.log('----------Empty the cart------------');
    await emptyCart(page);
    await homePage.clickWorldMarketLogo();

    console.log('------Search for Products--------------------')
    await homePage.searchForProduct(skip,testData.productData.regular.glassProduct);

    console.log('-------Select store pickup and Add product to Cart---------')
    await productPage.selectStorePickUpandAddToCart();

    console.log('--------Proceed to Checkout-------------')
    await cartPage.proceedToCheckout();

    console.log('--------Review and complete Order----------')
    await checkoutPage.completeCheckout('737');
    console.log('--------Extract Order Details-------------')
    orderDetails = await checkoutPage.getOrderDetails();
    // orderDetails.productPrice = await productPrice;
    console.log('orderDetails: ' + orderDetails);

    expect(orderDetails).toBeTruthy();
    expect(orderDetails.orderNumber).toBeTruthy();

    const jsonData = JSON.stringify(orderDetails, null, 2);
    console.log('Order Details.. \n' + jsonData);
    return orderDetails;
}

async function createSTH_And_BOPIS_Order(page, testData) {

    let orderDetails = {};
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    console.log('------Launch the URL---------')
    await loginPage.goToLoginPage(testData.baseUrl);
    const userEmailaddress = await returnRandomEmail(testData.userEmail)
    await loginPage.login(userEmailaddress, testData.password);
    console.log('------Verify the login--------')
    const loginSuccess = await loginPage.verifySuccessfulLogin('Hi');
    expect(loginSuccess).toBeTruthy();
    await page.waitForLoadState('domcontentloaded');

    console.log('------Check for Inventory availability-------')
    await selectStore(page, testData.inventory.storeName);

    console.log('----------Empty the cart------------');
    await emptyCart(page);
    await homePage.clickWorldMarketLogo();

    console.log('------Adding BOPIS product--------------------')
    await homePage.searchForProduct(skip,testData.productData.regular.productcode);
    await productPage.selectStorePickUpandAddToCart();
    await productPage.clickOnMiniCartCloseButton();

    console.log('--------Adding STH Product---------------------');
    await homePage.clickWorldMarketLogo();
    await homePage.searchForProduct(skip,testData.productData.regular.rootsProduct);
    await productPage.selectShipToHomeRadioButton();
    await productPage.clickOnQtyIncreaseButton();
    await productPage.clickOnQtyIncreaseButton();
    await productPage.clickOnQtyIncreaseButton();
    await productPage.clickOnAddToCart();

    console.log('--------View and Add to Cart-------------')
    await productPage.viewAndAddtoCart();

    await cartPage.freeshippingPromoCodeapply();

    console.log('--------Proceed to Checkout-------------')
    await cartPage.ProceedToCheckoutBopisOrder();

    console.log('--------Review and complete Order----------')
    await checkoutPage.clickOnContinueToPickUp();
    await checkoutPage.ClickonContinuePayment();
    await checkoutPage.cardPayment(testData.payment.CreditCard.visa);
    await checkoutPage.clickOnReviewOrder();
    await checkoutPage.clickOnCompleteOrder();
    console.log('--------Extract Order Details-------------')
    orderDetails = await checkoutPage.getOrderDetails();
    // orderDetails.productPrice = await productPrice;
    console.log('orderDetails: ' + orderDetails);

    expect(orderDetails).toBeTruthy();
    expect(orderDetails.orderNumber).toBeTruthy();

    const jsonData = JSON.stringify(orderDetails, null, 2);
    console.log('Order Details.. \n' + jsonData);
    return orderDetails;

}

/**
 * 
 * @param {*} page 
 * @param {*} testData 
 * @param {*} deliveryMethod - Choose delivery method as 'PICK' or 'SHP' - By default it's a PICK
 * @returns order details
 */
async function createMultiLineOrder(page, testData, deliveryMethod = "PICK") {
    console.log('Creating Multi line Pickup order...');
    let orderDetails = {};
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    console.log('------Launch the URL---------')
    await loginPage.goToLoginPage(testData.baseUrl);
    const userEmailaddress = await returnRandomEmail(testData.userEmail)
    await loginPage.login(userEmailaddress, testData.password);
    console.log('------Verify the login--------')
    const loginSuccess = await loginPage.verifySuccessfulLogin('Hi');
    expect(loginSuccess).toBeTruthy();

    console.log('--------- Empty the Cart--------------');
    await emptyCart(page);
    await homePage.clickWorldMarketLogo();

    console.log('------Check for Inventory availability-------')
    await selectStore(page, testData.inventory.storeName)

    console.log('------Search for Products-------------------')
    // let productPrice = await productPage.getProductPrice();
    // const priceMatch = productPrice.match(/\$\d+\.\d+/);
    // if (priceMatch) {
    //     const priceValue = parseFloat(priceMatch[0].substring(1)); // Extract the number after the '$' and convert it to a float
    //     productPrice = priceValue.toString(); // Convert the price value to a string
    //     console.log(`Product Price: ${productPrice}`);
    // } else {
    //     console.log("Price not found");
    // }
    if (deliveryMethod == 'PICK') {
        await homePage.searchForProduct(skip,testData.productData.regular.glassProduct);
        await productPage.selectStorePickUpandAddToCart();
    } else {
        await homePage.searchForProduct(skip,testData.productData.regular.chairProduct);
        await productPage.selectShipToHomeRadioButton();
        await productPage.clickOnAddToCart();
    }
    await productPage.clickOnMiniCartCloseButton();

    console.log('------Search for second Products--------------------');
    await homePage.clickWorldMarketLogo();
    console.log('-------Add product to Cart---------')
    if (deliveryMethod == 'PICK') {
        await homePage.searchForProduct(skip,testData.productData.regular.rootsProduct);
        await productPage.selectStorePickUpandAddToCart();
    } else {
        await homePage.searchForProduct(skip,testData.productData.regular.rootsProduct);
        await productPage.selectShipToHomeRadioButton();
        await productPage.clickOnAddToCart();
    }

    console.log('--------Proceed to Checkout-------------')
    await cartPage.proceedToCheckout();

    console.log('--------Review and complete Order----------')
    await checkoutPage.completeCheckout(testData.payment.CreditCard.visa.cvv);
    console.log('--------Extract Order Details-------------')
    orderDetails = await checkoutPage.getOrderDetails();
    // orderDetails.productPrice = await productPrice;
    console.log('orderDetails: ' + orderDetails);

    expect(orderDetails).toBeTruthy();
    expect(orderDetails.orderNumber).toBeTruthy();
    console.log('Multi line Pickup order has been placed...');
    const jsonData = JSON.stringify(orderDetails, null, 2);
    console.log('Order Details.. \n' + jsonData);
    return orderDetails;
}

async function createMultiQuantityPickUpOrder(page, testData) {
    console.log('Creating Multi Quantity Pickup order...');
    let orderDetails = {};
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    console.log('------Launch the URL---------')
    await loginPage.goToLoginPage(testData.baseUrl);
    const userEmailaddress = await returnRandomEmail(testData.userEmail)
    await loginPage.login(userEmailaddress, testData.password);
    console.log('------Verify the login--------')
    const loginSuccess = await loginPage.verifySuccessfulLogin('Hi');
    expect(loginSuccess).toBeTruthy();
    await page.waitForLoadState('domcontentloaded');

    console.log('------Check for Inventory availability-------')
    await selectStore(page, testData.inventory.storeName);

    console.log('----------Empty the cart------------');
    await emptyCart(page);
    await homePage.clickWorldMarketLogo();
    console.log('------Search for Products--------------------')
    await homePage.searchForProduct(skip,testData.productData.regular.glassProduct);

    console.log('-------Select store pickup and Add product to Cart---------')
    let productPrice = await productPage.getProductPrice();
    const priceMatch = productPrice.match(/\$\d+\.\d+/);
    if (priceMatch) {
        const priceValue = parseFloat(priceMatch[0].substring(1)); // Extract the number after the '$' and convert it to a float
        productPrice = priceValue.toString(); // Convert the price value to a string
        console.log(`Product Price: ${productPrice}`);
    } else {
        console.log("Price not found");
    }
    await productPage.clickOnQtyIncreaseButton(1);
    await productPage.selectStorePickUpandAddToCart();

    console.log('--------Proceed to Checkout-------------')
    await cartPage.proceedToCheckout();

    console.log('--------Review and complete Order----------')
    await checkoutPage.completeCheckout('737');
    console.log('--------Extract Order Details-------------')
    orderDetails = await checkoutPage.getOrderDetails();
    orderDetails.productPrice = await productPrice;
    console.log('orderDetails: ' + orderDetails);

    expect(orderDetails).toBeTruthy();
    expect(orderDetails.orderNumber).toBeTruthy();
    console.log('Multi line Pickup order has been placed...');
    const jsonData = JSON.stringify(orderDetails, null, 2);
    console.log('Order Details.. \n' + jsonData);
    return orderDetails;
}

async function createOrderCart(page, skip, appURL, userType, username, password, productCode, method, storeName) {
    console.log('[START] Test Started.....');
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const productPage = new ProductPage(page);
    console.log('[INFO] Launching URL.....');
    await loginPage.goToLoginPage(appURL);
    console.log('[INFO] URL Launched. Proceeding with login.....');
    if (userType !== 'Guest') {
        console.log('[INFO] Continue to Login for registered user.....');
        await loginPage.login(username, password);
        const loginSuccess = await loginPage.verifySuccessfulLogin('Hi'); // Verify login success message
        expect(loginSuccess).toBeTruthy();
    } else {
        console.log('[INFO] Proceed with Guest User.....');
        await loginPage.closeModal();
        console.log('[SUCCESS] Modal Closed.....');
        await selectStore(page, storeName);
    }
    console.log('[SUCCESS] Login Successful.....')
    console.log('[INFO] Inventory Checking Started.....');
    await selectStore(page, storeName)
    console.log('[INFO] Emptying Cart Start.....');
    await emptyCart(page);
    console.log('------Search for Products--------------------');
    await homePage.searchForProduct(skip,productCode);
    console.log('---- Select product delivery mode to Pickup -----');
    await selectDeliveryMethod(page, skip, method)
    console.log('----Add to Card----');
    await productPage.clickOnAddToCart();
}

async function scheduleAndReleaseOrder_OrderHub(page, orderNumber) {
    const orderHubPage = new OrderHubPage(page);
    await orderHubPage.launchOrderHub();
    await orderHubPage.login();
    await orderHubPage.navigateTo_ORDERS_OUTBOUND();
    await orderHubPage.searchWithOrderNumber(orderNumber);
    await orderHubPage.authorizePayment(); // Authorizing the payment
    await orderHubPage.clickOrderHoldsLink(); // Clicking on Order Holds link
    await orderHubPage.selectAllRowsOfLineItems();
    await orderHubPage.clickOnResolveButton(); // Click on Resolve button
    await orderHubPage.scheduleOrder(); // Scheduling an order
    await orderHubPage.releaseOrder(); // Releasing an order
}

async function validateOrderShortPick(page, orderNumber, orderDetails) {
    console.log('------Call center validation started........')
    const orderHubPage = new OrderHubPage(page);
    await orderHubPage.launchOrderHub();
    await orderHubPage.login();
    await orderHubPage.navigateTo_ORDERS_OUTBOUND();
    await orderHubPage.searchWithOrderNumber(orderDetails.orderNumber);
    await orderHubPage.validateOderStatusAs('Backordered');
}


//This function is use to Empty the cart before starting with product selection
async function emptyCart(page) {
    console.log('Checking cart status...');
    const cartStatus = await page.locator('button.minicart-link').filter({ hasText: 'CART' }).getAttribute('title');
    console.log(`Cart status: ${cartStatus}`);

    if (cartStatus.includes('0 Items')) {
        console.log("The cart is already empty.");
        return;
    }

    console.log('Navigating to the cart to empty it...');
    await page.waitForLoadState('domcontentloaded') //wait till dom content gets loaded
    await page.locator('button.minicart-link').filter({ hasText: 'CART' }).click({timeout: 10000});
    if (device == undefined || device == '') {
        await page.locator('a[role=button]:visible').filter({ hasText: 'VIEW CART & CHECKOUT' }).click({timeout: 10000});
    }
    await page.waitForLoadState('domcontentloaded') //wait till dom content gets loaded

    let itemsPresent = true;
    while (itemsPresent) {
        const quantityInputs = await page.locator('input[name*="quantity"]:visible');
        const itemCount = await quantityInputs.count();
        if (itemCount === 0) {
            itemsPresent = false;
            break;
        } else {
            console.log(`Found ${itemCount} items in the cart. Removing...`);
            await quantityInputs.nth(0).fill('0'); // Always target the first visible item due to DOM updates
            await page.keyboard.press('Enter'); // Assuming 'Enter' confirms the change
            await page.waitForTimeout(5000)
            console.log(`Item set to quantity '0' and confirmed.`);
            await page.waitForLoadState('domcontentloaded') //wait till
        }
    }
    //Validate that the cart is now empty
    await expect(page.getByRole('heading', { name: 'Your Cart is Empty' })).toBeVisible();
    console.log('...Cart is Empty now...')
}

//This function will be use to select the delivery method 
async function selectDeliveryMethod(page, skip, method) {
    let deliveryMethodLocator;

    switch (method) {
        case 'Pick Up':
            const available = await page.locator('div.js-storepickup-item.available').first().isVisible({timeout: 5000});
            if(!available) {
                let url = await page.url();
                skip(true, `${method} - product is not available.. - ${url} `);
            }
            deliveryMethodLocator = await page.locator('label').filter({ hasText: 'Free Pick Up How Store Pick-' }).first();
            break;
        case 'Ship to Home':
            const stock = await page.locator('div.js-homedelivery-item.available').first().isVisible({timeout: 5000});
            if(!stock) {
                let url = await page.url();
                skip(true, `${method} - product is not available.. - ${url} `);
            }
            deliveryMethodLocator = await page.locator('label').filter({ hasText: 'Shipping Shipping' }).first();
            break;
        default:
            console.log(`Delivery method "${method}" is not recognized.`);
            return;
    }

    // Attempt to select the delivery method
    await deliveryMethodLocator.click({timeout: 10000});

    let confirmationText = method === 'Pick Up' ? 'Store Pick-' : 'Shipping';
    await expect(deliveryMethodLocator).toHaveText(new RegExp(confirmationText, 'i'), { timeout: 5000 });
    console.log(`[SUCCESS] ${method} delivery method selected successfully.....`);
}

//This function will be used for updating the product quantity on PDP page
async function updateProductQuantityOnPDP(page, quantity) {
    await page.locator('.qty-incrementer').click({timeout: 10000});

    console.log('...quanity input got clicked...')
    // Select the quantity textbox, fill it with the desired quantity, and press 'Enter' to update
    const quantityTextbox = await page.getByRole('textbox').first();
    await quantityTextbox.click({timeout: 10000});
    await quantityTextbox.fill(`${quantity}`);
    console.log(`...Product quantity got filled with value ${quantity}...`)

    await quantityTextbox.press('Enter');

    // validate the quantity inserted in the quantitybox
    await expect(quantityTextbox).toHaveValue(`${quantity}`);
    console.log(`...Product quanity value got validated...`)

}

//This function will be used for validating the product quantity on Cart Page
async function validateQuantityonCheckout(page, expectedQuantity) {
    try {
        const qntVal = await page.getByLabel('quantity:').first().getAttribute('value');
        console.log('...Quantity is - ' + qntVal);
        expect(qntVal).toEqual(expectedQuantity.toString());
        console.log('...Quantity validation successful...');
    } catch (error) {
        console.error('...Quantity validation failed:', error.message);
        throw error; // throw error 
    }
}

//Perform Paypal payment process with email and Password
async function handlePayPalPayment(page, context, email, password) {
    const [newPage] = await Promise.all([
        context.waitForEvent('page'), // Set up the listener
        page.frameLocator('iframe[title="PayPal"]').getByLabel('PayPal').first().click({timeout: 10000})
    ]);
    await newPage.waitForLoadState('domcontentloaded');

    // Fill in the PayPal credentials and log in
    await newPage.getByPlaceholder('Email or mobile number').click({timeout: 10000});
    console.log('----- PayPal payment method started -------')
    await newPage.getByPlaceholder('Email or mobile number').click({timeout: 10000});
    await newPage.getByPlaceholder('Email or mobile number').fill(email);
    await newPage.locator('#splitEmail').click({timeout: 10000});
    await newPage.getByRole('button', { name: 'Next' }).click({timeout: 10000});
    await newPage.getByPlaceholder('Password').click({timeout: 10000});
    await newPage.getByPlaceholder('Password').fill(password);
    await newPage.getByRole('button', { name: 'Log In' }).click({timeout: 10000});
    await newPage.getByTestId('submit-button-initial').click({timeout: 10000});
    console.log('---- Paypal payment Added -------')
}


async function CloseModalAndLogin(page, email, password) {
    if (await page.getByRole('button', { name: 'Close' }).isVisible()) {
        await page.waitForTimeout(3000)
        await page.getByRole('button', { name: 'Close' }).click({timeout: 10000});
    }
    await page.waitForTimeout(3000)
    await page.getByRole('button', { name: 'Sign in' }).click({timeout: 10000});
    await page.locator('#popover-sigin').getByRole('button', { name: 'Sign in' }).click({timeout: 10000});
    await page.getByLabel('Sign In').getByText('* Email Address').click({timeout: 10000});
    await page.getByRole('textbox', { name: '* Email Address' }).click({timeout: 10000});
    await page.getByRole('textbox', { name: '* Email Address' }).fill(email);
    await page.getByText('* Password').click({timeout: 10000});
    await page.getByPlaceholder('* Password').fill(password);
    await page.getByRole('button', { name: 'Sign In', exact: true }).click({timeout: 10000});
}

//select the required inventory store
async function selectStore(page, storeName) {
    let selectedStore = '', newSelectedStore = '';
    await page.waitForLoadState('domcontentloaded');
    if (device == undefined || device == '') {
        selectedStore = await page.getByLabel('header', { exact: true }).getByRole('button', { name: 'My Store' }).innerText({timeout: 10000});
        await page.waitForLoadState('domcontentloaded');
    } else {
        console.log('Device name: ' + device);
        selectedStore = await page.locator('div.header input#selectedStoreId').getAttribute('data-name', { timeout: 3000 });

        // await page.getByLabel('header', { exact: true }).getByRole('button', { name: 'My Store' }).click({timeout: 10000});
        // console.log('Clicked on "My Store" button');
        // selectedStore = await page.locator('div.store-card-top span.text-xl').first().innerText({timeout: 10000});
        // await page.getByRole('button', { name: 'Close header banner' }).click({timeout: 10000});
        await page.waitForLoadState('domcontentloaded');
    }

    console.log(`Displayed Store selected as : ${selectedStore.trim()}`)
    if (selectedStore.includes(storeName)) {
        console.log('Store already selected:', storeName);
        return 'Store already selected';
    } else {
        // Click on the 'My Store' button to start the selection process
        await page.getByLabel('header', { exact: true }).getByRole('button', { name: 'My Store' }).click({timeout: 10000});
        console.log('Clicked on "My Store" button');
        // Enter the store name (or ZIP/City) in the search field and search
        const searchInput = page.getByLabel('Enter ZIP Code or City, State.');
        await searchInput.click({timeout: 10000});
        await searchInput.fill(storeName);
        await page.getByRole('button', { name: 'Search', exact: true }).click({timeout: 10000});
        await page.waitForLoadState('domcontentloaded');
        await page.getByRole('dialog').getByText(storeName, { exact: true }).click({timeout: 10000});
        await expect(page.getByRole('dialog').getByText(storeName, { exact: true })).toBeVisible();
        await page.locator('li').filter({ hasText: `${storeName}` }).locator('button').filter({ hasText: 'Select store' }).click({timeout: 10000});
        await page.waitForTimeout(5000)
        //verify the store selection
        if (device == undefined || device == '') {
            newSelectedStore = await page.getByLabel('header', { exact: true }).getByRole('button', { name: 'My Store' }).innerText({timeout: 10000});
        } else {
            console.log('Device name: ' + device);
            newSelectedStore = await page.locator('div.header input#selectedStoreId').getAttribute('data-name', { timeout: 3000 });
        }
        if (newSelectedStore.includes(storeName)) {
            console.log('New Store selected is :', storeName);
            return 'Store selected';
        } else {
            throw console.log(error)
        }
    }
}

/**
 * 
 * @param {*} userEmail 
 * @returns 
 */
async function returnRandomEmail(userEmail = []) {
    const userEmailAddress = userEmail[Math.floor(Math.random() * userEmail.length)]
    console.log('user Email  - ', userEmailAddress)
    return userEmailAddress
}

// Function to read email data
function readData(qaTestDataPath) {
    const data = fs.readFileSync(qaTestDataPath, 'utf-8');
    return eval(data);
}

// Function to write back updated email data
function writeData(qaTestDataPath, data) {
    fs.writeFileSync(qaTestDataPath, data);
}

// Main function to fetch and remove an email
function fetchAndRemoveEmail(qaTestDataPath) {
    const data = readData(qaTestDataPath);
    let emails = data.userEmail;


    if (!emails || !Array.isArray(emails)) {
        console.error('Invalid emails:', emails);
        return;
    }
    if (emails.length === 0) {
        console.log('No emails left to fetch.');
        return null;
    }

    // Fetch the last email and remove it
    const emailToFetch = emails.pop();

    // Write the updated array back to the file
    if (CI) {
        // Update the existing data structure with the modified userEmail array
        const updatedData = {
            ...data,
            userEmail: emails, // Update the userEmail array
        };

        const newData = `// testData/OMS/qaTestData.js
//Test data specific to OMS qa environment
let baseURL = 'https://cstpl-qa-1.oms.supply-chain.ibm.com/';

module.exports = ${JSON.stringify(updatedData, null, 2)}`;
        writeData(qaTestDataPath, newData);
    }
    console.log('Fetched Email ID - ' + emailToFetch);
    return emailToFetch;
}



/**
 * 
 * @param {*} page 
 * @param {*} testData 
 * Required testData = { 
 *          baseUrl,
            username,
            password,
            productCode,
            deliveryMethod,
            storeName
 }
 * @returns 
 */
async function createOrder(page, testData) {
    let orderDetails = {};
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    console.log('[INFO] Launching URL---------')
    await loginPage.goToLoginPage(testData.baseURL);
    await loginPage.login(testData.username, testData.password);
    console.log('[INFO] Verify the login--------')
    console.log('[INFO] Check for Inventory availability-------')
    await loginPage.verifySuccessfulLogin('Hi')
    console.log('[INFO] Emptying the cart-------')
    await emptyCart(page)
    await selectStore(page, testData.storeName)
    await page.waitForLoadState('domcontentloaded')
    console.log('[INFO] Search for Products--------------------')
    await homePage.searchForProduct(skip,testData.productCode);
    console.log('[INFO] Select DeliveryMethod---------')
    await selectDeliveryMethod(page, skip, testData.deliveryMethod)
    console.log('[INFO] Add Product to Cart---------')
    await productPage.clickOnAddToCart();
    // await page.locator('a[role=button]:visible').filter({ hasText: 'VIEW CART & CHECKOUT' }).click()
    // let productPrice = await productPage.getProductPrice();
    // const priceMatch = productPrice.match(/\$\d+\.\d+/);
    // if (priceMatch) {
    //     const priceValue = parseFloat(priceMatch[0].substring(1)); // Extract the number after the '$' and convert it to a float
    //     productPrice = priceValue.toString(); // Convert the price value to a string
    //     console.log(`Product Price: ${productPrice}`);
    // } else {
    //     console.log("Price not found");
    // }
    console.log('[INFO] Proceed to Checkout-------------')
    await cartPage.proceedToCheckout();
    console.log('[INFO] Review and complete Order----------')
    await checkoutPage.completeCheckout('737');
    console.log('[INFO] Extract Order Details-------------')
    orderDetails = await checkoutPage.getOrderDetails();
    //orderDetails.productPrice = await productPrice;
    console.log('orderDetails: ' + orderDetails);

    expect(orderDetails).toBeTruthy();
    expect(orderDetails.orderNumber).toBeTruthy();

    const jsonData = JSON.stringify(orderDetails, null, 2);
    console.log('[INFO] ..Order Details.. \n' + jsonData);

    return orderDetails;
}


// Usage example
// await selectStore(page, 'Webster');



/**
 * 
 * This method launches Browser at proxy server http://localhost:8080
 * @returns context
 */
async function launchBrowserWithProxy() {
    const browser = await chromium.launch({
        // headless: true, // Run the browser in headless mode for visibility during testing.
        ignoreHTTPSErrors: true, // Ignore HTTPS errors, useful for testing environments with self-signed certs.
        args: [
            '--disable-gpu', // Disables GPU hardware acceleration. If software renderer is not in place, this can help avoid errors.
            '--no-sandbox', // Disables the sandbox for all process types that are normally sandboxed.
            '--disable-setuid-sandbox', // Disables the setuid sandbox (Linux only).
            '--ignore-certificate-errors', // Ignores certificate errors, allowing testing on sites with invalid certs.
            '--ignore-ssl-errors', // Similar to ignore certificate errors but for SSL protocol errors.
            `--proxy-server=http://localhost:8080`, // Use a proxy server for network requests. Useful for capturing network traffic.
        ],
    });
    const context = await browser.newContext(); // Create a new browser context for isolation.
    // return await context.newPage();
    return context;
}

async function completeStoreAndCustomerPick_StoreHub(page, orderNumber) {
    const storeHubPage = new StoreHubPage(page);
    await storeHubPage.launchStoreHub();
    await storeHubPage.login();
    await storeHubPage.searchOrderNumber_PickOrders(orderNumber);
    await storeHubPage.clickOnPickOrderLine();
    await storeHubPage.clickOnPickOrderQtyIncreaseBtn();
    await storeHubPage.clickOnYesButtonOnConfirmationPopup();
    await storeHubPage.clickOnColseCTA_PickOrder(); // click on Closer order
    await storeHubPage.clickOnCustomerPickUpAndSearchOrderNumber(orderNumber); // search with order number on Customer Pick section
    await storeHubPage.selectIDCardAsVerification(); // Select ID Card as verification
    await storeHubPage.clickOnCustomerPickUpLine(); // click on item line
    await storeHubPage.clickOnCustomerPickOrderIncreaseQtyBtn(); // Increase the pick up quantity
    await storeHubPage.clickOnDoneCTA_CustomerPick(); // Click on Done CTA on Customer Pick section
    await storeHubPage.clickOnCloseCTA_CustomerPick(); // Click on Close Customer Pick section
}

async function createMultiLineOrderWithAlternatePerson(page, testData, deliveryMethod = "Pick Up") {
    console.log('Creating Multi line Pickup order...');
    let orderDetails = {};
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    console.log('------Launch the URL---------')
    await loginPage.goToLoginPage(testData.baseUrl);
    await page.waitForTimeout(3000);
    const userEmailaddress = await returnRandomEmail(testData.userEmail)
    await loginPage.login(userEmailaddress, testData.password);
    console.log('------Verify the login--------')
    const loginSuccess = await loginPage.verifySuccessfulLogin('Hi');
    expect(loginSuccess).toBeTruthy();

    console.log('--------- Empty the Cart--------------');
    await emptyCart(page);
    await homePage.clickWorldMarketLogo();
    await page.waitForLoadState('domcontentloaded');

    console.log('------Check for Inventory availability-------')
    await selectStore(page, testData.inventory.storeName);
    console.log('------Search for Products--------------------')
    await homePage.searchForProduct(skip,testData.productData.regular.glassProduct);
    await selectDeliveryMethod(page, skip, deliveryMethod);
    await productPage.clickOnAddToCart();

    await productPage.clickOnMiniCartCloseButton();

    console.log('------Search for second Products--------------------');
    await homePage.searchForProduct(skip,testData.productData.regular.rootsProduct);
    await selectDeliveryMethod(page, skip, deliveryMethod);
    await productPage.clickOnAddToCart();

    console.log('--------View and Add to Cart-------------')
    await productPage.viewAndAddtoCart();

    console.log('--------Proceed to Checkout-------------')
    await cartPage.ProceedToCheckoutBopisOrder();

    console.log('--------Select Self Pick or Alternate Pickup -------------')
    await checkoutPage.selfOrAlternatePickup(testData.userDetails.billing.billing1);

    console.log('--------Review and complete Order----------')
    await checkoutPage.completeCheckout('737');
    console.log('--------Extract Order Details-------------')
    orderDetails = await checkoutPage.getOrderDetails();
    console.log('orderDetails: ' + orderDetails);

    expect(orderDetails).toBeTruthy();
    expect(orderDetails.orderNumber).toBeTruthy();
    console.log('Multi line Pickup order has been placed...');
    const jsonData = JSON.stringify(orderDetails, null, 2);
    console.log('Order Details.. \n' + jsonData);
    return orderDetails;
}

async function createSurchargeOrderWithFreeShipping(page, testData, paymentType = "CC", context = null) {
    console.log('Creating Multi line Pickup order...');
    let orderDetails = {};
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    console.log('------Launch the URL---------')
    await loginPage.goToLoginPage(testData.baseUrl);
    const userEmailaddress = await returnRandomEmail(testData.userEmail)
    await loginPage.login(userEmailaddress, testData.password);
    console.log('------Verify the login--------')
    const loginSuccess = await loginPage.verifySuccessfulLogin('Hi');
    expect(loginSuccess).toBeTruthy();

    console.log('--------- Empty the Cart--------------');
    await emptyCart(page);
    await homePage.clickWorldMarketLogo();
    await page.waitForLoadState('domcontentloaded');

    console.log('------Check for Inventory availability-------')
    await selectStore(page, testData.inventory.storeName);
    console.log('------Search for Products--------------------')
    await homePage.searchForProduct(skip,testData.productData.regular.chairProduct);
    await selectDeliveryMethod(page, skip, 'Ship to Home');
    await productPage.clickOnAddToCart();

    await productPage.clickOnMiniCartCloseButton();

    console.log('------Search for second Products--------------------');
    await homePage.searchForProduct(skip,testData.productData.regular.rootsProduct);
    await selectDeliveryMethod(page, skip, 'Ship to Home');
    await productPage.clickOnQtyIncreaseButton(2);
    // await productPage.clickOnQtyIncreaseButton();
    await productPage.clickOnAddToCart();

    console.log('--------View and Add to Cart-------------')
    await productPage.viewAndAddtoCart();

    await cartPage.freeshippingPromoCodeapply();

    console.log('--------Proceed to Checkout-------------')
    await cartPage.ProceedToCheckoutBopisOrder();

    console.log('--------Review and complete Order----------')
    if (paymentType == "paypal" || paymentType == "Paypal") {
        await checkoutPage.submitShippingButton.click({timeout: 10000});
        console.log("[INFO] Clicked on Continue to Payment..");
        await page.waitForLoadState('load');
        if (await page.getByRole('img', { name: 'Check out with PayPal' }).isVisible()) {
            console.log('[INFO] Found and clicking Checkout with PayPal...');
            await page.getByRole('img', { name: 'Check out with PayPal' }).click({timeout: 10000});
            await page.waitForURL('**/*#placeOrder');
            console.log('[INFO] Validating placement order page...');

            await expect(page.url()).toContain('placeOrder');
            await expect(page.getByText('Payment: PayPal').click()).toBeTruthy();
            await page.getByRole('button', { name: 'Complete Order' }).click({timeout: 10000});
            console.log('[INFO] Complete Order clicked. Waiting for order confirmation...');

            await page.waitForLoadState('load');
            await page.waitForURL('**\/Order-Confirm');
            console.log('[SUCCESS] Order placement completed. Validating order confirmation...');

        } else {
            console.log('[INFO] Checkout with PayPal not visible. Proceeding with Paypal button clicking');
            await handlePayPalPayment(page, context, testData.payment.paypal.useremail, testData.payment.paypal.password);

            await page.waitForURL('**/*#payment');
            await expect(page.url()).toContain('payment');
            await page.getByRole('button', { name: 'Continue to review order' }).click({timeout: 10000});
            console.log('[INFO] Continue to review order clicked. Validating placement order page...');

            await page.waitForURL('**/*#placeOrder');
            await expect(page.url()).toContain('placeOrder');
            await expect(page.getByText('Payment: PayPal').click()).toBeTruthy();
            await page.getByRole('button', { name: 'Complete Order' }).click({timeout: 10000});
            console.log('[INFO] Complete Order clicked. Waiting for order confirmation...');

            await page.waitForLoadState('load');
            await page.waitForURL('**\/Order-Confirm');
            console.log('[SUCCESS] Order placement completed. Order confirmation validated.');
        }
    } else {
        await checkoutPage.completeCheckout('737');
        await page.waitForURL('**\/Order-Confirm');
        console.log('[SUCCESS] Order placement completed. Order confirmation validated.');
    }
    console.log('--------Extract Order Details-------------')
    orderDetails = await checkoutPage.getOrderDetails();
    console.log('orderDetails: ' + orderDetails);

    expect(orderDetails).toBeTruthy();
    expect(orderDetails.orderNumber).toBeTruthy();
    console.log('Multi line Pickup order has been placed...');
    const jsonData = JSON.stringify(orderDetails, null, 2);
    console.log('Order Details.. \n' + jsonData);
    return orderDetails;
}

/**
 * 
 * @param {*} page 
 * @param {*} qaData 
 * @param {*} context 
 * @returns 
 * 
 * @requires let qaData = {
        productDetails: [
            {
                productCode: "SKUID",
                quantity: 2,
                deliveryMethod: "Ship to Home" or "Pick Up"
            }
        ],

        shippingDetails: {
            addNewDetails: true or false
            address: testData.shipping, (if addNewDetails is 'true' only)
        },

        paymentDetails : {
            paymentMethod: "Paypal",
            addNewCreditCard : true or false
            creditCardDetails : testData.CreditCard, (if addNewDetails is 'true' only and paymentMethod 'CreditCard')
        },
    };
 * 
 */
async function createOrderData(page, skip, qaData, context = null) {
    console.log('\n\n******************** Creating Order Data 🚛 ********************\n\n');
    let orderDetails = {};
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const newCheckoutPage = new NewCheckoutPage(page)

    console.log('\n\n--------- Launch the URL ---------\n')
    await loginPage.goToLoginPage(qaData.baseUrl);
    await page.waitForLoadState('domcontentloaded');
    const qaTestDataPath = path.join('tests', 'testData', 'oms', `${environment.toLocaleLowerCase()}TestData.js`);
    const userEmailaddress = await fetchAndRemoveEmail(qaTestDataPath)
    await loginPage.login(userEmailaddress, qaData.password);
    console.log('\n\n--------- Verify the login ---------\n')
    const loginSuccess = await loginPage.verifySuccessfulLogin('Hi');
    expect(loginSuccess).toBeTruthy();
    console.log('Login successfull.. ✅');

    console.log('\n\n--------- Empty the Cart ---------\n');
    await page.waitForLoadState('domcontentloaded');
    await emptyCart(page);
    await homePage.clickWorldMarketLogo();
    await page.waitForLoadState('domcontentloaded');
    console.log('Cart is Empty.. 🛒');

    console.log('\n\n--------- Check for Inventory availability ---------\n')
    await selectStore(page, qaData.storeName);

    console.log('\n\n--------- Adding products to the cart ---------\n')
    {
        for (let i = 0; i < qaData.productDetails.length; i++) {
            let element = qaData.productDetails[i];
            let quantity = typeof (element.quantity) == "string" ? parseInt(element.quantity) : element.quantity;
            console.log('Product Quantity to be added:' + quantity);
            await homePage.searchForProduct(skip, [element.productCode]);
            await selectDeliveryMethod(page, skip, element.deliveryMethod);
            let count = 1;
            while (count < quantity) {
                await productPage.clickOnQtyIncreaseButton();
                console.log('Inside While loop and clicked on increase qty');
                await page.waitForLoadState('domcontentloaded');
                count++;
            }
            if (qaData.eGiftCardDetails) {
                await productPage.eGiftCardDetails(qaData.eGiftCardDetails);
            }
            await productPage.clickOnAddToCart();
            await productPage.clickOnMiniCartCloseButton();
            await page.waitForLoadState('domcontentloaded');
            await homePage.clickWorldMarketLogo();
            await page.waitForLoadState('domcontentloaded');
            console.log('🛒 Added Product to cart: ' + element.productCode + '\n');
        };
    }

    console.log('\n\n--------- Navigated to Cart Page ---------\n');
    {
        await page.locator('button.minicart-link').click({timeout: 10000});
        await page.locator('a[role=button]:visible').filter({ hasText: 'VIEW CART & CHECKOUT' }).click()
        await page.waitForLoadState('domcontentloaded'); //wait till dom content gets loaded
        if (qaData.freeShipping) {
            await cartPage.freeshippingPromoCodeapply();
            await page.waitForLoadState('domcontentloaded');
            console.log('[INFO] Applied Free Shipping Promo Code')
        }

        if (qaData.store10Coupon) {
            console.log('[INFO] Appling Store10 coupon..')
            await cartPage.applyPromocodeForEmployeeUser(qaData.store10Coupon);
        }

        if (qaData.fiveDollarCoupon) {
            await cartPage.applyFiveDollarReward();
            await page.waitForLoadState('domcontentloaded');
            console.log('[INFO] Applied Five Dollar Reward coupon');
        }
        console.log('[INFO] navigating to Checkout page')
        await cartPage.ProceedToCheckoutBopisOrder();
        await page.waitForLoadState('domcontentloaded');
    }

    console.log('\n\n--------- Navigated to Checkout Page --------\n')
    {
        console.info('Managing the shipping details... ');
        if (qaData.shippingDetails.addNewDetails) {
            console.log('[INFO] Adding new shipping details..')
            await checkoutPage.addNewShippingAddress(qaData.shippingDetails.address);
            await page.waitForLoadState('domcontentloaded');
        }

        if (await checkoutPage.continueToPickUpButton.isVisible()) {
            console.log('[INFO] clicking on Continue to Pick up button..');
            await checkoutPage.clickOnContinueToPickUp();
        }

        if (await page.locator("button[class='btn btn-primary btn-block submit-shipping-pickup']").isVisible()) {
            await page.waitForLoadState('domcontentloaded');
            console.log('[INFO] clicking on Continue to Payment button..');
            await page.locator("button[class='btn btn-primary btn-block submit-shipping-pickup']").click({timeout: 10000});
        }

        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(3000);
        if (await checkoutPage.submitShippingButton.isVisible()) {
            if (await page.getByRole('button', { name: 'Use this Address' }).isVisible()) {
                console.log('[INFO] clicking on "Use this Address" button..');
                await page.getByRole('button', { name: 'Use this Address' }).click({timeout: 10000});
                await page.waitForLoadState('domcontentloaded');
            }
            await page.waitForLoadState('domcontentloaded');
            console.log('[INFO] clicking on "Submit shipping" button..');
            await checkoutPage.submitShippingButton.click({timeout: 10000});
        }
        await page.waitForLoadState('domcontentloaded');

        console.info('Managing the payment details...');
        let paymentType = qaData.paymentDetails.paymentMethod;
        console.log('Payment Method: ' + paymentType)
        if ((paymentType == "paypal") || (paymentType == "Paypal")) {
            console.log("[INFO] Clicked on Continue to Payment..");
            await page.locator('div:nth-child(3) > .card-payment-label > .d-flex').click({ timeout: 50000 });
            console.log(`[INFO] Selected the Paypal radio button-------------`);
            await page.waitForLoadState('domcontentloaded');
            if (await page.getByRole('img', { name: 'Check out with PayPal' }).isVisible()) {
                console.log('[INFO] Found and clicking Checkout with PayPal...');
                await page.getByRole('img', { name: 'Check out with PayPal' }).click({timeout: 10000});
                await page.waitForURL('**/*#placeOrder');
                console.log('[INFO] Validating placement order page...');

                await expect(page.url()).toContain('placeOrder');
                await expect(page.getByText('Payment: PayPal').click()).toBeTruthy();
                await page.getByRole('button', { name: 'Complete Order' }).click({timeout: 10000});
                console.log('[INFO] Complete Order clicked. Waiting for order confirmation...');

                await page.waitForLoadState('load');
                await page.waitForURL('**\/Order-Confirm');
                console.log('[SUCCESS] Order placement completed. Validating order confirmation...');

            } else {
                console.log('[INFO] Checkout with PayPal not visible. Proceeding with Paypal button clicking');
                await handlePayPalPayment(page, context, qaData.paymentDetails.paypalCreds.useremail, qaData.paymentDetails.paypalCreds.password);

                // await page.waitForURL('**/*#payment');
                // await expect(page.url()).toContain('payment');
                // await page.getByRole('button', { name: 'Continue to review order' }).click({timeout: 10000});
                // console.log('[INFO] Continue to review order clicked. Validating placement order page...');

                await page.waitForURL('**/*#placeOrder');
                await expect(page.url()).toContain('placeOrder');
                await expect(page.getByText('Payment: PayPal').click()).toBeTruthy();
                await page.getByRole('button', { name: 'Complete Order' }).click({timeout: 10000});
                console.log('[INFO] Complete Order clicked. Waiting for order confirmation...');

                await page.waitForLoadState('load');
                await page.waitForURL('**\/Order-Confirm');
                console.log('[SUCCESS] Order placement completed. Order confirmation validated.');
            }

            console.log('--------Extract Order Details-------------')
            orderDetails = await checkoutPage.getOrderDetails();
            console.log('orderDetails: ' + orderDetails);

            expect(orderDetails).toBeTruthy();
            expect(orderDetails.orderNumber).toBeTruthy();
            console.log('Multi line Pickup order has been placed...');
            orderDetails.email = userEmailaddress;
            const jsonData = JSON.stringify(orderDetails, null, 2);
            console.log('Order Details.. \n' + jsonData);
            return orderDetails;
        }

        if (paymentType == "CreditCard" || paymentType == "CC") {
            if (qaData.paymentDetails.addNewCreditCard) {
                await checkoutPage.addNewCreditCard(qaData.paymentDetails.creditCardDetails.visa);
                await page.waitForLoadState('domcontentloaded');
                console.log('[INFO] Added new Credit Card ');
            } else {
                await page.waitForLoadState('domcontentloaded');
                await page.waitForTimeout(3000);
                if (qaData.eGiftCardDetails) {
                    await checkoutPage.addNewBillingAddress(qaData.shippingDetails.address);
                }
                await checkoutPage.cardPayment(qaData.paymentDetails.creditCardDetails.visa);
                await page.waitForLoadState('domcontentloaded');
                console.log('[INFO] Entered CVV..');
            }
        }

        if (paymentType == "GiftCard") {
            await newCheckoutPage.giftCardPayment(qaData.paymentDetails.GfCardNo, qaData.paymentDetails.GfCardPin);
        }
    }

    console.log('\n\n--------- Review and complete Order ---------\n');
    {
        await page.waitForURL('**/*#payment');
        await expect(page.url()).toContain('payment');
        await page.getByRole('button', { name: 'Continue to review order' }).click({timeout: 10000});
        console.log('[INFO] Continue to review order clicked. Validating placement order page...');

        await page.waitForURL('**/*#placeOrder');
        await expect(page.url()).toContain('placeOrder');
        await page.getByRole('button', { name: 'Complete Order' }).click({timeout: 10000});
        console.log('[INFO] Complete Order clicked. Waiting for order confirmation...');
        await page.waitForLoadState('load');
        await page.waitForTimeout(3000);
        const orderErrorMsg = await page.locator('//span[@class="error-message-text"]//parent::div[@style="display: block;"]');
        if (await orderErrorMsg.isVisible({ timeout: 5000 })) {
            console.log('[INFO] Retry error is displayed while placing order.. RETRYING..');
            await page.getByRole('button', { name: 'Complete Order' }).click({timeout: 10000});
            console.log('[INFO] Complete Order clicked. Waiting for order confirmation...');
        }
        // await page.waitForTimeout(7000);
        await page.waitForLoadState('domcontentloaded');
        await page.locator('div.order-confirmation-container').waitFor({ state: 'visible', timeout: 30000 });
        console.log('[SUCCESS] Order placement completed. Order confirmation validated.');
    }

    console.log('\n\n--------- Extract Order Details ---------\n')
    orderDetails = await checkoutPage.getOrderDetails();

    expect(orderDetails).toBeTruthy();
    expect(orderDetails.orderNumber).toBeTruthy();
    orderDetails.email = userEmailaddress;
    console.log('Multi line Pickup order has been placed...');
    const jsonData = JSON.stringify(orderDetails, null, 2);
    console.log('Order Details.. \n' + jsonData);
    console.log('\n\n******************** Order Data has been created 🚛 ✅ ********************\n\n');
    return orderDetails;
}


// *************** TEST RAIL INTEGRATION ***************************** 

class TestRail {
    constructor() {
        this.username = TESTRAIL_USERNAME;
        this.apiKey = TESTRAIL_API_KEY;
        this.baseUrl = TESTRAIL_URL;
        this.runId = process.env.TEST_APP == 'oms' ? OMS_TEST_RUN_ID : SFCC_TEST_RUN_ID;
        this.AzurePipeline = CI;
    }

    // Add result to a specific test case in the test run
    async addResult(testCaseId, statusId, comment = '') {
        const url = `${this.baseUrl}index.php?/api/v2/add_result_for_case/${this.runId}/${testCaseId}`;
        const data = {
            status_id: statusId,
            comment: comment,
        };

        try {
            const response = await axios.post(url, data, {
                auth: {
                    username: this.username,
                    password: this.apiKey,
                },
            });
            console.log(`Result added for test case ${testCaseId}:`, response.data);
            return response.data; // Return result for potential attachment
        } catch (error) {
            console.error(`Error adding result for test case ${testCaseId}:`, error.message, '\n', error);
        }
    }

    // Upload screenshot as attachment to a test result
    async uploadAttachment(resultId, filePath) {
        console.log('uploading the attachment..')
        const url = `${this.baseUrl}index.php?/api/v2/add_attachment_to_result/${resultId}`;
        const form = new FormData();
        if (!fs.existsSync(filePath)) {
            console.error(`File not found: ${filePath}`);
            return;
        }
        form.append('attachment', fs.createReadStream(filePath));

        try {
            const response = await axios.post(url, form, {
                headers: {
                    ...form.getHeaders(),
                },
                auth: {
                    username: this.username,
                    password: this.apiKey,
                },
            });
            console.log(`Attachment uploaded:`, response.data);
        } catch (error) {
            console.error(`Error uploading attachment:`, error.message, '\n', error);
        }
    }

    /**
 * Get list of matching Test IDs
 */
    async getTestCaseName(testname) {
        const testCaseIdRegex = /\bC(\d+)\b/g
        const testCaseMatches = [testname.match(testCaseIdRegex)]

        if (testCaseMatches[0] != null) {
            testCaseMatches[0].forEach((testCaseMatch) => {
                const testCaseId = parseInt(testCaseMatch.substring(1), 10)
                console.log("Matched Test Case ID: " + testCaseId)
            })
        }
        else {
            console.log("No test case matches available")
        }
        return testCaseMatches[0]
    }

    async updateTestRail(testInfo, screenshotPath, orderNumber = 'Order not placed..') {
        if (this.AzurePipeline) {
            const testCaseMatches = await this.getTestCaseName(testInfo.title);
            for (let testCaseMatch of testCaseMatches) {
                let testCaseId = parseInt(testCaseMatch.substring(1), 10);
                console.log(`Test case status of ${testCaseId} - `+ testInfo.status);
                let statusCode = StatusMap.get(testInfo.status);
                let comment = '';
                if (statusCode == 1) {
                    comment = '**Automation Run:** Test passed successfully. \n**OrderNumber:** ' + orderNumber;
                } else if(statusCode == 4) {
                    comment = '**Automation Run:** Test Skipped. \n**OrderNumber:** ' + orderNumber + `\n**Failed Trace:** \n${testInfo.error ? testInfo.error.message + '\n\n' + testInfo.error.stack : 'Unknown error'}`;
                } else {
                    statusCode = 5;
                    comment = '**Automation Run:** Test Failed. \n**OrderNumber:** ' + orderNumber + `\n**Failed Trace:** \n${testInfo.error ? testInfo.error.message + '\n\n' + testInfo.error.stack : 'Unknown error'}`;
                }

                // Post the result to TestRail
                console.log('TestCase: '+testCaseId);
                console.log('TestCase status: '+ statusCode);
                
                const result = await this.addResult(testCaseId, statusCode, comment);

                // Upload the screenshot to TestRail if the result was successfully added
                if (result && result.id && screenshotPath) {
                    await this.uploadAttachment(result.id, screenshotPath);
                }
            }

        }
    }

}
const testRail = new TestRail();
// *******************************************************************

module.exports = {
    writeDataToFile,
    createBundleOrder,
    createSTH_Order,
    createPickUpOrder,
    createSTH_And_BOPIS_Order,
    createMultiLineOrder,
    createMultiQuantityPickUpOrder,
    scheduleAndReleaseOrder_OrderHub,
    completeStoreAndCustomerPick_StoreHub,
    validateOrderShortPick,
    launchBrowserWithProxy,
    createOrderCart,
    selectDeliveryMethod,
    emptyCart,
    updateProductQuantityOnPDP,
    validateQuantityonCheckout,
    createMultiLineOrderWithAlternatePerson,
    createSurchargeOrderWithFreeShipping,
    handlePayPalPayment,
    CloseModalAndLogin,
    selectStore,
    returnRandomEmail,
    createOrder,
    createOrderData,
    sleep,
    fetchAndRemoveEmail,
    testRail,
};
