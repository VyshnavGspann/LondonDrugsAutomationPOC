const {expect, test} = require('@playwright/test');
const {API_Helper} = require('../../../utils/API_Helper');

const application = process.env.TEST_APP; // "OMS" or "SFCC"
const environment = process.env.TEST_ENV; // "qa" or "staging" or "uat"
// The commented line will be uncommented while pushing the code to Github
const testData = require(`../../../testData/sfcc/${environment}TestData.js`);

test.describe('API Test', async () => {

    test('Perform STH Order fulfillment', async ({ request }) => {
        const apiHelper = new API_Helper(testData.tenantId, testData.siteId, testData.env);
        const accessToken = await apiHelper.getAccessToken(testData.clientId, testData.clientSecret);
        
        const orderId = 20903;
        const shipmentNumber = await apiHelper.getShipmentNumber(orderId);
        await apiHelper.executeAcceptShipmentAPI(shipmentNumber);
        await apiHelper.executeValidateItemsInStockAPI(shipmentNumber, [{productQty:1}, {productQty:1}]);
        await apiHelper.executePrintPackingSlipAPI(shipmentNumber);

    });
});