require('dotenv').config();
const express = require('express');
const router = express.Router();
const path = require('path');
const rootDir = process.cwd();

// ------------------------------------------------
const webConfig = { wsServer: `ws://${process.env.URL}:${process.env.PORT_WS}`, stunServer: [`stun:${process.env.URL}:${process.env.PORT_STUN}`] };
// ------------------------------------------------

router.get('/config/config.js', (req, res) => {
  res.set('Content-Type', 'text/javascript');
  res.status(200);
  res.send(`export const config = ${JSON.stringify(webConfig)};\n// Created automatically by server/server-http.js`);
});

router.get('/favicon.ico', (req, res) => {
  res.sendFile(`${rootDir}${path.sep}/public/img/favicon.ico`);
});

router.get('/*/*', (req, res) => {
  res.sendFile(`${rootDir}${path.sep}/public${req.url}`);
});

router.get('/*', (req, res) => {
  res.sendFile(`${rootDir}${path.sep}/public/index.html`);
});

module.exports = router;
