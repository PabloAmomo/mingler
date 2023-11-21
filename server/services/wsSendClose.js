const wsSendClose = (socket, connection, from, displayname) => {
  connection.connectedWith = { to: '', displayname: '' };
  socket.to(connection.socketId).emit('close', {
    from,
    displayname
  });
  console.log(`- User [${displayname}-${from}] disconnected - Send disconnect to [${connection.displayname}-${connection.from}]`);
};

module.exports = { wsSendClose };
