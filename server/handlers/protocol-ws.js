const { config } = require('../config');
const { globals } = require('../globals');
const { wsSendClose } = require('../services/wsSendClose');
const { wsSendMessage } = require('../services/wsSendMessage');

const startWsServer = (app, port) => {
  const io = require('socket.io')(
    app.listen(port, () => {
      console.log(`Socket.io running on port ${port}`);
    }),
    config.ws['cors-config']
  );

  io.on('connection', (socket) => {
    console.log('* New connection', socket.id);

    socket.on('join', (data) => {
      globals.wsConnections.push({ socketId: socket.id, ...data });
      console.log(`- User [${data.from}] joined - total users: ${globals.wsConnections.length}`);
    });

    socket.on('get-availables', (data) => {
      const conn = findConnection(socket);
      const availables = findAvailables(socket) ?? [];
      wsSendMessage(socket, 'availables', { to: conn.from }, { availables }, `  <- return users availables ${JSON.stringify(availables) ?? '[]'} to [${conn.from}]`);
    });

    socket.on('connected-with', (data) => {
      const conn = findConnection(socket);
      conn && (conn.connectedWith = data.to);
      console.log(`- User [${conn?.displayname ?? 'not found'}-${conn?.from ?? 'not found'}] connected with ${data.to}`);
    });

    socket.on('offer', (data) => {
      wsSendMessage(socket, 'offer', data, { offer: data.offer }, `  -> [${data.displayname}-${data.from}] offer to [${data.to}] to connect`);
    });

    socket.on('accepted', (data) => {
      wsSendMessage(socket, 'accepted', data, { answer: data.answer }, `  <- [${data.displayname}-${data.from}] accept offer for connect to [${data.to}]`);
    });

    socket.on('candidate', (data) => {
      wsSendMessage(socket, 'candidate', data, { candidate: data.candidate }, `  <- [${data.displayname}-${data.from}] candidate for [${data.to}]`);
    });

    socket.on('close', (data) => {
      wsSendMessage(socket, 'close', data, {}, `  <- [${data.displayname}-${data.from}] close for [${data.to}]`);
    });

    socket.on('disconnect', () => {
      const conn = findConnection(socket);
      globals.wsConnections = globals.wsConnections.filter((connection) => connection.socketId !== socket.id);
      console.log(`- User disconnected [${conn.from}] - total users: ${globals.wsConnections.length}`);

      const targetConnection = globals.wsConnections.find((connection) => connection.connectedWith === conn.from);
      if (targetConnection) wsSendClose(socket, targetConnection, conn.from, conn.displayname);
    });
  });

  function findConnection (socket) {
    return globals.wsConnections.find((connection) => connection.socketId === socket.id);
  }

  function findAvailables (socket) {
    const conn = globals.wsConnections.find((connection) => connection.socketId === socket.id);
    const availables = [];
    for (let i = 0; i < globals.wsConnections.length; i++) {
      const connection = globals.wsConnections[i];
      if (connection.from !== conn.from && (connection.connectedWith ?? '') === '') availables.push(connection.from);
    }
    return availables;
  }
};

exports.startWsServer = startWsServer;
