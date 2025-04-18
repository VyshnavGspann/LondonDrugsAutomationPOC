// testData/sfcc/qaTestData.js
//Test data specific to SFCC qa environment

module.exports = {
    baseUrl: 'https://https://london-drugs-uat-origin.kibology.us/',

    dataDomekey: 'datadome=wqxIXvOyWgYgf8Q~gfNtYG5856k_v4ANdNwz2R4MqAlw8YfvjY~fDvxlWxFcO9TxX~VqxSoynAtbF~TUp8fKkB~nWehkE26NrjkHS5nuVsmgB3OpFrfk1AscEA_KWNyo',  
    domain: "london-drugs-uat-origin.kibology.us",
    password: process.env.USER_PASSWORD,

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
        giftcard: {
            GfCardno: process.env.GIFTCARD_NUMBER,
            GcardPin: process.env.GIFTCARD_PIN,
        },
        giftcardLessAmount: {
            GfCardno: "7777323889100628",
            GcardPin: "63592674",
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
    }


}
