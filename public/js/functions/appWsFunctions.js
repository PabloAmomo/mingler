import { alertMessage, changeToPage, getString } from '../common.js';
import { config } from '../../config/config.js';
import { globals } from '../globals.js';
import { wsJoin } from '../../services/wsJoin.js';
import { wsSendMessage } from '../../services/wsSendMessage.js';
import { wsSendOffer } from '../../services/wsSendOffer.js';
import { addMessage, cleanResources, getDisplayName } from './appTools.js';
import { getInMeetingState, setConnectionState, setInMeetingState } from './appStates.js';

const wsConnectToTimeout = 2500;

const wsReceiveMessage = (event) => {
  const { message, displayname } = JSON.parse(event.data ?? {});
  if (globals.pages?.[globals.currentPage]?.controls?.messagesWindow) {
    addMessage({ window: globals.pages[globals.currentPage].controls.messagesWindow, message, from: displayname });
  }
};

const wsSendChatMessage = ({ to, message }) => {
  const rtcData = JSON.stringify({ displayname: getDisplayName(), message });
  const rtcConm = globals?.offerCache?.[to]?.peerConnection?.datachannel || globals?.answerCache?.[to]?.peerConnection?.datachannel;
  rtcConm.send(rtcData);
  const controls = globals.pages[globals.currentPage].controls;
  addMessage({ window: controls.messagesWindow, input: controls.inputMessage, message, from: getDisplayName() });
};

const wsConnected = ({ to, displayname }) => {
  const setOnMessage = (datachannel) => {
    if (!datachannel) return;
    datachannel.onmessage = (event) => wsReceiveMessage(event);
  };

  setOnMessage(globals.offerCache?.[to]?.peerConnection?.datachannel);
  setOnMessage(globals.answerCache?.[to]?.peerConnection?.datachannel);

  clearTimeout(globals.offerTimeout);
  document.body.classList.remove('offering');
  globals.connectedWith = { to, displayname };
  setInMeetingState(true);
  wsSendMessage({
    command: 'connected-with',
    message: { to }
  });
};

const wsDisconnect = (sendCloseEvent = true, onConnect) => {
  //
  const to = globals.connectedWith.to;
  if (globals.wsSocket?.connected && to && sendCloseEvent) {
    wsSendMessage({ command: 'close', message: { from: globals.localId, displayname: getDisplayName(), to } });
  }

  document.querySelectorAll('[data-available-in-meeting]').forEach((el) => {
    if (el.getAttribute('data-available-in-meeting') === 'true') el.setAttribute('disabled', 'disabled');
  });

  wsPeerDisconnected({ to });

  globals.connectedWith = { to: '', displayname: '' };
  setInMeetingState(false);

  cleanResources();

  globals.wsSocket && globals.wsSocket?.connected && globals.wsSocket.disconnect();

  if (getDisplayName() === '') return;
  document.body.classList.remove('no-displayname');

  wsJoinAndThen({
    onConnect: () => {
      globals.currentPage && changeToPage(globals.currentPage);
      onConnect && onConnect();
    }
  });
};

const wsPeerDisconnected = ({ to }) => {
  globals.answerCache[to]?.peerConnection?.closeTracks && globals.answerCache[to]?.peerConnection.closeTracks();
  globals.offerCache[to]?.peerConnection?.closeTracks && globals.offerCache[to]?.peerConnection.closeTracks();
  delete globals.offerCache[to];
  delete globals.answerCache[to];
};

const wsStartOffer = ({ to }) => {
  document.body.classList.add('offering');

  globals.offerTimeout = setTimeout(() => {
    clearTimeout(globals.offerTimeout);
    wsPeerDisconnected({ to });
    alertMessage(getString('sorry-cant-next-chat'), 'info');
    document.body.classList.remove('offering');
  }, wsConnectToTimeout);

  const onConnect = () => {
    wsSendOffer({ to, from: globals.localId });
  };
  if (!globals?.wsSocket || !globals.wsSocket?.connected) {
    wsJoinAndThen({ onConnect });
  } else {
    onConnect();
  }
};

const wsReadyToAccept = (data) => {
  let accept = true;
  const inMeeting = getInMeetingState();
  // We are not in chat page
  if (!['chat-video', 'chat-text'].includes(globals.currentPage)) accept = false;
  // Received accepted command but we didn't send offer
  if (data.command === 'accepted' && !globals.offerCache[data.from]) accept = false;
  // Received candidate command but the remote peer is not the connected one or we are not in meeting
  if (data.command === 'candidate' && (data.from !== globals.connectedWith.to || !inMeeting)) accept = false;
  // Receive Offer but we are in meeting
  if (data.command === 'offer' && inMeeting) accept = false;
  //
  return accept;
};

const wsJoinAndThen = ({ onConnect }) => {
  wsJoin({
    onConnect,
    from: globals.localId,
    displayname: getDisplayName(),
    url: config.wsServer,
    onStateChange: (state) => setConnectionState(state),
    readyToAccept: wsReadyToAccept,
    noAvailables: () => {
      alertMessage(getString('sorry-no-availables'), 'info');
    }
  });
};

export { wsSendChatMessage, wsConnected, wsDisconnect, wsStartOffer, wsReceiveMessage };
