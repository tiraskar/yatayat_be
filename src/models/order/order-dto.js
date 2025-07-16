// this is for validations and stuffs
const Joi = require('joi');

const CreateOrderDTO = Joi.object({
  carts: Joi.array().items(Joi.object()).required(),
  is_online_payment: Joi.boolean().allow()
}).unknown(true);

const UpdateOrderDTO = Joi.object({
  carts: Joi.array().items(Joi.object())
}).unknown(true);

const ConfirmOrderPaymentDTO = Joi.object({
  booking_id: Joi.string(),
  return_url: Joi.string()
}).unknown(true);

module.exports = {
  CreateOrderDTO,
  UpdateOrderDTO,
  ConfirmOrderPaymentDTO
};
