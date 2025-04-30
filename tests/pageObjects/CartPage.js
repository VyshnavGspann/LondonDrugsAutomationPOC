const { expect } = require("playwright/test");
const util = require('../utils/LDutil');

class CartPage {
    constructor(page) {
        this.page = page;
        this.searchFirstProduct = page.locator("(//a[@class='product-card-image flex flex-col items-center justify-center'])[1]");
        this.searchFirstProductTitle = page.locator("(//h3[@class='product-name my-2 text-sm leading-7 text-txtprimary md:text-base '])[1]");
        this.productTitle = page.locator("h1[class='text-txtprimary md:text-3xl']");
        this.productPriceLocator = page.locator("p[class='text-2xl text-txtprimary']");
        this.cartProductPriceLocator = page.locator("//section[@class='flex-col justify-between']//p[2]");
        this.addtoCartButton = page.locator("//span[text()='ADD TO CART']");
        this.viewCartCheckout = page.locator("//button[text()='View Cart & Checkout']");
        this.checkoutButton = page.locator("//button[text()='Checkout']");
        this.searchProductName = "";
        this.productPrice = "";
        this.inStorePickupRadioButtonLocator = page.locator("input[value='InStorePickup']");
        this.enterPostalCodeFieldLocator = page.locator("(//input[@placeholder=' Enter a Postal Code or City*'])[1]");
        this.searchStoreButtonLocator = page.locator("//button[@class = 'primary-button w-full px-6 py-3 text-sm']");
        this.setStoreButtonLocator = page.locator("(//button[@class = 'primary-button my-2 w-full px-6 py-3 '])[1]");
        this.doordashRadioButtonLocator = page.locator("//p[.='Add Address']");
        this.delAddress = page.locator("input[name='addressLine1']");
        this.delCity = page.locator("input[placeholder='City']");
        this.delPostalCode = page.locator("input[placeholder='Postal Code']");
        this.checkAddressButton = page.locator("button[data-label='check address']");
        this.editButton = page.locator("button[data-label='edit']");
        this.productHeading = page.locator('h1.text-txtprimary');
        this.productCost = page.locator('span.value').first();
        this.productQtyIncreamentor = this.page.locator("button[data-label='quantity increase']").first();
        this.productAddtoCart = page.locator("//button[@title='Add To Cart']").first();
        this.clickWithRetry = util.clickWithRetry;
        this.overlayCrossIconLocator = page.locator("button[data-label='overlay:close']");
        this.cartLocator = page.locator("(//button[@aria-label='Show Mini Cart Items'])[1]");
        this.addToCartButton = page.locator("//span[text()='ADD TO CART']");
        this.addAdrressLink = page.locator("(//p[normalize-space()='Add Address'])[1]");
        this.doordashDeliveryOption = page.locator("//p[normalize-space()='Same Day Delivery']/ancestor::label[@class='label flex cursor-pointer justify-start md:items-center']");
    }

    async saveProductNameAndGoToProductPage() {
        await this.page.waitForLoadState('load');
        await this.page.waitForTimeout(10000);
        this.searchProductName = await this.searchFirstProductTitle.innerText();
        await this.searchFirstProduct.click();
    }

    async VerifyProductDetails() {
        await this.productTitle.isVisible();
        console.log("Product Title is visible");
        await this.productPriceLocator.isVisible();
        console.log("Product Price is visible");
        await this.productQtyIncreamentor.isVisible();
        console.log("Product Qty incrementor is visible");
        await this.productAddtoCart.isVisible();
        console.log("Add to Cart button is visible");

    }

    async validateProductTitle() {
        const currentProductTitle = await this.productTitle.innerText();
        expect(this.searchProductName).toBe(currentProductTitle);
        console.log("Selected Product : " + currentProductTitle);
    }

    async saveProductPrice() {
        await this.page.waitForSelector("p[class='text-2xl text-txtprimary']");
        this.productPrice = await this.productPriceLocator.innerText();
        console.log("Product price is: " + this.productPrice);
    }

    async selectInStorePickUpRadioButton() {
        await this.inStorePickupRadioButtonLocator.click();
    }

    async enterPostalCode() {
        await this.enterPostalCodeFieldLocator.fill("T2H 2V2");
    }

    async enterPostalCodeForShipToStore() {
        await this.enterPostalCodeFieldLocator.fill("V6Z 1E4");
    }

    async clickOnSearchPostalButton() {
        await this.searchStoreButtonLocator.click();
    }

    async clickOnSetStoreButton() {
        await this.setStoreButtonLocator.click();
    }

