const dotenv = require('dotenv');

const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { WebSocketServer } = require('ws');

dotenv.config();

const errorHandler = require('./config/errorHandler');
const routes = require('./routes');
const secretVariable = require('./constant/secretVariable');
const logger = require('./utils/logger');
const connectToDb = require('./config/db.config');
const { corsOption } = require('./config/cors.config');
const socket_port = secretVariable.socketPort;

// epxress server setup
(async () => {
  try {
    //  express server intialized
    const app = express();

    require("./cron");

    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    app.use(express.static(path.resolve(__dirname, '../assets')));
    app.use('/assets', express.static(path.resolve(__dirname, '../assets')));
    app.use(cors(corsOption));

    app.use(routes);
    app.use(errorHandler);

    // listening the app
    app.listen(secretVariable.port, () => {
      try {
        // connecting to db
        connectToDb(process.env.DB_URI, secretVariable.dbName);
      } catch (error) {
        logger.error(error);
      }
    });

    // Initialize WebSocket server
    const wss = new WebSocketServer({ port: socket_port });

    // Use the handler for WebSocket connections
    // wss.on('connection', handleWebSocketConnection);
  } catch (error) {
    logger.error(error);
  }
})();
