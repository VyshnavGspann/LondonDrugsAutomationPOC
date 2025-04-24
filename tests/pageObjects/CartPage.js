const { expect } = require("playwright/test");

class CartPage {
    constructor(page) {
        this.page = page;
        this.searchFirstProduct = page.locator("(//a[@class='product-card-image flex flex-col items-center justify-center'])[1]");
        this.searchFirstProductTitle = page.locator("(//h3[@class='product-name my-2 text-sm leading-7 text-txtprimary md:text-base'])[1]");
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
        // this.delProvince = page.locator("select[name='state']").first().click();
    }

    async saveProductNameAndGoToProductPage(){
        this.searchProductName = await this.searchFirstProductTitle.innerText();
        await this.searchFirstProduct.click();
    }

    async validateProductTitle(){
        const currentProductTitle = await this.productTitle.innerText();
        expect(this.searchProductName).toBe(currentProductTitle);
        console.log("Selected Product : " +currentProductTitle);
    }

    async saveProductPrice(){
        await this.page.waitForSelector("p[class='text-2xl text-txtprimary']");
        this.productPrice = await this.productPriceLocator.innerText();
        console.log("Product price is: " +this.productPrice);
    }

    async selectInStorePickUpRadioButton(){
        await this.inStorePickupRadioButtonLocator.click();
    }

    async enterPostalCode(){
      await this.enterPostalCodeFieldLocator.fill("T2H 2V2");
    }

    async enterPostalCodeForShipToStore(){
        await this.enterPostalCodeFieldLocator.fill("V6Z 1E4");
      }

    async clickOnSearchPostalButton(){
        await this.searchStoreButtonLocator.click();
      }

    async clickOnSetStoreButton(){
        await this.setStoreButtonLocator.click();
    }

    async addProductToCart() {
        // await this.page.waitForSelector(this.addtoCartButton); // Wait for Add to Cart button to appear
        await this.page.waitForSelector("//span[text()='ADD TO CART']");
        await expect(this.addtoCartButton).toBeEnabled();
        await this.addtoCartButton.click();
        console.log("Product has been added to cart successfully");
       // await this.page.waitForSelector(this.viewCartCheckout); // Ensure the cart page is visible
    }

    async validateProductPriceInCart(){
        const cartProductPrice = await this.cartProductPriceLocator.innerText();
        console.log("Subtotal price is : "+cartProductPrice);
        expect(this.productPrice).toBe(cartProductPrice);
        console.log("Product cart price and subtotal price is matching");
    }


    // Proceed to checkout
    async proceedToCheckout() {
        await this.page.waitForSelector("//button[text()='View Cart & Checkout']");
        await expect(this.viewCartCheckout).toBeEnabled();
        await this.viewCartCheckout.click();
        //  await expect(this.page).toHaveURL('https://expected.url');
        console.log("View and checkout cart successfully");
        await this.page.waitForSelector("//button[text()='Checkout']"); // Wait for the checkout button
        await expect(this.checkoutButton).toBeEnabled();
        await this.checkoutButton.click();
        console.log("Product checkout successfully");
    }

    async clickDoorDashRadioButton(){
        // await this.page.waitForSelector("(//input[@type='radio'])[3]");
       //  await this.page.waitForTimeout(500); 
         await this.page.waitForLoadState('load');
         await this.doordashRadioButtonLocator.click({ timeout: 30000 });
         await this.page.waitForTimeout(5000);  
         console.log("Door Dash option selected");
     }

     async clickOnEditLink(){
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForLoadState();

         await this.editButton.click({ timeout: 30000 });
         console.log("Edit link clicked");
         await this.page.waitForSelector("button[data-label='check address']");
         await expect(this.checkAddressButton).toBeEnabled();
         await this.checkAddressButton.click();
         console.log("check address button clicked");
     }

    async addSameDayDeliveryAddress(shippingData = {}) {
       // await this.page.waitForTimeout(10000);    
        await this.delAddress.fill(shippingData.address1);
        await this.delCity.fill(shippingData.city);
        await this.delPostalCode.fill(shippingData.postalCode);

    }

    async selectProvinceAddress() {
        await this.page.locator("select[name='state']").selectOption({label:'Alberta'});
        await this.page.waitForSelector("button[data-label='check address']"); 
        console.log("Address saved successfully");
        await this.checkAddressButton.click();
        console.log("check address button clicked");
        
    }

    async viewAndCheckoutButtonForDoorDash() {
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForLoadState();
        await this.page.waitForTimeout(4000); 
      //  await this.page.waitForSelector("//button[text()='View Cart & Checkout']");
      //  await expect(this.viewCartCheckout).toBeEnabled();
        await this.viewCartCheckout.click();
        console.log("View and checkout cart successfully");
    }

    async proceedToCheckoutDoorDash() {
     //   await this.page.waitForSelector("//button[text()='Checkout']"); // Wait for the checkout button
       // await expect(this.checkoutButton).toBeEnabled();
        await this.checkoutButton.click({timeout:30000});
        console.log("Product checkout successfully");
    }
}

module.exports = { CartPage };