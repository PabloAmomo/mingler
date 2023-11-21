import { wsSendMessage } from '../../services/wsSendMessage.js';
import { createDiv, streamStop } from '../common.js';
import { globals } from '../globals.js';
import { setConnectionState } from './appStates.js';
import { wsDisconnect } from './appWsFunctions.js';

const preChangePage = (page) => {
  // You can add here any code to execute before change page
  wsDisconnect && wsDisconnect();
  if (document.getElementById(`page-${page}`).getAttribute('data-need-connection') !== 'true') {
    setConnectionState('disconnected');
    return false;
  }
  return true;
};

const applicationInit = () => {
  const displayname = window.localStorage.getItem('displayname');
  if (displayname) {
    document.getElementById('main-input-display-name').value = displayname;
  }

  document.getElementById('main-input-display-name').addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
      document.getElementById('main-button-display-name').click();
    }
  });

  document.getElementById('main-button-display-name')?.addEventListener('click', (e) => {
    const _displayname = document.getElementById('main-input-display-name').value;
    if (_displayname) {
      window.localStorage.setItem('displayname', _displayname);
      const url = new URL(window.location);
      url.searchParams.set('displayname', _displayname);
      window.history.pushState({}, '', url.href);
      wsDisconnect();
    }
  });

  document.querySelectorAll('.button-next-chat').forEach((el) => {
    el.addEventListener('click', (e) => {
      if (document.body.classList.contains('offering')) return;
      wsDisconnect(true, () => {
        wsSendMessage({ command: 'get-availables', message: { from: globals.localId, displayname: getDisplayName() } });
      });
    });
  });

  document.querySelectorAll('.button-disconnect').forEach((el) => {
    el.addEventListener('click', (e) => {
      wsDisconnect();
    });
  });
};

const getDisplayName = () => new URL(window.location.href).searchParams.get('displayname') ?? '';

const getControls = (page) => {
  const pageEl = document.querySelector(`#page-${page}`);
  return {
    messagesWindow: pageEl.querySelector('.chat-messages'),
    inputMessage: pageEl.querySelector('.chat-input-message'),
    buttonSend: pageEl.querySelector('.button-send-message'),
    buttonNext: pageEl.querySelector('.button-next-chat'),
    videoLocal: pageEl.querySelector('.video-local-container video'),
    videoRemote: pageEl.querySelector('.video-remote-container video')
  };
};

const addMessage = ({ from, input, window, message = '' }) => {
  const divContainer = createDiv(['chat-text-message', 'flex-row', 'w-100']);
  divContainer.appendChild(createDiv(['chat-text-message-user', 'bold', 'flex', 'justify-content-center', 'align-items-center'], `${from}:`));
  divContainer.appendChild(createDiv(['chat-text-message-message', 'border-radius-4', 'p-025', 'flex-grow-1', 'ml-05'], (input ? input.value : message)));
  window.appendChild(divContainer);
  if (input) input.value = '';
};

const cleanResources = () => {
  const page = globals.currentPage;
  if (!globals.currentPage) return;

  // Close video connections
  const pageControls = globals?.pages?.[page]?.controls;
  if (pageControls?.videoRemote && pageControls.videoRemote.srcObject) {
    streamStop(pageControls.videoRemote.srcObject);
    pageControls.videoRemote.srcObject = null;
    pageControls.videoRemote.removeAttribute('src');
  }

  // Clear chat
  if (pageControls) {
    pageControls.messagesWindow && (pageControls.messagesWindow.innerHTML = null);
    pageControls.inputMessage && (pageControls.inputMessage.value = '');
  }
};

export { applicationInit, getDisplayName, getControls, addMessage, preChangePage, cleanResources };
