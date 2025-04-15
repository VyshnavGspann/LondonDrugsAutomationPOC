/**
 * Extracts the 10-digit ID without dashes from the specified element.
 * @param {Page} page - The Playwright page object.
 * @returns {Promise<string|null>} - The extracted ID without dashes or null if not found.
 */
async function extractIdWithoutDashes(page) {
  try {
    // Locate the element containing the ID
    const element = await page.locator('.rewards-profile-info .text-sm');

    // Extract the text content of the element
    const textContent = await element.textContent();

    // Define a regular expression to match the 10-digit ID pattern (including dashes)
    const idPattern = /\d{3}-\d{3}-\d{4}/;

    // Use the regular expression to find the ID in the text content
    const match = textContent.match(idPattern);

    if (match) {
      // Remove dashes from the matched ID
      const idWithoutDashes = match[0].replace(/-/g, '');

      // Return the extracted ID without dashes
      return idWithoutDashes;
    } else {
      console.error('ID not found in the element text.');
      return null;
    }
  } catch (error) {
    console.error('An error occurred while extracting the ID:', error);
    return null;
  }
}


// Utility function to generate a random email
function generateRandomEmail() {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  const randomNumber = Math.floor(Math.random() * 10000);
  const randomString = Array.from({ length: 7 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('');
  return `user${randomString}${randomNumber}@worldmarket.com`;
}

// The createWMAccount function
async function createWMAccount(createAccount = {}, userEmail = null) {
  await this.closeModal();
  await this.signInButton.click({timeout: 10000});
  await this.accountSignInButton.click({timeout: 10000});
  await this.joinButton.click({timeout: 10000});

  // Use the provided email or generate a random one
  const email = userEmail || generateRandomEmail();
  console.log(`Using email: ${email}`);
  await this.registerEmail.fill(email);
  await this.joinnowButton.click({timeout: 10000});

  await this.firstNameField.fill(createAccount.firstname);
  await this.lastNameField.fill(createAccount.lastname);
  await this.accountCreationPwd.fill(createAccount.password);

  const phoneNumber = '1' + Array.from({ length: 9 }, () => Math.floor(Math.random() * 10)).join('');
  const memberid = phoneNumber;
  console.log(`Generated member ID: ${memberid}`);
  await this.memberidField.fill(memberid);

  await this.zipcodefield.fill(createAccount.zipcode);
  await this.page.waitForSelector('#terms-and-conditions', { state: 'visible' });

  await this.page.evaluate(() => {
    const checkbox = document.querySelector('#terms-and-conditions');
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
  });

  await this.accCreationSubmit.click({timeout: 10000});
}

// Sample usage of the createWMAccount function
//   async function registerUser() {
//     const createAccountDetails = {
//       firstname: 'John',
//       lastname: 'Doe',
//       password: 'securePassword123',
//       zipcode: '12345',
//     };
//     // Generate a random email externally or use a custom one
//     const userEmail = generateRandomEmail(); // or 'customuser@example.com'
//     await somePageObject.createWMAccount(createAccountDetails, userEmail);
//   }






module.exports = { extractIdWithoutDashes, createWMAccount, generateRandomEmail };
