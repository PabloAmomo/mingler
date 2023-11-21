import { alertMessage, getString } from '../js/common.js';
import { globals } from '../js/globals.js';
import { io } from '../libs/socket.io/socket.io.esm.min.js';
import { wsConnected, wsDisconnect, wsStartOffer } from '../js/functions/appWsFunctions.js';
import { wsSendAccept } from './wsSendAccept.js';
import { getDisplayName } from '../js/functions/appTools.js';
import { getConnectionState } from '../js/functions/appStates.js';

const wsJoin = ({ onConnect, from, url, onStateChange, readyToAccept = () => true, noAvailables }) => {
  //
  const displayname = getDisplayName();

  onStateChange('connecting');

  try {
    globals.wsSocket && globals.wsSocket.disconnect();
  } catch (error) {}

  const runOnError = () => {
    onStateChange('connection-error');
  };

  try {
    globals.wsSocket = io.connect(url);
  } catch (error) {
    runOnError({ description: 0, context: {}, type: 'Connect' });
    return;
  }

  const socket = globals.wsSocket;

  // Available user for connection
  socket.on('availables', (data) => {
    if (data.availables && data.availables.length !== 0) {
      wsStartOffer({ to: data.availables[0] });
      return;
    }
    noAvailables && noAvailables();
  });

  // Offer received
  socket.on('offer', (data) => {
    if (readyToAccept && !readyToAccept({ ...data, command: 'offer' })) return;
    wsSendAccept({ data, ...data, to: data.from, from, displayname });
  });

  // Offer accepted
  socket.on('accepted', (data) => {
    if (readyToAccept && !readyToAccept({ ...data, command: 'accepted' })) return;
    const to = data.from;
    if (globals.offerCache[to] && globals.offerCache[to].peerConnection && !globals.offerCache[to].peerConnection.currentRemoteDescription) {
      globals.offerCache[to].peerConnection.setRemoteDescription(data.answer);
    }
    wsConnected({ to: data.from, displayname: data.displayname });
  });

  // Candidate received
  socket.on('candidate', (data) => {
    if (readyToAccept && !readyToAccept({ ...data, command: 'candidate' })) return;
    if (globals.offerCache[data.from] && globals.offerCache[data.from].peerConnection) {
      globals.offerCache[data.from].peerConnection.addIceCandidate(data.candidate).catch((error) => {
        wsDisconnect();
        runOnError(error);
      });
    }
  });

  // Connection Success
  socket.on('connect', () => {
    if (!socket.connected) {
      runOnError({ description: 0, context: {}, type: 'ConnectionError' });
      return;
    }
    socket.emit('join', { from, displayname });
    onStateChange('connected');
    onConnect && onConnect();
  });

  // Connection Error
  socket.on('connect_error', (error) => {
    wsDisconnect();
    runOnError(error);
  });

  // Connection Failed
  socket.on('connect_failed', (error) => {
    wsDisconnect();
    runOnError(error);
  });

  // Close
  socket.on('close', (data) => {
    const state = getConnectionState();
    if (state !== 'disconnected' && state !== 'connection-error') {
      alertMessage(getString('sorry-chat-closed', { displayname: data.displayname }), 'error');
    }
    onStateChange('disconnected');
    wsDisconnect(false);
  });

  // Disconnect
  socket.on('disconnect', () => {
    onStateChange('disconnected');
    wsDisconnect();
  });
};

export { wsJoin };
