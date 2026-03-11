// Native fetch used
require('dotenv').config({ path: '.env.local' });
if (!process.env.CASHFREE_APP_ID) require('dotenv').config({ path: '.env' });

const APP_ID = process.env.CASHFREE_APP_ID;
const SECRET_KEY = process.env.CASHFREE_SECRET_KEY;
const ENV = process.env.CASHFREE_ENV;

async function check() {
  console.log('Checking Cashfree Integration...');
  console.log('Env:', ENV);
  console.log('App ID:', APP_ID ? APP_ID.substring(0, 5) + '...' : 'MISSING');

  const BASE_URL = ENV === 'PROD' ? 'https://api.cashfree.com/pg' : 'https://sandbox.cashfree.com/pg';

  try {
    const response = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-version': '2023-08-01',
        'x-client-id': APP_ID,
        'x-client-secret': SECRET_KEY,
      },
      body: JSON.stringify({
        order_id: `VERIFY_${Date.now()}`,
        order_amount: 1,
        order_currency: 'INR',
        customer_details: {
          customer_id: 'test_user',
          customer_email: 'test@example.com',
          customer_phone: '9999999999',
          customer_name: 'Test'
        }
      }),
    });

    const data = await response.json();
    console.log('Order Creation Response:', JSON.stringify(data, null, 2));
    
    // Check if UPI is in the list of allowed methods (implicitly) or if there is a restricted list
    if (data.order_status === 'ACTIVE') {
      console.log('SUCCESS: Gateway is accepting production orders.');
    } else {
      console.log('FAILURE: Order status is not ACTIVE.');
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
}

check();
