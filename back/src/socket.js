const {
  init: initGame,
  formatGame
} = require('./game');

function socketHandler(io) {
  if (!io) {
    throw new Error('no io');
  }
  io.on('connection', handleConnection);
}

async function handleConnection(socket) {
  console.log('A user is connected');

  const game = await initGame();

  socket.emit('game_created', formatGame(game));

  socket.on('action_submitted', handleActionSubmitted.bind(null, socket, game));
}

async function handleActionSubmitted(socket, game, actionSubmission) {
  console.log('action submission received', actionSubmission);
  try {
    await game.applyAction(actionSubmission);
    if (game.isOver()) {
      socket.emit('game_over');
    }
    socket.emit('new_pending_action_set', formatNextActionContext(game));
  } catch (err) {
    socket.emit('action_submission_rejected', err);
    throw err;
  }
}

function formatNextActionContext(game) {
  const context = {
    pendingAction: {
      turnId: game.pendingAction.turnId,
      playerId: game.pendingAction.playerId
    },
    players: game.players
  };
  return context;
}

module.exports = socketHandler;
