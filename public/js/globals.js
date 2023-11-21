import { makeid } from './common.js';

const globals = {
  wsSocket: null,
  offerCache: {},
  answerCache: {},
  pages: {}, // { page: ..., controls: ...}
  currentPage: null,
  connectedWith: { to: '', displayname: '' },
  offerTimeout: 0,
  localId: makeid(20)
};

export { globals };
