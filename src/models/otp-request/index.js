// this model will keep track of the messages a user has requested
// here we will save the otp code as well
// based on this model and the no of document on this collection for the user we will
// implement limit on the no of sms request he can make on one day

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const otpRequestSchema = new Schema({
  admin: {
    type: Schema.Types.ObjectId,
    ref: 'admin',
    index: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    index: true
  },
  code: {
    type: String
  },
  codeType: {
    type: String,
    enum: [
      'PHONE_VERIFICATION',
      'EMAIL_VERIFICATION',
      'PASSWORD_RESET',
      'PASSWORD_RESET_EMAIL',
      'CANCEL_REQUEST'
    ],
    index: true
  },
  requestedDate: {
    type: Date,
    default: Date.now,
    index: true
  }
});

const OTPRequest = mongoose.model('otpRequest', otpRequestSchema);

module.exports = OTPRequest;
