const OrderService = require('../../../../service/order');
const logger = require('../../../../utils/logger');

const createNewOrder = async (req, res, next) => {
  try {
    const user = req.user;

    const response = await OrderService.createNewOrder(user, req.body);

    res.status(201).json({
      message: 'Order created successfully.',
      response
    });
  } catch (error) {
    logger.error('Error on Order Creation', error);
    next(error);
  }
};

const captureNewOrder = async (req, res, next) => {
  try {
    const user = req.user;

    const response = await OrderService.captureNewOrder(user, req.body);

    res.status(201).json({
      message: 'Order captured successfully.',
      response
    });
  } catch (error) {
    logger.error('Error on Order Creation', error);
    next(error);
  }
};

const paypalCardPayment = async (req, res, next) => {
  try {
    const data = req.body;
    const user = req.user;

    const response = await OrderService.paypalCardPayment(data, user);
    res.status(201).json({
      message: 'Payment successful',
      response
    });

  } catch (error) {
    logger.error('Error on Order Creation', error);
    next(error);
  }
};

module.exports = {
  createNewOrder,
  captureNewOrder,
  paypalCardPayment
};
