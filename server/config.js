require('dotenv').config();

const config = {
  ws: {
    port: process.env.PORT_WS || 3000,
    'cors-config': {
      cors: { origin: '*' },
      allowEIO3: true
    }
  },
  http: {
    port: process.env.PORT_HTTP || 7000,
    url: process.env.URL || 'localhost'
  }
};

module.exports = { config };
