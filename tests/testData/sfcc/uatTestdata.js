// testData/sfcc/qaTestData.js
//Test data specific to SFCC qa environment

module.exports = {
    baseUrl: 'https://https://london-drugs-uat-origin.kibology.us/',
  
    dataDomekey: 'datadome=fAnT95_BIp_7o276GjYeTI4WLLfPczxdQWRo8ns7xmAMIzODMy6GWguZEF87dJyEte~wB2mMN1htW~K6_aRU68n3f4lxsql2fxRi4iHgAK4nFkYFMVVY3~CssonIexY4',
    domain: "london-drugs-uat-origin.kibology.us",

    userEmail: "testimmediate111@yopmail.com",
    password: process.env.PASSWORD,

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