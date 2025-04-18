const { request, expect } = require('@playwright/test');
const { Buffer } = require('buffer');

const licenses = require('../TestData/Licenses');

class API_Helper {
    constructor(tenantId, siteId, env) {
        this.tenantId = tenantId;
        this.siteId = siteId;
        this.env = env;
        this.authURL = `https://${this.tenantId}.${this.env}.mozu.com/api/platform/applications/authtickets/oauth`;
        this.req = request.newContext();
        this.headers = {
            'Authorization': 'Basic ' + Buffer.from(`${licenses.username}:${licenses.password}`).toString('base64'),
            'Content-Type': 'application/json',
        };

        
    };

    async getAccessToken() {
        const response = await this.req.post('https://simple-books-api.glitch.me/api-clients/', {
            headers: this.headers,
            data: {
                "clientName": "Vyshnav",
                "clientEmail": `Vyshnav+${Math.floor(Math.random() * 1000)}@example.com`,
            },
        });
        const resData = await response.json();
        return resData.accessToken;
    };
    
}

test.describe('API Test', async () => { 
  let req;
  let baseURL = 'https://simple-books-api.glitch.me';
  let token;

  test('Get Access token', async () => { 
  const req = await request.newContext();
  const response = await req.post(baseURL + '/api-clients/', {
      // headers: {
      //     'Content-Type': 'application/json',
      //     'Accept': 'application/json',
      // },
      data: {
          "clientName": "Vyshnav",
          "clientEmail": `Vyshnav+${Math.floor(randomInt(50, 1000))}@examplet.com`,
      },
  });

  const resData = await response.json();
  console.log(resData);
  console.log(response.status());
  console.log(resData.accessToken);
  token = resData.accessToken;
  
  });

  test('Order book', async () => {
  console.log("------------------------------------------------");
  console.log("Token:", token);
  const req = await request.newContext();
  const response = await req.post(baseURL + '/orders', {
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + token,
      },
      data: {
          "bookId": 1,
          "customerName": "Vyshnav.Chavala",
      },
  });

  console.log("Response Body:", await response.json());
  console.log(response.status());
  let data = await response.json();
  console.log(data.orderId);

  });

});

module.exports = { API_Helper };

