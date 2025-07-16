const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectToDb = async (dbUrl, dbName) => {
  try {
    await mongoose.connect(dbUrl, {
      dbName
    });

    logger.info('>>> Database Connected Successfully.');
  } catch (error) {
    logger.error(error);
  }

  // logging messages for different status
  mongoose.connection.on('connected', () => {
    logger.info('mongoose connected to db.');
  });

  mongoose.connection.on('error', (err) => {
    logger.info(err.message);
  });

  mongoose.connection.on('disconnected', () => {
    logger.info('mongoose connection is disconnected.');
  });

  // when sigint signal detect close the mongoose databse connection and exit
  process.on('SIGINT', async () => {
    try {
      await mongoose.connection.close();
      process.exit(0);
    } catch (error) {
      logger.error(error);
      process.exit(1);
    }
  });
};

module.exports = connectToDb;
