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
        
        this.createAccountButton = page.locator('button[data-label="create account"]');
        // Locator for the "Forgot Password" link
        this.forgotPasswordLink = page.locator('a[href="/auth/forgotPassword"]');
        
        // Locator for the "Create London Drugs Account" link
        this.createLDAccountLink = page.locator('a[data-category="login form"][data-action="click"][data-label="create your london drugs account"]');
        
        // Locator for the email input field in the forgot password form
        this.forgotPasswordEmailFormField = page.locator('input.h-12[name="email"]');
        
        // Locator for the Send button (Submit button) in the Forgot Password form
        this.sendButton = page.locator('button[data-category="submit button"][data-action="click"][data-label="send"]');

        this.LDAccountFname = page.locator('//input[@placeholder="First Name"]');

        this.LDAccountLname = page.locator('//input[@placeholder="Last Name"]');

        this.LDAccountEmail = page.locator('//input[@name="email"]');

        this.LDAccountConfEmail = page.locator('//input[@name="confirmEmail"]');

        this.LDAccountPhone = page.locator('//input[@name="phone"]');

        this.LDAccountConfPhone = page.locator('//input[@name="confirmPhone"]');

        this.LDAccountCreatePassword = page.locator('//input[@name="password"]');

        this.LDAccountConfCreatePassword = page.locator('//input[@name="confirmPassword"]');
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

    async performLDCreateAccount() {
        const alphabet = 'abcdefghijklmnopqrstuvwxyz';
        const randomNumber = Math.floor(Math.random() * 10000);
        // Generate a random number between 0 and 9999
        const randomString = Array.from({ length: 7 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('');
        // Generate a random string of length 7
        const firstName = `first${randomString}`;
        const lastName = `last${randomString}`;
        const password = `user${randomString}${randomNumber}`;
        console.log(`Random password is ${password}`)
        const email = `user${randomString}${randomNumber}@yopmail.com`;
        console.log(`Random email is ${email}`)
        const phoneNumber = '1' + Array.from({length: 9}, () => Math.floor(Math.random() * 10)).join('');
        // const memberid = phoneNumber;
        //await this.page.waitForSelector('input#registration-form-fname')
        // await this.firstNameField.waitForElementState('visible');
        await this.LDAccountFname.fill(firstName)
        await this.LDAccountLname.fill(lastName)
        await this.LDAccountEmail.fill(email)
        await this.LDAccountConfEmail.fill(email)
        await this.LDAccountPhone.fill(phoneNumber)
        await this.LDAccountConfPhone.fill(phoneNumber)
        await this.LDAccountCreatePassword.fill(password)
        await this.LDAccountConfCreatePassword.fill(password)
        await this.captchaCheckbox.click({timeout: 10000});
        await this.page.evaluate(() => {  document.querySelector('iframe[title="reCAPTCHA"]').remove(); });
        await this.page.waitForTimeout(1000);
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.evaluate(() => {  document.querySelector('textarea.g-recaptcha-response').remove(); });
        await this.page.waitForTimeout(1000);
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.evaluate(() => {  document.querySelector('button[data-label="create account"]').removeAttribute('disabled'); });
        await this.page.waitForTimeout(1000);
        await this.page.waitForLoadState('domcontentloaded');
        this.log('Captcha is bypassed.....');
        await this.createAccountButton.click({force: true, timeout: 10000});
        this.log('create button is clicked');
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
