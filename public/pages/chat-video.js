import { globals } from '../js/globals.js';
import { webcamStop, webcamStart, showLog } from '../js/common.js';
import { wsSendChatMessage } from '../js/functions/appWsFunctions.js';
import { getControls, getDisplayName } from '../js/functions/appTools.js';

const onEnter = ({ page }) => {
  const controls = globals?.pages?.[page]?.controls;

  if (controls.videoLocal) {
    webcamStart(controls.videoLocal).then((result) => {
      if (!result) {
        showLog('Local video for user ' + getDisplayName() + ' error', 'error');
      }
      return result;
    }).catch((error) => {
      showLog('Error accessing media devices. ' + JSON.stringify(error), 'error');
    });
  }
};

const onExit = ({ page }) => {
  const controls = globals.pages[page].controls;
  controls.videoLocal && webcamStop(controls.videoLocal);
};

const onInit = ({ page }) => {
  globals.pages[page].controls = getControls(page);
  globals.pages[page].controls.buttonSend.addEventListener('click', (e) => onSendMesage());
};

const onSendMesage = () => {
  wsSendChatMessage({ message: globals.pages[globals.currentPage].controls.inputMessage.value, to: globals.connectedWith.to });
};

// ------------------------------------------------------------------------------------
// Standar init - Not modify
// ------------------------------------------------------------------------------------
const init = (props) => { };
export default { init, onExit, onEnter, onInit };
