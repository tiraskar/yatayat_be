const { get } = require('lodash');

const getValue = (object, key, defaultValue = '') => get(object, key, defaultValue);

module.exports = {
  getValue
};
