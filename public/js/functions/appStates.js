import * as icons from './appIcons.js';
import { getString } from '../common.js';
import { removeToastByTag } from './appToast.js';
import { getDisplayName } from './appTools.js';
import { globals } from '../globals.js';

const getConnectionState = () => {
  if (document.body.classList.contains('connected')) return 'connected';
  else if (document.body.classList.contains('connection-error')) return 'connection-error';
  else if (document.body.classList.contains('connecting')) return 'connecting';
  else return 'disconnected';
};

const setConnectionState = (state) => {
  document.body.classList.remove('connected', 'connection-error', 'connecting', 'disconnected');
  document.body.classList.add(state);
  document.querySelector('[data-user-id]').innerHTML = state === 'connected' ? getDisplayName() : '';

  document.querySelectorAll('.connection-state').forEach((el) => {
    const elIcon = el.querySelector('[data-icon]');
    const elUser = el.querySelector('[data-user-id]');
    const elState = el.querySelector('.connection-state-text');

    elState.setAttribute('data-label-id', state);
    elState.innerHTML = getString(state);

    elIcon.classList.remove('fill-red', 'fill-black-80', 'fill-green');
    elIcon.setAttribute('data-icon', state);

    switch (state) {
      case 'connected':
        removeToastByTag('platform-disconnected');
        elIcon.classList.add('fill-green');
        elUser.classList.remove('hide');
        break;

      case 'connecting':
        elIcon.classList.add('fill-red');
        elUser.classList.add('hide');
        break;

      default:
        elIcon.setAttribute('data-icon', 'disconnected');
        elIcon.classList.add('fill-black-80');
        elUser.classList.add('hide');
        break;
    }
    elIcon.innerHTML = icons[elIcon.getAttribute('data-icon')];
  });
};

const getInMeetingState = () => {
  return document.body.classList.contains('in-meeting');
};

const setInMeetingState = (inMeeting) => {
  inMeeting ? document.body.classList.add('in-meeting') : document.body.classList.remove('in-meeting');
  document.querySelectorAll('[data-available-in-meeting]').forEach((el) => {
    if (el.getAttribute('data-available-in-meeting') === 'true') {
      inMeeting ? el.removeAttribute('disabled') : el.setAttribute('disabled', 'disabled');
    }
  });

  document.querySelectorAll('.connected-with').forEach((el) => {
    el.innerHTML = globals.connectedWith.displayname ? globals.connectedWith.displayname : getString('nobody');
  });
};

export { getConnectionState, setConnectionState, getInMeetingState, setInMeetingState };
