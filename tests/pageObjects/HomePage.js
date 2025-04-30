// pageObjects/HomePage.js
const { expect } = require('@playwright/test');
const qaTestData = require('../testData/sfcc/uatTestData');
const uatTestData = require('../testData/sfcc/uatTestData');

class HomePage {
    constructor(page) {
        this.page = page;
        this.signInButton = page.locator('a[data-label="overlay:sign in"]');
        this.createAccount = page.locator('a[data-label="overlay:create an account"]')
        // Locator for the Profile Icon
        this.profileIcon = page.locator("(//*[@class='size-5 cursor-pointer text-base text-txtheader-primary focus:outline-none'])[1]");
        this.searchBox = page.locator("(//input[@placeholder='Find your product'])[1]");
        this.searchIcon = page.locator("(//*[@stroke='currentColor' and @fill='currentColor'])[1]");
        this.searchResultProduct = page.locator("(//a[@class='product-card-image flex flex-col items-center justify-center'])[1]");
        this.addToCartButton = page.locator("//span[text()='ADD TO CART']");
    }

    async goTo() {
        await this.page.goto(uatTestData.baseUrl);
    }

    async searchForProduct(productName) {
        await this.searchBox.fill(productName);
        await this.searchIcon.click();
    }

    async searchForProduct1(productName) {
        await this.page.waitForTimeout(10000);
        await this.searchBox.fill(productName);
        await this.searchIcon.click();
    }

    async navigateToLoginPage() {
        try {
            await this.page.waitForLoadState('domcontentloaded');
            await this.page.locator("aside[class='hidden flex-row items-center justify-between md:flex md:gap-2 lg:gap-x-12'] aside[class='relative px-2'] svg").click();
            console.error("Sign in button clicked");
            await this.page.waitForTimeout(10000);
        } catch (error) {
            console.error("First clicked failed.....retrying");
        }
        await this.page.waitForLoadState('domcontentloaded');
        await this.signInButton.click();
        await this.page.waitForTimeout(10000);
    }

    async navigateCreatePage() {
        await this.page.locator('header aside.items-center svg[role="button"]').first().click({ timeout: 10000 });
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(10000);
        await this.createAccount.click();
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(20000);
    }

    async searchAndAddProductsToCart(productIds = []) {
        for (const productId of productIds) {
            // Search Product
            await this.searchBox.waitFor({ state: 'visible', timeout: 10000 });
            await this.page.waitForTimeout(8000);
            await this.searchBox.fill(productId);
            // await this.page.waitForLoadState('domcontentloaded');
            // await this.page.waitForLoadState('load');
            await this.page.waitForTimeout(3000);
            await this.searchIcon.click();
            await this.page.waitForTimeout(8000);
            await this.page.waitForLoadState('domcontentloaded');

            // Wait for Product in Search Results
            await this.searchResultProduct.first().waitFor({ state: 'visible' });

            console.log(`Searched for Product ID: ${productId}`);
            // await this.page.waitForLoadState('load');
            await this.page.waitForTimeout(3000);
            // Click on the First Product in the Search Results
            await this.searchResultProduct.first().click();
            await this.page.waitForTimeout(8000);

            // Wait for Product Details Page
            await this.page.waitForLoadState('domcontentloaded');
            await this.addToCartButton.waitFor({ state: 'visible' });
            await this.page.waitForTimeout(3000);

            // Click Add to Cart
            await this.addToCartButton.click();
            await this.page.waitForTimeout(8000);
            console.log(`Added Product ID: ${productId} to Cart`);
            await this.page.goto(uatTestData.baseUrl);
            await this.page.waitForLoadState('domcontentloaded');
        }
    }
}


module.exports = { HomePage };