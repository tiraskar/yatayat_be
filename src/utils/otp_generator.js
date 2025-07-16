const crypto = require('crypto');

const generateOtp = () => {
  const num = crypto.randomInt(1000000);
  const verificationCode = num.toString().padStart(6, '0');
  return verificationCode;
};

module.exports = generateOtp;
