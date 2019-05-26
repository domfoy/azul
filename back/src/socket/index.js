const _ = require('lodash');

const GameContext = require('../game');
const setupBots = require('../ia');


function sendToRoom(room, action, userSpecificSender) {
  for (const user of room.users) {
    let userSpecificAction;

    if (userSpecificSender) {
      userSpecificAction = userSpecificSender(user);
    }
    sendToClient(user.socket, _.merge({}, action, userSpecificAction));
  }
}

function sendToClient(socket, action) {
  socket.send(JSON.stringify({
    globalAction: 'SERVER_ACTION',
    serverAction: action
  }));
}

function validateMessage(message) {
  if (!(message && message.type)) {
    return 'NO_TYPE';
  }

  switch (message.type) {
  case 'SET_NAME':
    if (!message.payload) {
      return 'SET_NAME:NO_PAYLOAD';
    }
    if (!message.payload.name) {
      return 'SET_NAME:NO_NAME';
    }
    break;
  case 'CREATE_ROOM':
    if (!message.payload) {
      return 'SET_NAME:NO_PAYLOAD';
    }
    if (!message.payload.name) {
      return 'CREATE_ROOM:NO_NAME';
    }
    if (!_.includes([1, 2, 3, 4], message.payload.userCount)) {
      return 'CREATE_ROOM:INVALID_USER_COUNT';
    }
    if (!_.includes([1, 2, 3], message.payload.botCount)) {
      return 'CREATE_ROOM:INVALID_BOT_COUNT';
    }
    if (message.payload.userCount + message.payload.botCount > 4) {
      return 'CREATE_ROOM:OUT_OF_BOUND_PLAYER_COUNT';
    }
    break;
  default:
    return 'UNKNOWN_TYPE';
  }
  return undefined;
}

async function handleClientAction(state, socket, rawMessage) {
  const user = _.find(state.users, {socket});
  const message = JSON.parse(rawMessage);
  const clientAction = _.get(message, 'clientAction');
  const validationError = validateMessage(clientAction);

  if (!user) {
    return;
  }

  if (validationError) {
    sendToClient(socket, {
      type: 'VALIDATION_ERRORS',
      error: validationError
    });
  }

  switch (clientAction.type) {
  case 'SET_NAME':
    user.name = clientAction.payload.name;
    break;
  case 'CREATE_ROOM':
    const name = clientAction.payload.name;
    const existingRoom = _.find(state.rooms, {name});

    if (existingRoom) {
      sendToClient(socket, {
        type: 'VALIDATION_ERRORS',
        errors: ['CREATE_ROOM:ROOM_ALREADY_EXISTS']
      });
    }
    const room = {
      name,
      userCount: clientAction.payload.userCount,
      botCount: clientAction.payload.botCount,
      users: [user]
    };

    state.rooms.push(room);
    user.room = room;

    if (room.userCount === room.users.length) {
      const bots = setupBots({randomCount: room.botCount});
      const game = await new GameContext(room.users, bots);

      room.game = game;

      sendToRoom(room, {
        type: 'START_GAME',
        payload: {
          name: room.name,
          players: _.map(room.game.players, player => _.pick(player, ['name', 'id'])),
          startPlayerId: 1
        }
      }, (currentUser) => {
        const currentPlayer = _.find(room.game.players, {user: currentUser});

        return {
          payload: {playerId: currentPlayer.id}
        };
      });
    }
    break;
  default:
    break;
  }
}

async function handleConnection(state, socket) {
  console.log('A user is connected');

  state.users.push({
    socket
  });

  socket.on('message', message => handleClientAction(state, socket, message));
}

function socketHandler(wss, state) {
  if (!wss) {
    throw new Error('no web socket');
  }
  wss.on('connection', socket => handleConnection(state, socket));
}

module.exports = socketHandler;
