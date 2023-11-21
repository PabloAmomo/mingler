import { globals } from '../js/globals.js';
import { wsSendChatMessage } from '../js/functions/appWsFunctions.js';
import { getControls } from '../js/functions/appTools.js';

const onEnter = ({ page }) => {
  // your code here
};

const onExit = ({ page }) => {
  // your code here
};

const onInit = ({ page }) => {
  globals.pages[page].controls = getControls(page);
  globals.pages[page].controls.buttonSend.addEventListener('click', (e) => onSendMesage());
  // your code here
};

const onSendMesage = () => {
  wsSendChatMessage({ message: globals.pages[globals.currentPage].controls.inputMessage.value, to: globals.connectedWith.to });
};

// ------------------------------------------------------------------------------------
// Standar init - Not modify
// ------------------------------------------------------------------------------------
const init = (props) => {};
export default { init, onExit, onEnter, onInit };
