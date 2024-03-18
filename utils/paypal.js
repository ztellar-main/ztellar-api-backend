const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET} = process.env;
const base = "https://api-m.sandbox.paypal.com";

const generateAccessToken = async () => {
    try {
      if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
        throw new Error("MISSING_API_CREDENTIALS");
      }
      const auth = Buffer.from(
        PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET,
      ).toString("base64");
      const response = await fetch(`${base}/v1/oauth2/token`, {
        method: "POST",
        body: "grant_type=client_credentials",
        headers: {
          Authorization: `Basic ${auth}`,
        },
      });
      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error("Failed to generate Access Token:", error);
    }
};

const createOrder = async () => {
    // use the cart information passed from the front-end to calculate the purchase unit details
    // console.log(
    //   "shopping cart information passed from the frontend createOrder() callback:",
    //   cart,
    // );
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders`;
    const payload = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "PHP",
            value: "100.00",
          },
        },
      ],
    };
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
        // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
        // "PayPal-Mock-Response": '{"mock_application_codes": "MISSING_REQUIRED_PARAMETER"}'
        // "PayPal-Mock-Response": '{"mock_application_codes": "PERMISSION_DENIED"}'
        // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
        // "PayPal-Partner-Attribution-Id": "BN-CODE",
        // "PayPal-Auth-Assertion": "PAYPAL-AUTH-ASSERTION",
      },
      method: "POST",
      body: JSON.stringify(payload),
    });
    return handleResponse(response);
  };

  const captureOrder = async (orderID) => {
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders/${orderID}/capture`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
        // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
        // "PayPal-Mock-Response": '{"mock_application_codes": "INSTRUMENT_DECLINED"}'
        // "PayPal-Mock-Response": '{"mock_application_codes": "TRANSACTION_REFUSED"}'
        // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
        // "PayPal-Partner-Attribution-Id": "BN-CODE",
        // "PayPal-Auth-Assertion": "PAYPAL-AUTH-ASSERTION",
      },
    });

    return {res:response,
    data:'sampleData'}
    }

    async function handleResponse(response) {
        try {
          const jsonResponse = await response.json();
          return {
            jsonResponse,
            httpStatusCode: response.status,
          };
        } catch (err) {
          const errorMessage = await response.text();
          throw new Error(errorMessage);
        }
      }
        
      app.post("/api/orders", async (req, res) => {
        try {
          // use the cart information passed from the front-end to calculate the order amount detals
            //   const { cart } = req.body;
          
          const { jsonResponse, httpStatusCode } = await createOrder();
          res.status(httpStatusCode).json(jsonResponse);
        } catch (error) {
          console.error("Failed to create order:", error);
          res.status(500).json({ error: "Failed to create order." });
        }

      });
        
      app.post("/api/orders/capture", async (req, res) => {
        try {
        //   console.log(orderID)
        const orderID = req.body.orderID
          const result  = await captureOrder(orderID);
        //   UPDATE DATABASE HERE
          res.json(result)
        } catch (error) {
          console.error("Failed to create order:", error);
          res.status(500).json({ error: "Failed to capture order."   });
        }
 
      });
