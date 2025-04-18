// testData/sfcc/qaTestData.js
//Test data specific to SFCC qa environment

module.exports = {
    baseUrl: 'https://https://london-drugs-uat-origin.kibology.us/',
  
    dataDomekey: 'datadome=U8E~nBIaXueJ21LM12ErvDuAfZWu3gD7O~KWSG316KICzJ2t_ASC0GuDsA8GX3zy6KYP8W~igPF2kBRlEAhyrKYi8iDQmCSgtg6hStO6ovcxA5SiVEllo_1fDtU2alz9',
    domain: "london-drugs-uat-origin.kibology.us",

    userEmail: "testimmediate111@yopmail.com",
    password: process.env.PASSWORD,

    // API
    tenantId: 39863,
    siteId: 61984,
    env: "sandbox",

    payment: {
        CreditCard: {
            visa: {
                nameOnCard: 'Test Accept',
                cardNumber: '4111111111111111',
                cvv: '123',
            },
            amex: {

            },
            discover: {

            },
            master: {

            },

        },
        paypal: {
            useremail: "",
            password: process.env.PAYPAL_PASSWORD,

        },
    },

    shipping: {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Accept',
        address1: '501 Av Dressage',
        address2: 'Apt 101',
        city: 'Stittsville',
        zipcode: 'K2V 0C8',
        phone: '555-555-5555',
    },
}