const { request, expect } = require('@playwright/test');
class API_Helper {
    constructor(tenantId, siteId, env) {
        this.log = (msg) => console.log('API_Helper - ', msg);
        this.log('API Helper Initialized');
        this.tenantId = tenantId;
        this.siteId = siteId;
        this.env = env;
        this.authURL = `https://t${tenantId}.${env}.mozu.com/api/platform/applications/authtickets/oauth`;
        this.baseURL = `https://t${tenantId}-s${siteId}.${env}.mozu.com/api/commerce/`;
        this.req = request.newContext(); 
    };

    async getAccessToken(clientId, clientSecret) {
        console.log('')
        let apiReq = {
            method: 'POST',
            url: this.authURL,
            headers: { 'Content-Type': 'application/json',},
            data: {
                "client_id": clientId,
                "client_secret": clientSecret,
                "grant_type": "client_credentials"
            },
        }
        this.log('Access Token API Request:');
        console.log(apiReq);
        const response = await (await this.req).post(apiReq.url, {
            headers: apiReq.headers,
            data: apiReq.data,
        });
        this.log('Access Tokent API Response:');
        console.log(await response.json());
        console.log('')
        expect(response.status(), 'API Status mismatched').toBe(200);

        const resData = await response.json();
        this.accessToken = resData.access_token;
        this.headers= {
            'accept': 'application/json',
            'content-type': 'application/json',
            'authorization': `Bearer ${this.accessToken}`,
        }
        return resData.accessToken;
    };

    async getShipmentNumber(orderId) {
        let apiReq = {
            method: 'GET',
            url: `${this.baseURL}orders?filter=parentCheckoutNumber%20eq%20${orderId}&includeBin=false`,
            headers: this.headers,
        }
        this.log('Get Shipment Number API Request:');
        console.log(apiReq);

        const response = await (await this.req).get(apiReq.url, {
            headers: apiReq.headers,
        });

        this.log('Get Shipment Number API Response:');
        console.log((await response.text()).toString());
        console.log('')
        expect(response.status(), 'API Status mismatched').toBe(200);

        const resData = await response.json();
        expect(resData.items[0].parentCheckoutNumber, 'OrderId Mismatched on response').toEqual(orderId);
        expect(resData.items[0].status, 'Order is not Accepted').toEqual('Accepted');

        let shipmentNumber;
        resData.items[0].changeMessages.forEach((item) => {
            if (item.subject === 'Shipments created') {
                shipmentNumber = parseInt(item.message.split(' ')[2].replaceAll('.', '').trim());
                this.log('Fetched Shipment Number: '+ shipmentNumber);
            }
        }
        );
        return shipmentNumber;
    }

    async executeAcceptShipmentAPI(shipmentNumber) {
        let apiReq = {
            method: 'PUT',
            url: `${this.baseURL}shipments/${shipmentNumber}/tasks/Accept%20shipment/completed`,
            headers: this.headers,
            data: {taskBody: {shipmentAccepted: true}}
        }
        this.log('Accept Shipment API Request:');
        console.log(apiReq);

        const response = await (await this.req).put(apiReq.url, {
            headers: apiReq.headers,
            data: apiReq.data,
        });

        this.log('Accept Shipment API Response:');
        console.log((await response.text()).toString());
        console.log('')
        expect(response.status(), 'API Status mismatched').toBe(200);
    }

    async executeValidateItemsInStockAPI(shipmentNumber, itemDetails=[]) {
        let apiReq = {
            method: 'PUT',
            url: `${this.baseURL}shipments/${shipmentNumber}/tasks/Validate%20Items%20In%20Stock/completed`,
            headers: this.headers,
            data: {taskBody: {}}
        }
        let i=0;
        for (const item of itemDetails) {
            if (i==0) { apiReq.data.taskBody.stockLevel= `${item.productQty}`  }
            else { apiReq.data.taskBody[`stockLevel-${i}`] = `${item.productQty}`; };
            i++;
        }

        this.log('Validate Items In Stock API Request:');
        console.log(apiReq);

        const response = await (await this.req).put(apiReq.url, {
            headers: apiReq.headers,
            data: apiReq.data,
        });

        this.log('Validate Items In Stock API Response:');
        console.log((await response.text()).toString());
        console.log('')
        expect(response.status(), 'API Status mismatched').toBe(200);
    }

    async executePrintPackingSlipAPI(shipmentNumber) {
        let apiReq = {
            method: 'PUT',
            url: `${this.baseURL}shipments/${shipmentNumber}/tasks/Print%20Packing%20Slip/completed`,
            headers: this.headers,
            data: {taskBody: { back: 'false' } }
        }
        this.log('Print Packing Slip API Request:');
        console.log(apiReq);

        const response = await (await this.req).put(apiReq.url, {
            headers: apiReq.headers,
            data: apiReq.data,
        });

        this.log('Print Packing Slip API Response:');
        console.log((await response.text()).toString());
        console.log('')
        expect(response.status(), 'API Status mismatched').toBe(200);
    }
    
}


// workflowState

// test.describe('API Test', async () => { 
//   let req;
//   let baseURL = 'https://simple-books-api.glitch.me';
//   let token;

//   test('Get Access token', async () => { 
//   const req = await request.newContext();
//   const response = await req.post(baseURL + '/api-clients/', {
//       // headers: {
//       //     'Content-Type': 'application/json',
//       //     'Accept': 'application/json',
//       // },
//       data: {
//           "clientName": "Vyshnav",
//           "clientEmail": `Vyshnav+${Math.floor(randomInt(50, 1000))}@examplet.com`,
//       },
//   });

//   const resData = await response.json();
//   console.log(resData);
//   console.log(response.status());
//   console.log(resData.accessToken);
//   token = resData.accessToken;
  
//   });

//   test('Order book', async () => {
//   console.log("------------------------------------------------");
//   console.log("Token:", token);
//   const req = await request.newContext();
//   const response = await req.post(baseURL + '/orders', {
//       headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json',
//           'Authorization': 'Bearer ' + token,
//       },
//       data: {
//           "bookId": 1,
//           "customerName": "Vyshnav.Chavala",
//       },
//   });

//   console.log("Response Body:", await response.json());
//   console.log(response.status());
//   let data = await response.json();
//   console.log(data.orderId);

//   });

// });

module.exports = { API_Helper };

