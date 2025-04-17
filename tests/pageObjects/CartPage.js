const { expect } = require("playwright/test");

class CartPage {
    constructor(page) {
        this.page = page;
        this.searchFirstProduct = page.locator("(//a[@class='product-card-image flex flex-col items-center justify-center'])[1]");
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

module.exports = { CartPage };