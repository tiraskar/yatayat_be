const crypto = require('crypto');
const uuid = require('uuid');
const moment = require('moment-timezone');

const generateRefId = async () => {
  const randomBytes = crypto.randomBytes(4).toString('hex');
  const timestamp = new Date().getTime().toString();
  const refId = 'Ref-' + timestamp + randomBytes;
  return refId;
};

const generateUUID = async () => {
  return uuid.v4();
};

function getOrderId(order_id) {
  return order_id.substring(0, 6);
}

function getOrderDate(order_date, format) {
  const utcDate = moment.utc(order_date);
  return utcDate.tz('Asia/Kathmandu').format(format);
}

function truncateString(str, num) {
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num) + '...';
}

function formatAmountWithCommas(value) {
  return value.toLocaleString('en-US');
}

module.exports = {
  generateRefId,
  generateUUID,
  getOrderId,
  getOrderDate,
  truncateString,
  formatAmountWithCommas
};
