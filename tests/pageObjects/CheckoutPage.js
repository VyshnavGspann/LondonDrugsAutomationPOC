const { expect, chromium } = require('@playwright/test');

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
        this.placeYourOrder = page.locator("//button[text()='Place your Order']");
        this.reviewYourOrder = page.locator("//button[text()='Review your Order']");
        this.enterYourNameCard = page.locator("//input[@placeholder='Enter your Name on Card']");
        this.enterCardNumber = page.locator("//input[@placeholder='Enter your Card Number']");
        this.enterCVV = page.locator("//input[contains(@style, 'background-image: url') and @name='cvv']");
        this.TermsCondCheckBox = page.locator("//input[@type='checkbox' and @id='accept']");
        this.postalCode = page.locator("//input[@placeholder= 'Postal Code']");
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

    // Fill payment details
    async fillPaymentDetails({ nameOnCard, cardNumber, cvv }) {
        await this.enterYourNameCard.fill(nameOnCard);
        await this.enterCardNumber.fill(cardNumber);
        await this.enterCVV.fill(cvv);
        await this.reviewYourOrder.click();
    }

    async placeyourOrder() {
        await this.TermsCondCheckBox.click();
        await this.page.waitForTimeout(2000);
        await this.placeYourOrder.click();
        console.log("Place your order button clicked");
        // expect(this.page.getByText('Thank you for your order'), 'thanks message is not visible').toBeVisible({timeout: 10000});
        // await this.page.waitForSelector(this.placeYourOrder); // Wait for Place your Order button
        await this.page.waitForTimeout(10000);
        await this.page.waitForLoadState('domcontentloaded');
    }

    async enterCreditCardDetails(paymentData = {}) {
        await this.page.waitForTimeout(2000);
        await this.enterYourNameCard.fill(paymentData.nameOnCard);
        await this.enterCardNumber.fill(paymentData.cardNumber);
        await this.enterCVV.fill(paymentData.cvv);
        console.log('------credit card details entered --------')
    }

    async cardPayment(paymentData = {}) {
        await this.page.waitForTimeout(2000);
        await this.enterCreditCardDetails(paymentData);
        await this.page.waitForTimeout(4000);
        await this.reviewYourOrder.click();
        console.log("Review order button clicked");
        await this.page.waitForTimeout(10000);
        await this.page.waitForLoadState('domcontentloaded');
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
        await this.page.waitForTimeout(2000);
        await this.useThisAddressButton.click();
        await this.page.waitForTimeout(8000);
        // await this.popUpuseThisAddressButton.click();
        // await this.page.waitForTimeout(10000);
        console.log("Shipping address added successfully and use address button clicked");
        await this.page.waitForLoadState('domcontentloaded');
    }

    async addShippingAddressForExistingUser(shippingData = {}) {
        await this.page.waitForTimeout(8000);
        await this.userFirstName.fill(shippingData.firstName);
        await this.userLaststName.fill(shippingData.lastName);
        await this.userPhoneNumber.fill(shippingData.phone);
        await this.page.waitForTimeout(8000);
        await this.useThisAddressButton.click();
        await this.page.waitForTimeout(5000);
        // await this.popUpuseThisAddressButton.click();
        // await this.page.waitForTimeout(8000);
        console.log("Use Address button clicked");
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
}

module.exports = { CheckoutPage };