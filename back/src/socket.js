const GameContext = require('./game');

const RandomBot = require('./ia');

function socketHandler(io) {
  if (!io) {
    throw new Error('no io');
  }
  io.on('connection', handleConnection);
}

async function handleConnection(socket) {
  console.log('A user is connected');

  const bot = new RandomBot();
  const ctx = await new GameContext([bot]);

  socket.emit('game_created', ctx.displayGame());

  socket.on('action_submitted', handleActionSubmitted.bind(null, socket, ctx));
}

async function handleActionSubmitted(socket, ctx, actionSubmission) {
  console.log('action submission received', actionSubmission);
  try {
    await handleAction(socket, ctx, actionSubmission);

    socket.emit('new_pending_action_set', ctx.formatNextActionContext());
  } catch (err) {
    socket.emit('action_submission_rejected', err);
    throw err;
  }
}

async function handleAction(socket, ctx, actionSubmission) {
  await ctx.applyAction(actionSubmission);

  if (ctx.isGameOver()) {
    socket.emit('game_over');
  }
}

module.exports = socketHandler;