    async addProductToCart() {
        await this.page.waitForSelector("//span[text()='ADD TO CART']");
        await expect(this.addtoCartButton).toBeEnabled();
        await this.addtoCartButton.click();
        console.log("Product has been added to cart successfully");
    }

    async validateMiniCartIsDisplayed() {
        const text = await this.page.locator('.pr-3').textContent();
        await expect(text).toContain('Added to Cart');
        console.log("Mini cart displayed")
    }

    async validateProductPriceInCart() {
        const cartProductPrice = await this.cartProductPriceLocator.innerText();
        console.log("Subtotal price is : " + cartProductPrice);
        expect(this.productPrice).toBe(cartProductPrice);
        console.log("Product cart price and subtotal price is matching");
    }


    // Proceed to checkout
    async proceedToCheckout() {
        await this.page.waitForSelector("//button[text()='View Cart & Checkout']");
        await expect(this.viewCartCheckout).toBeEnabled();
        await this.viewCartCheckout.click();
        console.log("View and checkout cart successfully");
        await this.page.waitForSelector("//button[text()='Checkout']"); // Wait for the checkout button
        await expect(this.checkoutButton).toBeEnabled();
        await this.checkoutButton.click();
        console.log("Product checkout successfully");
    }


    async viewAndCheckoutButtonForDoorDash() {
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForLoadState('load');
        await this.page.waitForTimeout(4000);
        await this.viewCartCheckout.click();
        console.log("View and checkout cart successfully");
    }

    async clickDoorDashRadioButton() {
        await this.page.waitForLoadState('load');
        await this.page.waitForTimeout(5000);
        await this.doordashRadioButtonLocator.click({ timeout: 30000 });
        await this.page.waitForTimeout(5000);
        console.log("Door Dash option selected");
    }

    async clickOnEditLink() {
        await this.page.waitForLoadState();
        await this.editButton.click({ timeout: 10000 });
        console.log("Edit link clicked");
        await this.page.waitForSelector("button[data-label='check address']");
        await expect(this.checkAddressButton).toBeEnabled();
        await this.checkAddressButton.click();
        console.log("check address button clicked");
    }

    async enterDoorDashDayDeliveryAddress(shippingData = {}) {
        // await this.page.waitForTimeout(10000);    
        await this.delAddress.fill(shippingData.address1);
        await this.delCity.fill(shippingData.city);
        await this.delPostalCode.fill(shippingData.postalCode);
        await this.page.locator("select[name='state']").selectOption({ label: 'Manitoba' });
        // await this.page.waitForSelector("button[data-label='check address']");
        console.log("Address saved successfully");
    }

    async clickCheckAddressButton() {
        await this.page.waitForTimeout(5000);
        await this.checkAddressButton.click();
        console.log("check address button clicked");
        await this.page.waitForTimeout(20000);
    }

    async clickCheckoutButtonForDoorDash(locator, retries = 2) {
        // await this.page.waitForLoadState('domcontentloaded');
        // await this.page.waitForLoadState('networkidle');
        // await this.page.waitForTimeout(10000); 
        //   await this.page.waitForSelector("//button[text()='Checkout']"); // Wait for the checkout button
        // await expect(this.checkoutButton).toBeEnabled();
        await this.clickWithRetry(this.checkoutButton, this.page, 2);
        console.log("Product checkout successfully");
        await this.page.waitForTimeout(10000);
        await this.page.waitForLoadState('domcontentloaded');
    }

    async clickOnOverlayCrossIcon() {
        await this.page.waitForTimeout(5000);
        await this.overlayCrossIconLocator.click();
    }

    async navigateBackOnPreviousPage() {
        await page.evaluate(() => {
            history.back();
        });
    }

    async clickOnCartButton() {
        // await this.page.waitForTimeout(20000);
        await this.cartLocator.click();
        await this.page.waitForTimeout(10000);
    }

    async clickAddAddressLink() {
        await this.addAdrressLink.click();
        await this.page.waitForTimeout(5000);
        await this.page.waitForLoadState('domcontentloaded');
    }

    async selectDoordashDeliveryForAllProducts() {
        await this.page.reload();
        await this.page.waitForLoadState('domcontentloaded');
        // await this.page.waitForLoadState('networkidle');
        await this.doordashDeliveryOption.nth(1).click({ force: true });
        console.log("Door dash is clicked for 2nd option");
        // await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(20000);
        await this.doordashDeliveryOption.nth(2).click({ force: true });
        await this.page.waitForTimeout(30000);
        console.log("Door dash is clicked for 3rd option");
        await this.page.reload();
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(10000);
    }
}

module.exports = { CartPage };