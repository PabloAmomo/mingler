import { globals } from '../js/globals.js';
import { wsConnected } from '../js/functions/appWsFunctions.js';
import { wsCreatePeer } from './wsCreatePeer.js';
import { wsSendMessage } from './wsSendMessage.js';
import { getDisplayName } from '../js/functions/appTools.js';

const wsSendAccept = ({ data, to, offer, from }) => {
  const displayname = getDisplayName();
  from = from || displayname;

  const sendAccept = async () => {
    const peerConnection = wsCreatePeer({ to, from, displayname });
    await peerConnection.setRemoteDescription(offer);
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    globals.answerCache[to] = { peerConnection, answer };
    wsSendMessage({
      command: 'accepted',
      message: { from, to, answer, displayname }
    });
    wsConnected({ to, displayname: data.displayname });
  };
  sendAccept();
};

export { wsSendAccept };
