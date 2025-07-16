const fs = require('fs');
const winston = require('winston');
const { format } = require('winston');
// eslint-disable-next-line import/no-extraneous-dependencies
require('winston-daily-rotate-file');

const GLOBAL = require('../constant/global');

const LOG_LEVEL = {
  INFO: 'info',
  DEBUG: 'debug',
  VERBOSE: 'verbose',
  WARN: 'warn',
  ERROR: 'error'
};

if (!fs.existsSync(GLOBAL.logDir)) {
  fs.mkdirSync(GLOBAL.logDir);
}

const winstonTransports = [
  new winston.transports.Console({
    format: format.combine(format.colorize(), format.simple()),
    level: 'info'
  }),

  new winston.transports.DailyRotateFile({
    format: format.combine(format.timestamp(), format.json()),
    maxFiles: '7d',
    level: LOG_LEVEL.INFO,
    dirname: GLOBAL.logDir,
    datePattern: 'YYYY-MM-DD',
    filename: '%DATE%-debug.log'
  }),

  new winston.transports.DailyRotateFile({
    format: format.combine(format.timestamp(), format.json()),
    maxFiles: '100d',
    level: LOG_LEVEL.ERROR,
    dirname: GLOBAL.logDir,
    datePattern: 'YYYY-MM-DD',
    filename: '%DATE%-error.log'
  })
];

const logger = winston.createLogger({
  transports: winstonTransports
});

logger.stream({
  write: (message) => {
    logger.info(message);
  }
});

logger.stream({
  write: (message) => {
    logger.error(message);
  }
});

module.exports = logger;
