import { getDisplayName } from '../js/functions/appTools.js';
import { globals } from '../js/globals.js';
import { wsCreatePeer } from './wsCreatePeer.js';
import { wsSendMessage } from './wsSendMessage.js';

const wsSendOffer = ({ to, from }) => {
  const displayname = getDisplayName();
  from = from || displayname;

  const sendOffer = async () => {
    const peerConnection = wsCreatePeer({ to, from, displayname });
    const peerOffer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(peerOffer);
    const offer = peerConnection.localDescription;
    globals.offerCache[to] = { peerConnection, offer };
    wsSendMessage({
      command: 'offer',
      message: { from, to, offer, displayname }
    });
  };
  sendOffer();
};

export { wsSendOffer };
