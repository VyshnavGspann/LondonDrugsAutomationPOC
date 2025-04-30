// testData/sfcc/qaTestData.js
//Test data specific to SFCC qa environment

module.exports = {
    baseUrl: 'https://london-drugs-uat-origin.kibology.us/',

    dataDomekey: 'datadome=~S5KVjx7nBREDVUfGSU_Rcui_RLNXFTMbg5e7lp~u6y_U55feIrdNN85WgDw5XidWBN2a1i99UWAbdQJDWW2bji190KCXDWBNk6A2EqJHArFe6yEF7XvdZcZPw6GG5zj',
    domain: "london-drugs-uat-origin.kibology.us",

    userEmail: "herryom25@yopmail.com",
    password: process.env.PASSWORD,

    // API
    tenantId: 39863,
    siteId: 61984,
    env: "sandbox",
    clientId: "LoDru.ld_qe_automation.1.0.0.Release",
    clientSecret: "408f7a052f4546ddaafb03815b2e264c",

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
                nameOnCard: 'Test Accept',
                cardNumber: '5431 1111 1111 1111',
                cvv: '123',
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

    shippingInStore: {
        firstName: 'John',
        lastName: 'Accept',
        phone: '789 033-4541',
        address1: '116 Harley Street',
        city: 'Rimouski',
        postalCode: "G5L 0A0",
    },

    doorDash: {
        address1: "1-1225 St Mary's Rd",
        city: 'Winnipeg',
        postalCode: "R2M 5E5",
    },

    doorDashShipping: {
        email: 'tes1t@example.com',
        firstName: 'Keil',
        lastName: 'Accept',
        address1: "1-1225 St Mary's Rd",
        address2: 'Apt 101',
        city: 'Winnipeg',
        zipcode: 'R2M 5E5',
        phone: '+(703) 701-9964',
    },

    productData: {
        productskeywords: ["Vases", "Baking Tools", "Bowl", "Wall Hooks"],

        MIXED_PRODUCT: ["444432", "540625", "448849", "527210",],

        VARIANT_PRODUCT: ["108012"],

        STH_Only: ["109034", "95135",],

        STH_DROP_SHIP: ["104013",],

        BOPIS_Only: ["370495",],

        BOPIS_LOW_STOCK: ["622973"],

        SET_PRODUCT: ["588850"],

        COLLECTION_PRODUCT: ["SET105599"],

        SET_WITH_PRICE_DIFFERENCE: ["593678"],

        STS: ["108012", "565723", "622201",],

        SURCHARGE: ["108012", "57006927",],

        GIFT_CARD: ["489-025", "440-025", "488-025",],

        E_GIFT_CARD: ["495-025", "495-050",],

        REGULAR_BUNDLE_STH: ["SKU940", "SKU1039"],

        REGULAR_BUNDLE_BOPIS: ["SKU1043", "SKU1038"],

        FURNITURE_BUNDLE_STH: ["SKU940",],

        FURNITURE_BUNDLE_BOPIS: ["SKU974"],

        BUNDLE_VARIANT_PRODUCT: ["SKU1044",],

        SURCHARGE_BUNDLE_PRODUCT: ["SKU1040"],

        SALE_ITEM: ["121395",],

        OOS_PRODUCT: ["640701",],

        FREE_SHIPPING_INELIGIBLE: ["57001174"],

        NO_REVIEW_PRODUCT: ["115355"],

        ALCOHOL_PRODUCT: ["423554"],

        regular: {
            productcode: "527210",
            glassProduct: "448849",
            rootsProduct: "567736",
            coffeeBean: "540626",
            bowlProduct: "629800",
            bowlProduct1: "629798",
            stsProduct: "635442",
            cabinetFurniture: "57009857",
            squareStoolRating: "448849",
            lampProduct: "629073",
            eGiftCard: "495025",
            oosProduct1: "629636",
            oosProduct2: "57005057",
            kitchenProduct: "555871",
            alcoholProduct: "423554",
            variantProduct: "549817",
            setProduct: "398453",
            nonExistentSku: "148521",
            noReviewProduct: "631709",
            productByName: "Chairs",
            ineligibleProductFreeshipping: "57005732",
            saleItem: "57009798",
            saleAndNosaleVariant: "78631",
            errorquantityProduct: "607833"

        },
        bundled: {
            bundleProduct: "SKU973", //Bundle product
            bundleProductUrl: "https://development-instance.worldmarket.com/p/segovia-metal-3-piece-outdoor-furniture-set-with-chairs-SKU1043.html",
            bundleBopisProduct: "SKU817",
            noSaleItemBundleProduct: "SKU971",
            colorSwatchBundle: "SKU1005G",
            oversizedProducts: ["outdoor chair"],
            variantBundleProduct: "SKU1005G", // variant bundle product
            invalidKeyWord: "chari",
            searchKeyword: "computer",
            searchKeyword2: "our world",
            inStoreOnly: "SKU975", // product set that is available for instore only
            onlineOnly: "SKU815", // product set that is available for online only
            quaintityVariantBundle: "SKU974", // product is set like different quantity in varaints 3,2,4
            bundleSearch: "SKU",
        },

        inventoryUpdateProducts: {
            productcode: "527210",
            glassProduct: "448849",
            rootsProduct: "567736",
            coffeeBean: "540626",
            bowlProduct: "629800",
            bowlProduct1: "629798",
            stsProduct: "635442",
            cabinetFurniture: "57009857",
            squareStoolRating: "448849",
            lampProduct: "629073",
            eGiftCard: "495025",
            oosProduct1: "629636",
            oosProduct2: "57005057",
            kitchenProduct: "555871",
            alcoholProduct: "423554",
            variantProduct: "549817",
            setProduct: "398453",
            noReviewProduct: "631709",
            productByName: "Chairs",
            ineligibleProductFreeshipping: "57005732",
            saleItem: "57009798",
            saleAndNosaleVariant: "78631",
            errorquantityProduct: "607833"
        },

        giftproduct: {
            giftCard: "Gift card",
            eGiftCard: "eGift Card",
            giftcards: " Gift Cards"
        },
        stsproduct: {
            stsProduct: "635442"
        },
        multiSKU: {
            multiskuPillow: "119281"
        },
        pdpSKU: {
            chocolateInStoreOnly: "597988",    // This product SKU should have Store Only Availability
            rugOnlineOnly: "57002187",          // This product SKU should have Online Only availability 
            shelfLowStock: "566166",            // This product SKU should have low stock availability
            outdoorOOSProduct: "114569",      // This product should have unavailability of both delivery methods
            pillowPickupOOS: "607982",          // This product SKU should be out of stock in Inventory for Pickup
            outofStockThrowPillow: "614146",    // This product SKU should be in stock for Store144 & OOS in Store258 
        }
    },

    createAccount: {
        validdetails: {
            firstname: "Test",
            lastname: "Tester",
            password: process.env.USER_PASSWORD,
            memberid: "2233442233",
            zipcode: "78701"
        },
        invalidDetails: {
            validusername: "wme2ereg+auto1@gmail.com",
            invalidpassword: "123456789",
            invalidusername: "tester12345",
            validpassword: process.env.USER_PASSWORD
        },
        detailsWithInvalidPassword: {
            enrollAccountfirstname: "Test",
            enrollAccountlastname: "Tester",
            enrollAccountzipcode: "78701",
            enrollAccountInvalidZipcode: "787",
            enrollAccountInvalidPassowrd: "@Test1",
            enrollAccountPassowrd: process.env.USER_PASSWORD,
            enrollAccountInvalidPasswordError: "Password cannot be less than 10 characters.",
            enrollAccountInvalidPasswordErroCheckout: "Sorry, the provided password does not match the required constraints.",
            enrollAccountInvalidZipcodeError: "Please enter a valid zip code",
            enrollAccountInvalidZipcodeErrorCheckout: "Enter a 5-digit ZIP code.",
        }


    },

    userDetails: {
        credentials: {
            empUsername: "sindhutest30+147@gmail.com",
            empPassword: process.env.USER_PASSWORD,
        },
        billing: {
            billing1: {
                firstName: "Tester2",
                lastName: "User",
                emailAddress: "wme2ereg+auto2@gmail.com",
                address: "1100 Congress Ave",
                city: "Austin",
                stateCode: "TX",
                postalCode: "78701-2539",
                phoneNumber: "9876543211"
            },
            billing2: {
                firstName: "test",
                lastName: "user",
                emailAddress: "wme2ereg+auto9@gmail.com",
                address: "700 14th",
                city: "Denver",
                stateCode: "CO",
                postalCode: "80202-3213",
                phoneNumber: "9876543211"
            },
            HawaiiAddress: {
                addressTitle: 'Hawaii address',
                firstName: "test",
                lastName: "user1",
                emailAddress: "wme2ereg+auto9@gmail.com",
                address: "290 Sand Island Access Rd",
                city: "Honolulu",
                stateCode: "HI",
                postalCode: "96819",
                phoneNumber: "9878943211"

            },
            AlaskaAddress: {
                addressTitle: 'Alaska address',
                firstName: "test",
                lastName: "user2",
                emailAddress: "wme2ereg+devtestEmail02@worldmarket.com",
                address: "199 Troy ave",
                city: "Juneau",
                stateCode: "AK",
                postalCode: "99801",
                phoneNumber: "9870943211"

            },
            POBoxAddress: {
                addressTitle: 'PO Box address',
                firstName: "test",
                lastName: "user3",
                emailAddress: "wme2ereg+devtestEmail02@worldmarket.com",
                address: "PO Box 335",
                city: "Morgantown",
                stateCode: "PA",
                postalCode: "19543-0335",
                phoneNumber: "9870943231"
            },

        },
        eGiftCard: {
            recipientName: "Tester",
            recipientEmail: "wme2ereg+auto1@gmail.com",
            recipientInvalidEmail: "wme2ereg+auto1gmail.com",
            senderName: "user"
        },
        CreditcardPin: "123",
    },

    inventory: {
        storeName: "Falls Church",
        storeName2: "77598",
    },

    promotionCode: {
        discount: "CPWMDISCOUNT",
        store20: "STORE20",
        freeshiping: "WMFS49",
        store10: "STORE10",
        invalidPromo: "TEN50 "
    },

    state: {
        stateCode: "TX"
    },

    underlineErrors: {
        bopisDiffStoreError: "We currently cannot combine two different store pickup dates in one order. Please remove an item from the cart to proceed to checkout.",
        overrideError: "Members Save 10% On In-Store Pick-Up Orders was removed when you applied Members Save 20% On In-Store Pick-Up Orders",
        freeSheepingNonEligibleError: "Item not eligible for Free Shipping on orders $49+!",
        invalidPromoCodeGuestUser: "The coupon code you have entered is not valid. Recheck the code and try again.",
        invalidUserExclusiveGuestUser: "Please Sign In or Join World Market Rewards to redeem Member-exclusive Coupon.",
        overrideError: "Members Save 10% On In-Store Pick-Up Orders was removed when you applied Members Save 20% On In-Store Pick-Up Orders",
        comboPromoApplyErrorMessage: "Birthday Offer - 15% Off was removed when you applied Employee Discount 10% Alcohol",
        fiveDollarMemberExclusiveRewardNotAppliedError: "Some items cannot be combined with Member Exclusive - $5 off!. For exclusions please read the",
        comboPromoApplyErrorMessageStore20: "Birthday Offer - 15% Off was removed when you applied Members Save 20% On In-Store Pick-Up Orders Undo",
        pickupUnAvailableErrorMessage: "Item is no longer available",
        itemNotAvailableForBothShippingMethodsErrorMessage: "Item is no longer available for the pick up or shipping method selected. Please select a different store, pick up or shipping method, or proceed to checkout without the item.",
        outOfStockForPickup: "Sorry, out of stock for pick up",
        outOfStockForSTH: "Sorry, not available for shipping",
        notAvailaleForPickup: "Sorry, not available for pick up",
        ItemNoLongerAvailableErrorMessage: "Item is no longer available and will not be included at checkout.",
        PromoNotEligibleErrorMessage: 'Some items do not qualify for promotion. Please see "Details" for more information and exclusions.',
        quantityErrorMessageForPickup: 'You wanted 5, we only have 2 available for pick up.',
        quantityErrorMessageForPickup44: 'You wanted 45, we only have 44 available for pick up.',
        quantityErrorMessageForShipping: 'You wanted 5, we only have 2 available for shipping.',
        quantityEroorMessageBundle: 'You wanted 3, we only have 1 available for shipping.',
        firstNameError: "Please enter your first name.",
        lastNameError: "Please enter your last name.",
        passwordError: "Password is a required field.",
        zipCodeError: "Please enter a valid ZIP code.",
        termsError: "Please read and accept the terms and conditions.",
        couponLimitReachedErrorMessage: "Coupons in cart limit has been reached",

    },

    rewards: {
        inStore10PercentReward: "10% off with in store Pick-up!",
        freeShippingReward: "Free Shipping on orders $49+!",
        welcomeReward: "15% off Welcome",
        qaLoyaltyPromotion: "10% Off Store Pick-Up & No Shipping Fee",
        stgLoyaltyPromotion: "EXTRA 20% Off Store Pick-Up"
    },

    breadBoardLinkText: {
        rewardsLandingPage: "Rewards Landing Page",
        savedPaymentMethods: "Saved Payment Methods"
    },

    giftMessage: {
        giftMessageInput: "Hi, Hope you are doing great, This is the Gift With Best Wishesh on the Occasion from my side."
    },

    categories: {
        DecorAndPillows: {
            name: 'Decor & Pillows',
            subCatgories: {
                PillowsAndThrows: {
                    name: 'Pillows & Throws',
                    subCatgories: {
                        chairCushions: {
                            name: 'Chair Cushions'
                        }

                    }
                }
            }
        }
    },
    expTextsAddNewCard: {
        expTexts: [
            '* Name on Card',
            '* Card Number',
            '* Security Code',
            'Card Nickname',
            'Billing Address:',
            'Street Address',
            'City',
            '* State',
            'Make default payment',
            'Save',
            'Cancel'
        ]

    },

    BreadboardLinkText: {
        Home: {
            name: 'Home',
            DecorAndPillows: {
                name: 'Decor & Pillows',
                subCatgories: {
                    PillowsAndThrows: {
                        name: 'Pillows & Throws',
                        subCatgories: {
                            chairCushions: {
                                name: 'Chair Cushions'
                            }

                        }
                    }
                }
            }
        },
    },

    oms: {
        regression: {
            C12745: [
                { productCode: '618957', quantity: '1', shipNode: '899', deliveryMethod: "Ship to Home" },
                { productCode: '444432', quantity: '5', shipNode: '899', deliveryMethod: "Ship to Home" }
            ],
            C12743: [
                { productCode: '444432', quantity: '1', shipNode: '144', deliveryMethod: "Pick Up" },
                { productCode: '444432', quantity: '1', shipNode: '899', deliveryMethod: "Ship to Home" }
            ],
            C12744: [
                { productCode: '444432', quantity: '1', shipNode: '144', deliveryMethod: "Pick Up" }, //Falls Church
                { productCode: '444432', quantity: '1', shipNode: '899', deliveryMethod: "Ship to Home" }
            ],
            C12747: [
                { productCode: 'SKU817', quantity: '1', shipNode: '144', deliveryMethod: "Pick Up", lineItems: [{ productCode: "607408", quantity: '1', shipNode: '144' }, { productCode: "607407", quantity: '2', shipNode: '144' }, { productCode: "607409", quantity: '1', shipNode: '144' }] },
                { productCode: "444432", quantity: '6', shipNode: '899', deliveryMethod: "Ship to Home" },
            ],

            C12748: [
                { productCode: '444432', quantity: '1', shipNode: '144', deliveryMethod: "Ship to Home" },
                { productCode: '448849', quantity: '1', shipNode: '899', deliveryMethod: 'Ship to Home', }
            ],
            C12749: [
                { productCode: '618957', quantity: '1', shipNode: '899', deliveryMethod: "Ship to Home" },
                { productCode: '567736', quantity: '1', shipNode: '899', deliveryMethod: "Ship to Home" }
            ],
            C12750: [
                { productCode: '444432', quantity: '1', shipNode: '899', deliveryMethod: "Ship to Home" },
                { productName: 'PGC', productCode: '487025', quantity: '1', shipNode: '899', deliveryMethod: "Ship to Home" }
            ],
            C17283: [
                { productCode: '444432', quantity: '1', shipNode: '144', deliveryMethod: "Pick Up" }
            ],
            C12976: [
                { productCode: '444432', quantity: '2', shipNode: '144', deliveryMethod: "Pick Up" }
            ],
            C12977: [
                { productCode: '444432', quantity: '2', shipNode: '144', deliveryMethod: "Pick Up" }
            ],
            C12978: [
                { productCode: '567736', quantity: '1', shipNode: '144', deliveryMethod: "Pick Up" },
                { productCode: '444432', quantity: '1', shipNode: '144', deliveryMethod: 'Pick Up', }
            ],
            C12751: [
               /* Bundle Product */ { productCode: 'SKU817', quantity: '1', shipNode: '899', deliveryMethod: "Ship to Home", lineItems: [{ productCode: "607408", quantity: '1', shipNode: '899' }, { productCode: "607407", quantity: '2', shipNode: '899' }, { productCode: "607409", quantity: '1', shipNode: '899' }] },
                //    /* Bundle Product */ {productCode: 'SKU1030', quantity: '1', shipNode: '899', deliveryMethod: "Ship to Home", lineItems:[{productCode:"629701", quantity: '1', shipNode: '899'}, {productCode:"629700", quantity: '2', shipNode:'899'}]},
                { productCode: '527210', quantity: '1', shipNode: '899', deliveryMethod: 'Ship to Home', }
            ],
            C12752: [
                { productCode: '444432', quantity: '1', shipNode: '899', deliveryMethod: "Ship to Home" },
                { productCode: '340072', quantity: '2', shipNode: '899', deliveryMethod: 'Ship to Home', }
            ],
            C14931: [
                { productCode: '444432', quantity: '5', shipNode: '899', deliveryMethod: "Ship to Home" }
            ],
            C14932: [
                { productCode: '444432', quantity: '1', shipNode: '144', deliveryMethod: "Pick Up" }
            ],
            C14933: [
                { productCode: '444432', quantity: '1', shipNode: '144', deliveryMethod: "Pick Up" }
            ],
            C14934: [
                { productCode: '444432', quantity: '1', shipNode: '144', deliveryMethod: "Pick Up" }
            ],
            C14935: [
                { productCode: '444432', quantity: '1', shipNode: '144', deliveryMethod: "Pick Up" }
            ],
            C14936: [
                { productCode: '635442', quantity: '1', shipNode: '144', deliveryMethod: "Pick Up" }
            ],
            C13379: [
                { productCode: '635442', quantity: '1', shipNode: '144', deliveryMethod: "Pick Up" }
            ],
            C13385: [
                { productCode: '495025', quantity: '5', shipNode: '899', deliveryMethod: "Ship to Home" }
            ],
            C12754: [
                { productCode: '567736', quantity: '1', shipNode: '899', deliveryMethod: "Ship to Home" }
            ],
            C13380: [
                { productCode: '567736', quantity: '1', shipNode: '899', deliveryMethod: "Ship to Home" }
            ],
            C13382: [
                { productCode: '567736', quantity: '1', shipNode: '899', deliveryMethod: "Ship to Home" }
            ],
            C13381: [
                { productCode: '567736', quantity: '1', shipNode: '144', deliveryMethod: 'Pick Up', }
            ],
            C12979: [
                { productCode: '527210', quantity: '1', shipNode: '899', deliveryMethod: "Ship to Home" },
                { productCode: '444432', quantity: '1', shipNode: '899', deliveryMethod: "Ship to Home" }
            ],
            C12980: [
                { productCode: '527210', quantity: '1', shipNode: '899', deliveryMethod: "Ship to Home" },
                { productCode: '444432', quantity: '1', shipNode: '899', deliveryMethod: "Ship to Home" }
            ],
            C12981: [
                { productCode: '527210', quantity: '1', shipNode: '899', deliveryMethod: "Ship to Home" },
                { productCode: '444432', quantity: '1', shipNode: '899', deliveryMethod: "Ship to Home" }
            ],
            C12982: [
                { productCode: '444432', quantity: '1', shipNode: '899', deliveryMethod: "Ship to Home" },
                { productCode: '444432', quantity: '1', shipNode: '892', deliveryMethod: "Ship to Home" }
            ],
            C12753: [
                { productCode: '444432', quantity: '2', shipNode: '144', deliveryMethod: "Pick Up" },
                { productCode: '444432', quantity: '3', shipNode: '899', deliveryMethod: "Ship to Home" }
            ],
            C12756: [
                { productCode: '618957', quantity: '1', shipNode: '899', deliveryMethod: "Ship to Home" },
                { productCode: '567736', quantity: '1', shipNode: '899', deliveryMethod: "Ship to Home" }
            ],
        },
        sanity: {

            C14965: [
                { productCode: '527210', quantity: '1', shipNode: '899', deliveryMethod: "Ship to Home" },
                { productCode: '444432', quantity: '1', shipNode: '899', deliveryMethod: "Ship to Home" }
            ],
            C14964: [
                { productCode: '527210', quantity: '1', shipNode: '899', deliveryMethod: "Ship to Home" },
                { productCode: '444432', quantity: '1', shipNode: '899', deliveryMethod: "Ship to Home" }
            ],
            C14963: [
                { productCode: '527210', quantity: '1', shipNode: '899', deliveryMethod: "Ship to Home" },
                { productCode: '444432', quantity: '1', shipNode: '899', deliveryMethod: "Ship to Home" }
            ],

            C14960: [
                { productCode: '444432', quantity: '1', shipNode: '144', deliveryMethod: "Pick Up" }
            ],

        }

    },

    loginPageMsgs: {
        staticErrorMessageText: "The email address entered is not attached to a registered World Market Rewards account",
        expectedWmrIdEndText: "4550",
        WelcomeBackText: " Welcome back, let's finish setting up your account. Thanks for providing this email address in one of our stores recently. Looks like we just need a bit more info to finish setting up your account",
        signInWithoutPasswordButton: "SIGN IN WITHOUT PASSWORD",
        noPasswordNeededText: "We'll send a link you can click to sign in, no password needed!",
        invalidEmailErrorText: 'Please enter a valid email address with "@" and "."',
        existingEmailJoinNowErrorText: "Hmm...it appears that an account with that email address already exists. If you're sure you entered the correct information, it's likely you already have a password.",
        alreadyPassowrdExistText: "Already have a password?",
        signInLinkTextForExistingEmail: "Sign in",
        resetReponseTitle: "Request Received",
        resetResponseText: "We've sent you an email with the information needed to reset your password. The email might take a couple of minutes to reach your inbox. Please check your junk mail to ensure you receive it.",
        resetLoginText: "LOGIN",
        resetCanceText: "CANCEL",
    },

    checkoutPageMsgs: {
        promotionalEmailText: "Yes, I’d like promotional email from World Market.",
        termsandConditionsText: "By clicking “Complete Order,” you are agreeing to our updated Terms & Conditions",
        selectAddressText: "Select Shipping Address:",
        pickupReceverText: "Who is picking up your order?",
        selfPickupText: "I will pickup the item(s)",
        alternamePickupText: "Add an alternate pickup person",
        smsAlertText: "We'll text you when your order is ready for pick up",
        smsAlertAgree: "I agree to receive SMS from World Market",
        billingLabelText: "Billing Address:",
        billingLabelTextBOPISGuest: "Enter Billing Address:",
        addBillAddressText: "Add New Billing Address",
        guestSelectPaymentMethodText: "Select a Payment Method:",
        guestTransactionTermsText: "All transactions are secure and encrypted.",
        addBillAddressText: "Add New Billing Address",
        guestEnterPaymentDetails: "Enter Payment Details:",
        worldMarketCreditCardText: "World Market Credit Card",
        guestWMCCSingInText: "Sign In to earn bonus points and pay with your World Market Credit Card. Learn More",
        returningMemberText: "Returning Members Sign In",
        newcustomerText: "New Customers"
    },

    searchTips: {
        heading: "Search Tips:",
        tips: [
            "Check for typos or misspellings",
            "Simplify your search - use fewer words or simpler terms",
            "Use a catalog product number, if available",
            "Contact Us for help"
        ]
    },

    orderSummaryPage: {
        joinWorldMarketText: "Join World Market Rewards",
        enterDetailsToJoinWMText: "Enter Your Details to Join"

    },

    wmccMessage: {
        wmccCardMessage: "Earn 20% off your first purchase with the World Market Credit Card"
    },

    passwordLessDrawerMessage: {
        thankYouNote: "Thank you for submitting your email address",
        emailSentConfmText: "We've sent you an email which contains a link to complete your sign in. The email might take a couple of minutes to reach your inbox. Please check your junk mail to ensure you receive it.",
        mailNotReceived: "DIDN’T RECEIVE EMAIL?",
        signInWithoutPasswordText: "Sign in without password",

    },

    emailSignupModelMessage: {
        signupmodelTitle: 'WORLD MARKET GIFT CARD',
        emailSignupOfferText: 'LATEST NEWS AND OFFERS',
        signupNowText: 'SIGN UP NOW',
        newSubsriberText: 'Must be a new subscriber.',
        subsriptionthankText: 'THANKS FOR SUBSCRIBING!',
    }

}
