// this is for validations and stuffs
const Joi = require('joi');

const CreateUserDTO = Joi.object({
  fullName: Joi.string().min(7).max(30),
  phoneNumber: Joi.string().length(10).regex(/^\d+$/),
  // gender: Joi.string().valid('Male', 'Female', 'Other'),
  email: Joi.string().email().required(),
  password: Joi.string().min(7).max(50),
  fcmToken: Joi.string().allow()
});

const LineAuthDTO = Joi.object({
  id_token: Joi.string().required()
  // state: Joi.string().required(),
  // redirect_uri: Joi.string().required()
});

const UserLoginDTO = Joi.object().keys({
  // phoneNumber: Joi.string()
  // 	.length(10)
  // 	.regex(/^\d+$/)
  // 	.messages({
  // 		'string.pattern.base': `"phoneNumber" should contains numbers only`
  // 	})
  // 	.description('either phoneNumber or Email'),
  email: Joi.string().email().required().description('email is missing.'),
  password: Joi.string().required().description('password is missing.'),
  fcmToken: Joi.string().allow()
});

module.exports = {
  CreateUserDTO,
  LineAuthDTO,
  UserLoginDTO
};
