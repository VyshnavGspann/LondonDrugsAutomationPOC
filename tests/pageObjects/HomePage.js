// pageObjects/HomePage.js
const { expect } = require('@playwright/test');
const qaTestData = require('../testData/sfcc/uatTestData');

class HomePage {
    constructor(page) {
        this.page = page;
        this.signInButton = page.locator('a[data-label="overlay:sign in"]');
        // Locator for the Profile Icon
        this.profileIcon = page.locator("(//*[@class='size-5 cursor-pointer text-base text-txtheader-primary focus:outline-none'])[1]");
        this.searchBox = page.locator("(//input[@placeholder='Find your product'])[1]");
        this.searchIcon = page.locator("(//*[@stroke='currentColor' and @fill='currentColor'])[1]");
    }

    async goTo() {
        // await this.page.goto('https://london-drugs-uat-origin.kibology.us/products/maybelline-volumexpress-the-colossal-mascara/p/M0000453?Variant%20Color=GLAM_BLACK/');  // Correct URL
        await this.page.goto('https://london-drugs-uat-origin.kibology.us/');  // Correct URL
    }
    async searchForProduct(productName) {
        // await this.page.waitForSelector("//input[@placeholder='Find your product']", { state: 'visible', timeout: 60000 });
        // await this.page.waitForTimeout(300000);
        // await this.page.waitForTimeout(10000);
        await this.searchBox.fill(productName);
        await this.searchIcon.click();
        // await this.page.waitForSelector(this.searchFirstProduct); // Wait for the first product to appear
    }

    async navigateToLoginPage() {
        await this.page.locator('header aside.items-center svg[role="button"]').first().click({ timeout: 10000 });
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(1000);
        await this.signInButton.click();
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(3000);
    }
    

}


module.exports = { HomePage };