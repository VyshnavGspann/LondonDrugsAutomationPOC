const { expect } = require("playwright/test");

class OrderConfirmationPage {
    constructor(page) {
        this.page = page;
        this.thanksMessage = page.locator("//h1[text()='Thank you for your order']");
        this.addtoCartButton = page.locator("//span[text()='ADD TO CART']");
        this.viewCartCheckout = page.locator("//button[text()='View Cart & Checkout']");
        this.checkoutButton = page.locator("//button[text()='Checkout']");
    }

    async addProductToCart() {
        await this.searchFirstProduct.click();
        // await this.page.waitForSelector(this.addtoCartButton); // Wait for Add to Cart button to appear
        await this.addtoCartButton.click();
       // await this.page.waitForSelector(this.viewCartCheckout); // Ensure the cart page is visible
    }

    // Proceed to checkout
    async proceedToCheckout() {
        await this.viewCartCheckout.click();
        // await this.page.waitForSelector(this.checkoutButton); // Wait for the checkout button
        await this.checkoutButton.click();
    }
    
}

module.exports = { OrderConfirmationPage };