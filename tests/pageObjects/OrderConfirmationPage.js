const { expect } = require("playwright/test");

class OrderConfirmationPage {
    constructor(page) {
        this.page = page;
        this.thanksMessage = page.locator("//h1[normalize-space()='Thank you for your order']").allTextContents();
    }

    async verifythanksMessageAppears() {
        await expect(this.thanksMessage).toContainText('Thank you for your order');
    }

    // Proceed to checkout
    async proceedToCheckout() {
        await this.viewCartCheckout.click();
        // await this.page.waitForSelector(this.checkoutButton); // Wait for the checkout button
        await this.checkoutButton.click();
    }
    
}

module.exports = { OrderConfirmationPage };