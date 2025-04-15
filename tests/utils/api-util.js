const { request, expect } = require('@playwright/test');
const { Buffer } = require('buffer');

const querystring = require('querystring'); // Node.js module to stringify the body


class APIHelper {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.requestContext = request.newContext({ baseURL });
  }

  apiInventoryAuthorisationData() {
    return {
      endpoint: "v1/configuration/oauth2/token",
      tenantID: "us-5d5d2d0a",
      clientID: "vPo1tW6p9Z7RgbYJ2Bb7WUsFfNSdBiQw",
      clientSecret: "VfZIGJ7FOIrAqn1ag7cMT2nFi5OC9IlK"
    }
  }

  //fetch access token for the IV api
  async fetchAccessToken(tenantId, credentials = {}) {
    const apiPath = `/inventory/${tenantId}/v1/configuration/oauth2/token`;
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    };
    const encodedBody = querystring.stringify(credentials);

    try {
      const response = await (await this.requestContext).post(apiPath, {
        headers: headers,
        data: encodedBody,
      });

      if (response.ok()) {
        const body = await response.json();
        console.log("Response Body:", body);
        expect(body.token_type).toEqual("bearer")
        return body.access_token;
      } else {
        console.error("Response Status:", response.status());
        const text = await response.text(); // Get raw response body
        console.error("Response Body:", text);
        throw new Error('Request failed');
      }
    } catch (error) {
      console.error("Error:", error);
    }

  }

  async updateFulfillmentOptions(tenantId, itemId, queryParams, accessToken) {
    let apiPath = `/inventory/${tenantId}/v1/configuration/items/${itemId}/fulfillment_options`;

    // Important : Convert query parameters object to URL-encoded string
    let queryString = new URLSearchParams(queryParams).toString();

    // query paramter
    if (queryString) {
      apiPath += `?${queryString}`;
    }

    console.log(`apipath - ${apiPath}`)


    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };
    console.log('Access token is ' + accessToken)

    // passing'fulfillmentOptions' as an object
    const response = await (await this.requestContext).patch(apiPath, {
      headers: headers,
      data: {
        "fulfillmentAllowed": true
      }
    });


    if (!response.ok()) {
      console.error(`Failed to update fulfillment options, status code: ${response.status()}`);
      throw new Error(`Request failed with status: ${response.status()}`);
    }

    return await response.json();
  }

  async checkNodeAvailability(tenantId, accessToken, body) {
    let apiPath = `/inventory/${tenantId}/v1/availability/node`;

    console.log(`apipath - ${apiPath}`)

    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };
    console.log('Access token is ' + accessToken)

    const response = await (await this.requestContext).post(apiPath, {
      headers: headers,
      data: body
    });

    if (!response.ok()) {
      console.error(`Failed to getNode Availability, status code: ${response.status()}`);
      throw new Error(`Request failed with status: ${response.status()}`);
    }

    return await response.json();
  }

  async adjustInventorySupply(tenantId, accessToken, body) {
    let apiPath = `/inventory/${tenantId}/v1/supplies`;

    console.log(`apipath - ${apiPath}`)

    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };
    console.log('Access token is ' + accessToken)

    const response = await (await this.requestContext).post(apiPath, {
      headers: headers,
      data: body
    });

    if (!response.ok()) {
      console.error(`Failed to adjust inventory, status code: ${response.status()}`);
      throw new Error(`Request failed with status: ${response.status()} \nResponce body: ${response.body()}`);
    }else {
      console.log(`Status code is ${response.status()}`)
    }

  }

  async getDirtyNodeItem(tenantId, itemId, queryParams, accessToken) {
    let apiPath = `/inventory/${tenantId}/v1/configuration/items/${itemId}/fulfillment_options`;

    //Convert query parameters object to URL-encoded string
    let queryString = new URLSearchParams(queryParams).toString();

    // query paramter
    if (queryString) {
      apiPath += `?${queryString}`;
    }

    console.log(`apipath - ${apiPath}`)
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };
    console.log('Access token is ' + accessToken)

    // passing'fulfillmentOptions' as an object
    const response = await (await this.requestContext).get(apiPath, {
      headers: headers,
    });

    if (!response.ok()) {
      console.error(`Failed to fetch fulfillment options, status code: ${response.status()}`);
      throw new Error(`Request failed with status: ${response.status()}`);
    }
    return await response.json();
  }

  async manageInventory(tenantId, accessToken, nodeAvailabilityBody, adjustInventoryBody) {

    try {
      // Step 1: Check Node Availability
      const availabilityResponse = await this.checkNodeAvailability(tenantId, accessToken, nodeAvailabilityBody);
      console.log('NodeAvailability Response:', availabilityResponse);

      // Step 2: Based on the response, decide whether to adjust inventory supply
      const totalAvailable = availabilityResponse.lines[0].shipNodeAvailability[0].totalAvailableQuantity
      console.log('NodeAvailability Response : :totalAvailableQuantity', totalAvailable);
      if (totalAvailable === 0) {
        //Call adjustInventorySupply API
        const adjustResponse = await this.adjustInventorySupply(tenantId, accessToken, adjustInventoryBody);
        console.log('Inventory adjusted:', adjustResponse);
      } else {
        console.log('No adjustment needed.');
      }
    } catch (error) {
      console.error('Error managing inventory:', error);
    }

  }


  //Loyalty related API functions for Responsys

  responseAPIAuthorization() {
    return {
      // https://api5-017.responsys.net/rest/api/v1.3/auth/token?auth_type=password&user_name=Loyalty_API2&password=gXU%26LHpUad      
      endpoint: "v1.3/auth/token",
      userID: "Loyalty_API2",
      userPWD: "gXU%26LHpUad",
    }
  }
  //fetch access token for Responsys response API
  async fetchresponSYSAccessToken(resbaseURL, userID, userPWD, credentials = {}) {
    const resApiPath = `rest/api/v1.3/auth/token?auth_type=password&user_name=${userID}&password=${userPWD}`
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    };
    const encodedBody = querystring.stringify(credentials);
 
    try {
      const response = await (await this.requestContext).post(resApiPath, {
        headers: headers,
        data: encodedBody,
      });
 
      if (response.ok()) {
        const body = await response.json();
        console.log("Response Body:", body);
        expect(body.endPoint).toEqual(resbaseURL)
        return body.authToken;
      } else {
        console.error("Response Status:", response.status());
        const text = await response.text(); // Get raw response body
        console.error("Response Body:", text);
        throw new Error('Request failed');
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
 
  async verifyUserDetails(accessToken, recrrid, custID, genmailid) {
    // let apiPath = `https://api5-017.responsys.net/rest/api/v1.3/lists/CONTACTS_LIST_TEST/members?qa=e&id=${genmailid}&fs=RIID_,CUSTOMER_ID_,EMAIL_ADDRESS_`;
    let apiPath = `https://api5-017.responsys.net/rest/api/v1.3/lists/CONTACTS_LIST_TEST/members?qa=c&id=${custID}&fs=RIID_,CUSTOMER_ID_,EMAIL_ADDRESS_`;
 
    console.log(`apipath - ${apiPath}`)
 
    const headers = {
      'rrid' : recrrid,
      'cusID' : custID,
      'mailid' : genmailid,
      'Authorization': `${accessToken}`,
      'Content-Type': 'application/json',
    };
 
    console.log('Access token is ' + accessToken)
    // const body = {
    //   "recordData": {
    //     "fieldNames": [
    //         "RIID_",
    //         "CUSTOMER_ID_",
    //         "EMAIL_ADDRESS_"
    //     ],
    //     "records": [
    //         [
    //             `${recrrid}`,
    //             `${custID}`,
    //             `${genmailid}`
    //         ]
    //     ],
    //     "mapTemplateName": null
    //   },
    // }
    
    const response = await (await this.requestContext).get(apiPath, {
      headers: headers,
      //data: body
    });
    console.log('header--', headers)
 
    if (response.ok()) {
      expect(response.status()).toBe(200)
      const resbody = await response.json();
      console.log("Response Body:", resbody.recordData.records);
      return resbody
    }
 
  }

  //Cheetah related API functions
  async fetchcheetah_accessToken() {
    const cheetahApiPath = `https://cust1181.teststellar.com/oauth/token`
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/vnd.stellar-v1+json'
    };
    const formData = {
      'client_id': '67d33cd5d73187b7f3545cab7168f82feafd86c8bfeeb22aaff795ee99503e07',
      'client_secret': '326e92a60a823e509baa79b9c466ea6cdc650bcfa299920f1146c3083f5657e9',
      'grant_type': 'client_credentials'
    };
    const encodedFormData = querystring.stringify(formData);
    try {
      const response = await (await this.requestContext).post(cheetahApiPath, {
        headers: headers,
        data: encodedFormData
      });
 
      if (response.ok()) {
        const resbody = await response.json();
        console.log("Response Body:", resbody);
        expect(resbody.token_type).toEqual("Bearer")
        return resbody.access_token;
      } else {
        console.error("Response Status:", response.status());
        const text = await response.text();
        console.error("Response Body:", text);
        throw new Error('Request failed');
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async verifyGetMemberDetails(accessToken, emailID) {
    let apiPath = `https://cust1181.teststellar.com/program/api/members/?email=${emailID}&access_token=${accessToken}`;
    console.log(`apipath - ${apiPath}`)
    const headers = {
      'Authorization': `${accessToken}`,
      'Content-Type': 'application/json',
    };
    console.log('Access token is ' + accessToken)
    const response = await (await this.requestContext).get(apiPath, {
      headers: headers,
    });
    console.log('header--', headers)
 
    if (response.ok()) {
      expect(response.status()).toBe(200)
      const resbody = await response.json();
      return resbody
    }
 
  }

  //Rapid Enrollments
  async createMemberthroughRE(rapidBaseURL, storeName, wmID, email) {
    const endpoint = `v2/RapidEnrollments`;
    const baseURL = `${rapidBaseURL}/${endpoint}`;
    const username = 'WMAS400QaClient';
    const password = process.env.AS400password;

    const encodedCredentials = Buffer.from(`${username}:${password}`).toString('base64');

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${encodedCredentials}`,
      'Ocp-Apim-Subscription-Key' : 'f055811a5e5d4915abd4132eaca64708'
    };
  
    const reqbody = {
      "NewMembers": [
        {
          "Store": storeName,
          "EventDate": "2024-07-17T18:53:34",
          "WmeId": wmID,
          "Email": email
        }
      ]
    };

    console.log(JSON.stringify(reqbody))
  
    try {
      const response = await (await this.requestContext).post(baseURL, {
        headers: headers,
        data: reqbody,
      });
  
      if (response.ok()) {
        const resbody = await response.json();
        console.log("Response Body:", resbody);
        return resbody;
      } else {
        console.error("Response Status:", response.status());
        const text = await response.text(); 
        console.error("Response Body:", text);
        throw new Error('Request failed');
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
  
  async verifyUserDetailsinAPI(accessToken, wmrid, genmailid) {
    let apiPath = `https://api5-017.responsys.net/rest/api/v1.3/lists/CONTACTS_LIST_TEST/members?qa=c&id=${wmrid}&fs=RIID_,CUSTOMER_ID_,EMAIL_ADDRESS_`;
 
    console.log(`apipath - ${apiPath}`)
 
    const headers = {
      'Authorization': `${accessToken}`,
      'Content-Type': 'application/json',
    };
 
    console.log('Access token is ' + accessToken)

    const response = await (await this.requestContext).get(apiPath, {
      headers: headers,
      //data: body
    });
    console.log('header--', headers)
 
    if (response.ok()) {
      expect(response.status()).toBe(200)
      const resbody = await response.json();
      console.log("Response Body:", resbody.recordData.records);
      return resbody
    }
 
  }

  async verifyGetMemberDetailsinAPI(accessToken, emailID) {
    let apiPath = `https://cust1181.teststellar.com/program/api/members/?email=${emailID}&access_token=${accessToken}`;
    console.log(`apipath - ${apiPath}`)
    const headers = {
      'Authorization': `${accessToken}`,
      'Content-Type': 'application/json',
    };
    console.log('Access token is ' + accessToken)
    const response = await (await this.requestContext).get(apiPath, {
      headers: headers,
    });
    console.log('header--', headers)
 
    if (response.ok()) {
      expect(response.status()).toBe(200)
      const resbody = await response.json();
      return resbody
    }
 
  }



}






module.exports = { APIHelper };