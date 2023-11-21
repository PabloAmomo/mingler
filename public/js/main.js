import { initialize, showLog } from './common.js';
import { applicationInit } from './functions/appTools.js';

function init (success, error) {
  if (!success) {
    showLog(`Initialization error: ${JSON.stringify(error)}`, 'error');
    return;
  }
  // Application custom initialization
  applicationInit && applicationInit();
  if (!applicationInit) {
    showLog('Initialization: Not exist applicationInit !!!', 'info');
  }
}

// ------------------------------------------------------------------------------------
// Entry point
// ------------------------------------------------------------------------------------
window.onload = function () {
  initialize({ onInit: init });
};
