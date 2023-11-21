require('dotenv').config();
const express = require('express');
const { config } = require('./config');

console.log('--------------------------------------------------------------------------------');
console.log(`Starting in ${process.env.ENVIROMENT} mode`);
console.log('--------------------------------------------------------------------------------');

// ------------------------------------------------
// HTTP Protocol
// ------------------------------------------------
const app = express();
const path = require('path');
app.use('/public', express.static(path.resolve(__dirname, '../public')));
app.use('/', require('./handlers/protocol-http'));
app.listen(config.http.port, () => console.log(`Server running on port ${config.http.port} - http://${config.http.url}:${config.http.port}`));
// ------------------------------------------------
