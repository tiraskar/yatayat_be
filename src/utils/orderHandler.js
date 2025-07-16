const paypal = require('@paypal/checkout-server-sdk');
const { client } = require('./paypalClient');

async function createPaypalOrder(data) {
  const request = new paypal.orders.OrdersCreateRequest();

  request.requestBody({
    intent: 'CAPTURE',
    payer: data.payer,
    purchase_units: data.purchase_units,
    payment_source: {
      card: data.payment_source.card
    },
    application_context: {
      return_url: process.env.PAYPAL_RETURN_URL,
      cancel_url: process.env.PAYPAL_CANCEL_URL
    }
  });

  return await client().execute(request);
}

async function capturePaypalOrder(orderId) {
  const request = new paypal.orders.OrdersCaptureRequest(orderId);
  request.requestBody({});

  return await client().execute(request);
}

module.exports = {
  createPaypalOrder,
  capturePaypalOrder
};
