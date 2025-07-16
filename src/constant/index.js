const COOKIE_NAMES = {
  MEMBERSHIP_USER_ACCESS: 'MEMBERSHIP_USER_ACCESS',
  MEMBERSHIP_USER_REFRESH: 'MEMBERSHIP_USER_REFRESH',
  MEMBERSHIP_ADMIN_ACCESS: 'MEMBERSHIP_ADMIN_ACCESS',
  MEMBERSHIP_ADMIN_REFRESH: 'MEMBERSHIP_ADMIN_REFRESH'
};

const plainResponseMessages = require('./messages/plain');
const DynamicMessages = require('./messages/dynamic');

module.exports = { COOKIE_NAMES, plainResponseMessages, DynamicMessages };
