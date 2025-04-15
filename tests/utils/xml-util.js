// Import necessary modules from Playwright for testing, assertions, and browser control.
const { expect, chromium } = require('@playwright/test');


const fs = require('fs');
const path = require('path');
const { parseStringPromise } = require('xml2js');

/**
 * 
 * @param {*} filePath 
 * @returns 
 */
//provide the downloaded xml file path
async function readXmlFile(filePath) {
    //   const fullPath = path.join(__dirname, filePath);
    try {
        const xmlData = await fs.readFileSync(filePath, 'utf8');
        //console.log(`XML Data ; ${xmlData}`)
        return xmlData;
    } catch (error) {
        console.error('Error reading the XML file:', error);
        throw error;
    }
}

function validateOrderNumber(orderNode,expOrderNumber) {
    const orderNo = orderNode['order-no'];
    console.log(`Order Number is ${orderNo}`)
    expect(expOrderNumber).toEqual(orderNo.trim())
}

function validateCustomerEmail(customerNode,expCustomerEmail) {
    const email = customerNode['customer-email'];
    console.log(`Customer Email is ${email}`)
    expect(expCustomerEmail).toEqual(email.trim())

}

function validatePromotioncode(promoNode,expPromoCode) {
    const promo = promoNode._;
    console.log(`Promo code  is ${promo}`)
    expect(promo).toContain(expPromoCode)
    // if (!promo || !promo.includes(expPromoCode)) {
    //     throw new Error('Promo code is missing.');
    // }
}

function validateOrderTotal(OrderTotal,exptax,expTotal) {
    const totaltax = OrderTotal.tax
    const ordertotal = OrderTotal['gross-price']
    console.log(`Total tax is ${totaltax}`)
    console.log(`Order total price is ${ordertotal}`)

    expect(exptax).toEqual(totaltax)
    expect(expTotal).toEqual(ordertotal)
}

async function parseXml(xmlData) {
    try {
        const result = await parseStringPromise(xmlData, { explicitArray: false, ignoreAttrs: false });
        // console.log(`ParseXML : ${result}`)
        // console.log('JSON output is ' + JSON.stringify(result));
        return result;
    } catch (error) {
        console.error('Error parsing XML data:', error);
        throw error;
    }
}


async function validateXmlFile(filePath,promoApplied=false,expPromoCode ,expOrderNumber,expCustomerEmail,exptax,expTotal) {
    const xmlData = await readXmlFile(filePath);
    const parsedData = await parseXml(xmlData);

    // Assuming orders is the root, and we're validating the first order as an example
    const ordernode = parsedData.orders.order.$;
    const customernode = parsedData.orders.order.customer;
    const OrderTotalnode = parsedData.orders.order.totals['order-total'];
    if(promoApplied){
        const promocode = parsedData.orders.order['custom-attributes']['custom-attribute'][3];
        validatePromotioncode(promocode,expPromoCode)
    }
    //console.log(`Order Number is : ${order}`)
    // Perform validations
    validateOrderNumber(ordernode,expOrderNumber);
    validateCustomerEmail(customernode,expCustomerEmail);
    validateOrderTotal(OrderTotalnode,exptax,expTotal)
    console.log('XML data is valid.');
}

async function validateXMLWithFreeShipingandStore(BMskip, orderSumTotalTax, orderSumTotal, orderNumber, userEmailaddress, promoCode, promoApply) {
    console.log('[INFO] XML validation starts..')
    console.log(BMskip)
    if (BMskip == 'YES') {
      console.log("[INFO] Skipping BM validation based on environment variables");
      return;
    }
    const tax = orderSumTotalTax;
    const orderTotal = orderSumTotal;
    let promoApplied
    let ordernumber = orderNumber    
    let email = userEmailaddress
    let promocode = promoCode
    console.log('Printing details-', tax, orderTotal, ordernumber, email, promocode);
    const xmlFilePath = 'tests/testData/sfcc/xmldownload/'
    const fileName = ordernumber
    await validateXmlFile(`${xmlFilePath}${fileName}.xml`, promoApplied = promoApply, promocode, ordernumber, email, tax, orderTotal)
      .then(() => console.log('[SUCCESS] Validation complete.'))
      .catch(error => console.error('[ERROR] Validation failed:', error));
}



module.exports = {
    readXmlFile,
    validateOrderNumber,
    validateCustomerEmail,
    validatePromotioncode,
    validateOrderTotal,
    parseXml,
    validateXmlFile,
    validateXMLWithFreeShipingandStore

};