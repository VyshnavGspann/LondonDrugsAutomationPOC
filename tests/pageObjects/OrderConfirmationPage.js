const { expect } = require("playwright/test");

class OrderConfirmationPage {
    constructor(page) {
        this.page = page;
        this.thanksMessage = page.locator("//h1[normalize-space()='Thank you for your order']")
        // this.message = this.thanksMessage.textContent();
    }

    async verifythanksMessageAppears() {
        await this.page.waitForTimeout(30000);
        await expect(this.page.getByText('Thank you for your order'), 'Thank you for your order is not visible').toBeVisible({timeout: 10000});
    }

    // Proceed to checkout
    async proceedToCheckout() {
        await this.viewCartCheckout.click();
        await this.checkoutButton.click();
    }

    async getOrderNumber() {
        let orderNumber = await this.page.locator('//span[@class="text-primary" and starts-with(text(), "#")]').innerText({timeout: 10000});
        orderNumber = orderNumber.trim().replace('#', '');
        console.log('OrderNumber: '+orderNumber);
        return orderNumber
    }
    
}

module.exports = { OrderConfirmationPage };