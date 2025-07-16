const Joi = require('joi');

const OTPVerifyDTO = Joi.object({
  code: Joi.string().length(4)
});

const EmailOTPVerifyDTO = Joi.object({
  code: Joi.string().length(4).required(),
  token: Joi.string().required()
});

const ForgetPasswordDTO = Joi.object()
  .keys({
    // phoneNumber: Joi.string(),
    email: Joi.string().email()
  })
  // .xor('phoneNumber', 'email', )
  .xor('email')
  // .description('Either phoneNumber or email required');
  .description('email required');

const ResetPasswordDTO = Joi.object()
  .keys({
    token: Joi.string(),
    code: Joi.string().length(4).required(),
    password: Joi.string().min(7).max(50).required()
  })
  .description('Code and Password required');

const OTPRequestDTO = {
  OTPVerifyDTO,
  EmailOTPVerifyDTO,
  ForgetPasswordDTO,
  ResetPasswordDTO
};

module.exports = OTPRequestDTO;
