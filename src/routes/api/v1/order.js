const express = require('express');
const adminAuth = require('../../../auth/admin-auth');
const userAuth = require('../../../auth/user-auth');

const orderController = require('../../../controllers/api/v1/order');

const router = express.Router();

router.post('/create-order', userAuth, orderController.createNewOrder);

router.post('/capture-order', userAuth, orderController.captureNewOrder);

router.post('/paypal-card-payment', userAuth, orderController.paypalCardPayment);

module.exports = router;
