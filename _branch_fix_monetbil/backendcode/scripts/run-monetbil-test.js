/*
 Simple end-to-end Monetbil (mock) test:
 - Boot the app server on a random port
 - Create an order
 - Start Monetbil payment
 - Check payment status until success (mock)
*/

const http = require('http');
const { URL } = require('url');

function request(method, url, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const data = body ? Buffer.from(JSON.stringify(body)) : null;
    const req = http.request(
      {
        method,
        hostname: u.hostname,
        port: u.port,
        path: u.pathname + (u.search || ''),
        headers: {
          'Content-Type': 'application/json',
          ...(data ? { 'Content-Length': String(data.length) } : {}),
          ...headers,
        },
      },
      (res) => {
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => {
          const buf = Buffer.concat(chunks).toString('utf8');
          try {
            const json = JSON.parse(buf || '{}');
            if (res.statusCode >= 400) return reject({ status: res.statusCode, json });
            resolve({ status: res.statusCode, json });
          } catch (e) {
            if (res.statusCode >= 400) return reject({ status: res.statusCode, body: buf });
            resolve({ status: res.statusCode, body: buf });
          }
        });
      }
    );
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

(async () => {
  process.env.PORT = String(0); // random port
  process.env.MONGODB_URI = 'memory';
  process.env.MONETBIL_MOCK = 'true';
  process.env.ALLOWED_ORIGINS = '';

  const app = require('../dist/server.js').default;
  const server = app.listen(0);

  await new Promise((r) => server.once('listening', r));
  const { port } = server.address();
  const base = `http://localhost:${port}/api`;
  console.log('Server for test on', base);

  // 1) Create order
  const orderPayload = {
    items: [
      { productId: 'sku-1', name: 'Test Product', price: 1000, image: 'x', quantity: 1 },
    ],
    additionalItems: [],
    subtotal: 1000,
    shoppingFee: 500,
    deliveryFee: 0,
    total: 1500,
    budget: 2000,
    customerInfo: {
      name: 'Test User',
      email: 'test@example.com',
      phone: '+237600000000',
      address: 'Somewhere',
      city: 'Yaoundé',
    },
  };

  const orderRes = await request('POST', `${base}/orders`, orderPayload);
  const orderId = orderRes.json._id;
  console.log('Order created', orderId);

  // 2) Start Monetbil
  const startRes = await request('POST', `${base}/payments/monetbil/start`, {
    orderId,
    phone: '+237600000000',
  });
  console.log('Start payment response', startRes.json);
  const paymentId = startRes.json.paymentId;
  if (!paymentId) throw new Error('No paymentId');

  // 3) Check Monetbil
  const checkRes = await request('GET', `${base}/payments/monetbil/check?orderId=${orderId}`);
  console.log('Check payment response', checkRes.json);

  const payStatus = checkRes.json.payment?.status;
  console.log('Payment status:', payStatus);
  if (payStatus !== 'success') throw new Error('Payment not successful');

  server.close();
  console.log('E2E Monetbil mock test PASSED');
  process.exit(0);
})().catch((e) => {
  console.error('E2E test failed:', e);
  process.exit(1);
});
