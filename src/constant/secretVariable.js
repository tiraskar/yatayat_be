const dotenv = require('dotenv');
dotenv.config();

const secretVariable = {
  port: 4100,
  dbUri: process.env.DB_URI,
  dbName: process.env.DB_NAME,
  saltWorkFactor: 10
};

module.exports = secretVariable;
