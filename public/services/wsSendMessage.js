import { globals } from '../js/globals.js';

const wsSendMessage = ({ command, message }) => {
  globals.wsSocket && globals.wsSocket.emit(command, message);
};

export { wsSendMessage };
