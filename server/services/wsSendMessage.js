const { globals } = require('../globals');

const wsSendMessage = (socket, command, data, include, log) => {
  const conn = globals.wsConnections.find((_conn) => _conn.from === data.to);

  if (conn) {
    console.log(log);
    const message = {
      ...include,
      from: data.from,
      displayname: data.displayname
    };
    if (conn.socketId === socket.id) {
      socket.emit(command, message);
    } else {
      socket.to(conn.socketId).emit(command, message);
    }
  }
};

module.exports = { wsSendMessage };
