import { streamStop } from '../js/common.js';
import { config } from '../config/config.js';
import { globals } from '../js/globals.js';
import { wsSendMessage } from './wsSendMessage.js';

const wsCreatePeer = ({ to, from, displayname }) => {
  const servers = { stunServer: [{ urls: config.stunServer }] };
  const peerConnection = new window.RTCPeerConnection(servers);
  const pageControls = globals.pages['chat-video'].controls;
  const chatVideo = globals.currentPage === 'chat-video';

  peerConnection._tracks = [];
  peerConnection.closeTracks = () => {
    for (let i = 0; i < peerConnection._tracks.length; i++) {
      if (peerConnection.signalingState === 'closed') break;
      peerConnection.removeTrack(peerConnection._tracks[i]);
      peerConnection.close();
    }
  };

  if (chatVideo) {
    if (pageControls.videoRemote) pageControls.videoRemote.srcObject = new window.MediaStream();
    if (pageControls.videoLocal && pageControls.videoLocal.srcObject) {
      pageControls.videoLocal.srcObject.getTracks().forEach((track) => {
        const sender = peerConnection.addTrack(track, pageControls.videoLocal.srcObject);
        peerConnection._tracks.push(sender);
      });
    }
  }

  peerConnection.ontrack = async (event) => {
    if (pageControls.videoRemote && chatVideo) {
      event.streams[0].getTracks().forEach((track) => {
        pageControls.videoRemote.srcObject.addTrack(track);
      });
    }
  };

  peerConnection.oninactive = () => {
    if (pageControls.videoRemote && chatVideo) {
      streamStop(pageControls.videoRemote.srcObject);
      pageControls.videoRemote.srcObject = null;
      pageControls.videoRemote.removeAttribute('src');
    }
    peerConnection.close();
  };

  peerConnection.onicecandidate = async (event) => {
    if (event.candidate) wsSendMessage({ command: 'candidate', message: { to, from, displayname, candidate: event.candidate } });
  };

  peerConnection.datachannel = peerConnection.createDataChannel('sendDataChannel');
  peerConnection.datachannel.onopen = () => onSendChannelStateChange(peerConnection.datachannel, to, 'id-1');
  peerConnection.ondatachannel = (event) => {
    peerConnection.datachannel = event.channel;
    peerConnection.datachannel.onopen = () => onSendChannelStateChange(peerConnection.datachannel, to, 'id-2');
  };

  return peerConnection;
};

function onSendChannelStateChange (dataChannel, to, id) {}

export { wsCreatePeer };
