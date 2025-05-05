const { expect, chromium } = require('@playwright/test');
const util = require('../utils/LDutil');

class CheckoutPage {
    constructor(page) {
        this.page = page;
        this.userEmail = page.locator("//input[@placeholder='abc@gmail.com']");
        this.userFirstName = page.locator("//input[@placeholder='Enter your first name']");
        this.userLaststName = page.locator("//input[@placeholder='Enter your last name']");
        this.userAddress1 = page.locator("(//input[@placeholder='Enter your street address'])[1]");
        this.userAddress2 = page.locator("(//input[@placeholder='Enter your street address'])[2]");
        this.userCity = page.locator("//input[@placeholder='City']");
        this.userZipcode = page.locator("//input[@placeholder='Zip Code']");
        this.userPhoneNumber = page.locator("//input[@placeholder='Enter your Phone number']");
        this.useThisAddressButton = page.locator("//button[text()='Use this Address']");
        this.popUpuseThisAddressButton = page.locator("(//button[@type='submit' and @value='Use this Address' and text()='Use this Address'])[2]");
        this.proceedToBillingButton = page.locator("//button[text()='Proceed to Billing']");
        this.placeYourOrderButton = page.locator("//button[text()='Place your Order']");
        this.reviewYourOrder = page.locator("//button[text()='Review your Order']");
        this.enterYourNameCard = page.locator("//input[@placeholder='Enter your Name on Card']");
        this.enterCardNumber = page.locator("//input[@placeholder='Enter your Card Number']");
        this.enterCVV = page.locator("//input[contains(@style, 'background-image: url') and @name='cvv']");
        this.TermsCondCheckBox = page.locator("//input[@type='checkbox' and @id='accept']");
        this.postalCode = page.locator("//input[@placeholder= 'Postal Code']");
        this.clickWithRetry = util.clickWithRetry;
        // this.cardTypeLocator = page.locator("//select[@name = 'cardType']");
    }

    async fillUserInformation({ email, firstName, lastName, address1, address2, city, zipcode, phone }) {
        await this.userEmail.fill(email);
        await this.userFirstName.fill(firstName);
        await this.userLaststName.fill(lastName);
        await this.userAddress1.fill(address1);
        await this.userAddress2.fill(address2);
        await this.userCity.fill(city);
        await this.userZipcode.fill(zipcode);
        await this.userPhoneNumber.fill(phone);
        await this.useThisAddressButton.click();
        await this.popUpuseThisAddressButton.click();

    }
    async proceedToBilling() {
        await this.proceedToBillingButton.click();
        console.log("Proceed to Billing button clicked");
        // await this.page.waitForSelector(this.placeYourOrder); // Wait for Place your Order button
        await this.page.waitForTimeout(10000);
        await this.page.waitForLoadState('domcontentloaded');

    }

    // async proceedToBillingForBulkOrders() {

    //     await this.clickWithRetry(this.proceedToBillingButton, this.page, 3);
    //     console.log("Product checkout successfully");
    //     await this.page.waitForTimeout(10000);
    //     await this.page.waitForLoadState('domcontentloaded');

    // }

    async proceedToBillingForBulkOrders() {
        const maxRetries = 3;
        const retryDelay = 3000; // 3 seconds
        let clicked = false;

        try {
            for (let attempt = 1; attempt <= maxRetries; attempt++) {
                try {
                    console.log(`Attempt ${attempt}: Clicking 'Proceed to Billing' button`);
                    await this.page.waitForSelector("//button[text()='Proceed to Billing']", { state: 'visible', timeout: 10000 });
                    await this.page.click("//button[text()='Proceed to Billing']", { force: true });
                    clicked = true;
                    console.log("Button clicked successfully");
                    break;
                } catch (err) {
                    console.warn(`Attempt ${attempt} failed: ${err.message}`);
                    if (attempt < maxRetries) {
                        console.log(`Waiting ${retryDelay / 1000}s before retry...`);
                        await this.page.waitForTimeout(retryDelay);
                    }
                }
            }

            if (!clicked) {
                throw new Error("Failed to click the 'Proceed to Billing' button after multiple attempts.");
            }

            if (!this.page.isClosed()) {
                console.log("Waiting after clicking...");
                await this.page.waitForTimeout(10000);

                console.log("Waiting for DOM content to load...");
                await this.page.waitForLoadState('domcontentloaded');

                console.log("Proceeded to billing successfully");
            } else {
                console.warn("Page is already closed. Skipping post-click waits.");
            }

        } catch (error) {
            console.error("Error in proceedToBillingForBulOrders:", error);
            throw error;
        }
    }


