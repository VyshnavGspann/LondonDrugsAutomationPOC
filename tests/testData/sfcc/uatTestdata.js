// testData/sfcc/qaTestData.js
//Test data specific to SFCC qa environment

module.exports = {
    baseUrl: 'https://https://london-drugs-uat-origin.kibology.us/',
  
    dataDomekey: 'datadome=rV3Dhd6iNXYyXV3R2~t6rvYZx3BROLwimSaWDaRC8wxba_kHjRa8wcQ3NXqLUbAJewb~YFjrZ30ZoVNEFXVmJgbY_Qnz1FVrAO0yHtNcZs_1l~_R~hg~_6P9_bw3Hod7',
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