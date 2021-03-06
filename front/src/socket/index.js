import _ from 'lodash';

import parseMessage from './in';
import {sendMessage, handleOpen, sendToServerCreator} from './out';
// import initSocketContext from './init-context';


export default (url = 'ws://localhost:8082/ws') => (storeApi) => {
  // initSocketContext();

  const socket = new WebSocket(url);

  const sendToServer = sendToServerCreator(socket);

  socket.onopen = () => {
    console.log('Connected');
    const state = storeApi.getState();

    handleOpen(state, sendToServer);
  };

  socket.onclose = () => {
    console.log('Closed');
    storeApi.dispatch({
      type: 'ACK_CLOSE_SOCKET',
      meta: {
        isSocket: true,
        direction: 'IN'
      }
    });
  };

  socket.onmessage = (evt) => {
    const state = storeApi.getState();
    const action = parseMessage(state, evt.data);

    if (!action) {
      return;
    }
    console.log('Received from server', JSON.stringify(action, null, 2));
    storeApi.dispatch(action);
  };

  return next => (action) => {
    if (_.get(action, 'meta.isSocket') && _.get(action, 'meta.direction') === 'OUT') {
      const state = storeApi.getState();

      sendMessage(state, sendToServer, action);
    }

    return next(action);
  };
};
