// ------------------------------------------------
require('dotenv').config();
// ------------------------------------------------
const express = require('express');
const app = express();
// ------------------------------------------------
const { config } = require('./config');
// ------------------------------------------------

// ------------------------------------------------
console.log('--------------------------------------------------------------------------------');
console.log(`Starting in ${process.env.ENVIROMENT} mode`);
console.log('--------------------------------------------------------------------------------');
// ------------------------------------------------

// ------------------------------------------------
// WS Protocol
// ------------------------------------------------
require('./handlers/protocol-ws').startWsServer(app, config.ws.port);
