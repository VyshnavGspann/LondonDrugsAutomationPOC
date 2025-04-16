// pageObjects/SigninPage.js
const { expect } = require('@playwright/test');
// const { error } = require('console');
class SignInPage {

    constructor(page) {

        this.log = (msg) => {console.log('SinginPage - '+msg);};
        this.page = page;

        // Locator for Sign In button in overlay or modal
        this.signInButton = page.locator('a[data-label="overlay:sign in"]');
        
        // Locator for the Profile Icon
        this.profileIcon = page.locator("(//*[@class='size-5 cursor-pointer text-base text-txtheader-primary focus:outline-none'])[1]");
        
        // Locator for the Email input field
        this.emailInput = page.locator('input[name="email"]');
        
        // Locator for the Password input field
        this.passwordInput = page.locator('input[name="password"]');
        
        // Locator for the CAPTCHA checkbox (recaptcha)
        this.captchaCheckbox = page.frameLocator('iframe[title="reCAPTCHA"]').locator('#recaptcha-anchor');
        
        // Locator for the Login button (Submit button)
        this.loginButton = page.locator('button[data-label="login"]');
        
        // Locator for the "Forgot Password" link
        this.forgotPasswordLink = page.locator('a[href="/auth/forgotPassword"]');
        
        // Locator for the "Create London Drugs Account" link
        this.createLDAccountLink = page.locator('a[data-category="login form"][data-action="click"][data-label="create your london drugs account"]');
        
        // Locator for the email input field in the forgot password form
        this.forgotPasswordEmailFormField = page.locator('input.h-12[name="email"]');
        
        // Locator for the Send button (Submit button) in the Forgot Password form
        this.sendButton = page.locator('button[data-category="submit button"][data-action="click"][data-label="send"]');
    }

    async performLogin(email, password) {
        await this.emailInput.fill(email,  {timeout: 10000});
        this.log('Email is filled');
        await this.passwordInput.fill(password,  {timeout: 10000});
        this.log('Password is filled');
        await this.captchaCheckbox.click({timeout: 10000});
        await this.page.evaluate(() => {  document.querySelector('iframe[title="reCAPTCHA"]').remove(); });
        await this.page.waitForTimeout(1000);
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.evaluate(() => {  document.querySelector('textarea.g-recaptcha-response').remove(); });
        await this.page.waitForTimeout(1000);
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.evaluate(() => {  document.querySelector('button[data-label="login"]').removeAttribute('disabled'); });
        await this.page.waitForTimeout(1000);
        await this.page.waitForLoadState('domcontentloaded');
        this.log('Captcha is bypassed.....');
        await this.loginButton.click({force: true, timeout: 10000});
        this.log('Login button is clicked');
        expect(this.page.getByText('Login Successful!'), 'Success Alert is not visible').toBeVisible({timeout: 10000});
        this.log('Login Successful Alert is visible');
        await this.page.waitForTimeout(5000);
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForLoadState('load');
    }

    async clickSignInButton() {
        await this.signInButton.click();
    }
    async fillEmail(email) {
        await this.emailInput.fill(email);
    }
    async fillPassword(password) {
        await this.passwordInput.fill(password);
    }
    async clickLoginButton() {
        await this.loginButton.click();
    }
    async clickForgotPasswordLink() {
        await this.forgotPasswordLink.click();
    }
    async fillForgotPasswordEmail(email) {
        await this.forgotPasswordEmailFormField.fill(email);
    }
    async clickSendButton() {
        await this.sendButton.click();
    }
}

module.exports = { SignInPage };
