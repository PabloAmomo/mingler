import { createToast } from './functions/appToast.js';
import { globals } from './globals.js';
import * as icons from './functions/appIcons.js';
import i18n from '../i18n/i18n.js';
import { getDisplayName, preChangePage } from './functions/appTools.js';

// ------------------------------------------------------------------------------------
// COMMON FUNCTIONS (NOT ADD FUNCTION HERE)
// ------------------------------------------------------------------------------------
function makeid (length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

const createDiv = (classList, innerHTML) => {
  const divEl = document.createElement('div');
  divEl.classList.add(...classList);
  innerHTML && (divEl.innerHTML = innerHTML);
  return divEl;
};

const alertMessage = (message, type = 'error', tag) => {
  createToast({ message, type, timeout: 5000, tag });
};

const webcamStop = (videoElement) => {
  const streamObject = videoElement.srcObject;
  if (!streamObject) return;
  streamStop(streamObject);
  videoElement.srcObject = null;
  videoElement.removeAttribute('src');
};

const webcamStart = async (videoElement) => {
  if (navigator.mediaDevices.getUserMedia) {
    return await navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        videoElement.srcObject = stream;
        return true;
      })
      .catch((error) => {
        showLog(`Error accessing media devices. ${JSON.stringify(error)}`, 'error');
        return false;
      });
  }
  return false;
};

const streamStop = (stream) => {
  const stopTracks = (tracks) => {
    tracks.forEach((track) => {
      track.stop();
      stream.removeTrack(track);
    });
  };
  if (stream) {
    stopTracks(stream.getAudioTracks());
    stopTracks(stream.getVideoTracks());
    stream = null;
  }
};

const initialize = ({ onInit }) => {
  // Set title
  document.title = getString('title-app');

  // Show log message
  showLog('App Started!');

  // User name defined?
  if (getDisplayName() === '') {
    document.body.classList.add('no-displayname');
  }

  // Get pages from index.html
  let pages = [];
  document.querySelectorAll('.page').forEach((el) => {
    const defaultPage = el.getAttribute('data-default-page');
    const name = el.id.replace('page-', '');
    if (defaultPage === 'true') {
      pages = [name, ...pages];
    } else {
      pages.push(name);
    }
  });

  // Replace Templates
  document.querySelectorAll('[data-use-template]').forEach((el) => {
    const id = el.getAttribute('data-use-template');
    const variables = JSON.parse((el.getAttribute('data-variables') ?? '{}').replace(/'/g, '"') ?? {});
    let elHTML = document.querySelector(`#${id}`).cloneNode(true).innerHTML;
    let dataPage = false;
    Object.keys(variables).forEach((key) => {
      if (key === 'data-page') dataPage = true;
      elHTML = elHTML.replace(`{${key}}`, variables[key]);
    });
    if (!dataPage) elHTML = elHTML.replace('data-page="{data-page}"', '');
    el.outerHTML = elHTML;
  });

  // Replace Icons
  document.querySelectorAll('[data-icon]').forEach((el) => {
    el.innerHTML = icons[el.getAttribute('data-icon')];
  });

  // Set labels
  i18n.setLabels();

  // Import pages
  let count = pages.length;
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    import(`../pages/${page}.js`)
      .then((m) => {
        count--;

        globals.pages[page] = { page: m.default };

        m.default.init({ page });
        m.default.onInit && m.default.onInit({ page });

        if (count === 0) {
          document.body.classList.remove('initializing');
          onInit && onInit(true);
        }
      })
      .catch((e) => {
        document.body.classList.remove('initializing');
        onInit && onInit(false, e);
        showLog(e, 'error');
      });
  }

  // Add page buttons event listener to change page
  document.querySelectorAll('[data-page]').forEach((el) => {
    el.addEventListener('click', (e) => {
      changePage(e.currentTarget.getAttribute('data-page'));
    });
  });

  initialRoute(pages);
};

const initialRoute = (pages) => {
  let page = pages[0];
  for (let i = 0; i < pages.length; i++) {
    if (window.location.pathname.toLowerCase().startsWith(`/${pages[i]}`.toLowerCase())) {
      page = pages[i];
      break;
    }
  }
  changePage(page);
};

const changePage = (page) => {
  if (globals.currentPage === page) return;
  if (!preChangePage || (preChangePage && !preChangePage(page))) changeToPage(page);
  globals.currentPage = page;
};

const changeToPage = (page) => {
  const keys = Object.keys(globals.pages);
  let onEnter;

  // First remove page and call onExit hook (Hide old page)
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (key.toLowerCase() !== page.toLowerCase()) {
      document.getElementById(`page-${key}`).classList.remove('flex');
      if (document.body.classList.contains(`page-${key}`)) {
        document.body.classList.remove(`page-${key}`);
        globals.pages[key].page.onExit({ page: key });
      }
    } else if (key === page) {
      onEnter = globals.pages[key].page.onEnter;
    }
  }

  // Show new page
  document.getElementById(`page-${page}`).classList.add('flex');
  document.body.classList.add(`page-${page}`);

  const { protocol, host, search } = window.location;
  window.history.pushState({}, '', `${protocol}//${host}/${page === 'home' ? '' : page}${search}`);

  // If page has onEnter hook, call it
  if (onEnter) onEnter && onEnter({ page });
};

const changeLanguage = (language) => {
  i18n.setLanguage(language);
};

const getString = (key, variables) => i18n.getString(key, variables);

const addZero = (value) => {
  return value < 10 ? `0${value}` : value;
};

const getTime = (date) => {
  const d = date ? new Date(date) : new Date();
  return `${addZero(d.getHours())}:${addZero(d.getMinutes())}:${addZero(d.getSeconds())}`;
};

const getShortDateString = (date) => {
  const d = date ? new Date(date) : new Date();
  return `${d.getFullYear()}-${addZero(d.getMonth() + 1)}-${addZero(d.getDate())}`;
};
// levels: log, error, warn, info, debug
const showLog = (message, level = 'log') => {
  console.log(message);
  try {
    window.console[level](`${getShortDateString()} ${getTime()}: ${typeof message === 'object' ? JSON.stringify(message) : message}`);
  } catch (error) {
    console.log(error);
    console.log(' -> ', message);
  }
};

export {
  createDiv,
  alertMessage,
  changeLanguage,
  changeToPage,
  getString,
  initialize,
  makeid,
  showLog,
  streamStop,
  webcamStart,
  webcamStop
};
