import { getControls } from '../js/functions/appTools.js';
import { globals } from '../js/globals.js';

const onEnter = ({ page }) => {
  // your code here
};

const onExit = ({ page }) => {
  // your code here
};

const onInit = ({ page }) => {
  globals.pages[page].controls = getControls(page);
  // your code here
};

// ------------------------------------------------------------------------------------
// Standar init - Not modify
// ------------------------------------------------------------------------------------
const init = (props) => {};
export default { init, onExit, onEnter, onInit };
