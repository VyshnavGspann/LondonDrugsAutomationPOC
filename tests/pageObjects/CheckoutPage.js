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
        this.TermsCondCheckBox = page.locator("//input[@type='checkbox' and @id='accept']")
      
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
    async submitOrder() {
        await this.proceedToBillingButton.click();
        // await this.page.waitForSelector(this.placeYourOrder); // Wait for Place your Order button
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
        await this.placeYourOrder.click();
        // expect(this.page.getByText('Thank you for your order'), 'thanks message is not visible').toBeVisible({timeout: 10000});
        // await this.page.waitForSelector(this.placeYourOrder); // Wait for Place your Order button
    }
}

    module.exports = { CheckoutPage };