    // Fill payment details
    async fillPaymentDetails({ nameOnCard, cardNumber, cvv }) {
        await this.enterYourNameCard.fill(nameOnCard);
        await this.enterCardNumber.fill(cardNumber);
        await this.enterCVV.fill(cvv);
        await this.reviewYourOrder.click();
    }

    async placeyourOrder() {
        await this.TermsCondCheckBox.click();
        await this.page.waitForTimeout(4000);
        await this.placeYourOrderButton.click();
        console.log("Place your order button clicked");
        // expect(this.page.getByText('Thank you for your order'), 'thanks message is not visible').toBeVisible({timeout: 10000});
        // await this.page.waitForSelector(this.placeYourOrder); // Wait for Place your Order button
        await this.page.waitForTimeout(10000);
        await this.page.waitForLoadState('domcontentloaded');
    }

    async placeyourOrderForBulkOrder() {
        await this.TermsCondCheckBox.click();
        //await this.page.waitForTimeout(4000);
        await this.clickWithRetry(this.placeYourOrderButton, this.page, 3);
        console.log("Place your order button clicked");
        await this.page.waitForTimeout(10000);
        await this.page.waitForLoadState('domcontentloaded');
    }

    async enterCreditCardDetails(paymentData = {}) {
        await this.page.waitForTimeout(2000);
        await this.enterYourNameCard.fill(paymentData.nameOnCard);
        await this.page.waitForTimeout(1000);
        await this.enterCardNumber.fill(paymentData.cardNumber);
        await this.page.waitForTimeout(1000);
        await this.enterCVV.fill(paymentData.cvv);
        console.log('------credit card details entered --------')
    }

    async cardPayment(paymentData = {}) {
        await this.page.waitForTimeout(2000);
        await this.enterCreditCardDetails(paymentData);
        await this.page.waitForTimeout(7000);
        await this.reviewYourOrder.click();
        console.log("Review order button clicked");
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(10000);

    }

    async addShippingAddress(shippingData = {}) {
        // await this.page.waitForLoadState('domcontentloaded');
        await this.userEmail.fill(shippingData.email);
        await this.userFirstName.fill(shippingData.firstName);
        await this.userLaststName.fill(shippingData.lastName);
        await this.userAddress1.fill(shippingData.address1);
        await this.userAddress2.fill(shippingData.address2);
        await this.userCity.fill(shippingData.city);
        await this.userZipcode.fill(shippingData.zipcode);
        await this.userPhoneNumber.fill(shippingData.phone);
        await this.page.waitForTimeout(5000);
        await this.useThisAddressButton.click();
        await this.page.waitForTimeout(10000);
        // await this.popUpuseThisAddressButton.click();
        // await this.page.waitForTimeout(10000);
        console.log("Shipping address added successfully and use address button clicked");
        await this.page.waitForLoadState('domcontentloaded');
    }

    async addShippingAddressForExistingUser(shippingData = {}) {
        await this.userFirstName.fill(shippingData.firstName);
        await this.userLaststName.fill(shippingData.lastName);
        await this.userPhoneNumber.fill(shippingData.phone);
        await this.page.waitForTimeout(5000);
        await this.useThisAddressButton.click();
        await this.page.waitForTimeout(2000);
        // await this.popUpuseThisAddressButton.click();
        // await this.page.waitForTimeout(8000);
        console.log("Shipping address added successfully and Use Address button clicked");
        await this.page.waitForTimeout(10000);
        await this.page.waitForLoadState('domcontentloaded');
    }

    async addShippingAddressloggedUser(shippingData = {}) {
        await this.page.waitForTimeout(3000);
        await this.useThisAddressButton.click();
        await this.popUpuseThisAddressButton.click();
    }

    async enterEmail() {
        await this.page.waitForTimeout(10000);
        await this.userEmail.fill("testimmediatelondon1@yopmail.com");
        console.log("Entered email address: testimmediatelondon1@yopmail.com")
    }

    async addShippingAddressforInStorePickup(shippingData = {}) {
        await this.page.waitForTimeout(3000);
        await this.userFirstName.fill(shippingData.firstName);
        await this.userLaststName.fill(shippingData.lastName);
        await this.userPhoneNumber.fill(shippingData.phone);
        await this.userAddress1.fill(shippingData.address1);
        await this.postalCode.fill(shippingData.postalCode)
        await this.userCity.fill(shippingData.city);
    }

    async selectCardType() {
        await this.page.locator("//select[@name = 'cardType']").selectOption({ label: 'MasterCard' });
        console.log("Selected card type is : Master Card");
    }

    async selectCardTypeForBulkOrders() {
        await this.page.waitForTimeout(3000);
        await this.page.locator("//select[@name = 'cardType']").selectOption({ label: 'MasterCard' });
        console.log("Selected card type is : Master Card");
    }
}

module.exports = { CheckoutPage };