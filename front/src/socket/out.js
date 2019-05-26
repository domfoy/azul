const outcomingActions = {
  setName: ({name}) => ({
    globalAction: 'CLIENT_ACTION',
    clientAction: {
      type: 'SET_NAME',
      payload: {
        name
      }
    }
  }),
  chat: (state, {payload: {content}}) => ({
    globalAction: 'CLIENT_ACTION',
    clientAction: {
      type: 'CHAT',
      payload: {
        message: content
      }
    }
  }),
  createRoom: (state, {roomName}) => ({
    globalAction: 'CLIENT_ACTION',
    clientAction: {
      type: 'CREATE_ROOM',
      payload: {
        name: roomName,
        userCount: 1,
        botCount: 1
      }
    }
  }),
  joinRoom: (state, roomName) => ({
    globalAction: 'CLIENT_ACTION',
    clientAction: {
      type: 'JOIN_ROOM',
      payload: {
        name: roomName
      }
    }
  })
};

export function sendMessage(state, sendToServer, action) {
  switch (action.type) {
    case 'SEND_MESSAGE':
      sendToServer(outcomingActions.chat(state, action));
      break;
    case 'JOIN_GAME':
      sendToServer(outcomingActions.joinGame());
      break;
    default:
      break;
  }
}

export function handleOpen(state, sendToServer) {
  sendToServer(outcomingActions.setName({name: 'User 1'}));
  console.log('name set');
  sendToServer(outcomingActions.createRoom(state, {roomName: 'room1'}));
}

export function sendToServerCreator(socket) {
  return (payload) => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(payload));
    } else {
      console.log('could not send message');
    }
  };
}
