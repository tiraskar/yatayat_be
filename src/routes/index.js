const express = require('express');
const logger = require('../utils/logger');

const apiRouter = require('./api');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'Memebership System on Server'
  });
});

router.use('/api', apiRouter);

// this endpoint should not be exposed to anyone
// should be blocked with nginx or similar
router.get('/abc-xyz/logs', (req, res, next) => {
  const { query } = req;

  const validLevels = ['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'];
  const newLevel = query.level || '';

  if (validLevels.indexOf(newLevel) == -1) {
    return res.status(400).json({
      message: 'invalid Request'
    });
  }

  console.log('Updaing Log Level ', { newLevel });
  // we are using error here as, error will log on every log level
  logger.error('Updaing Log Level', { newLevel });

  logger.level = newLevel;

  res.status(200).json({
    message: 'Updated'
  });
});

module.exports = router;
