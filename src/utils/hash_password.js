const bcrypt = require('bcrypt');
const secretVariable = require('../constant/secretVariable');

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(secretVariable.saltWorkFactor);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

const comparePassord = async ({ enteredPassword, dbSavedPassword }) => {
  const isMatch = await bcrypt.compare(enteredPassword, dbSavedPassword);
  return isMatch;
};

export { hashPassword, comparePassord };
