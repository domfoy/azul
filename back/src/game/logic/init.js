const _ = require('lodash');

function initBag() {
  const array = [];
  for (let i = 1; i <= 100; i++) {
    array[i - 1] = i;
  }

  return array;
}

function initPlayer({id, name, isBot}) {
  return {
    hasOne: false,
    id,
    isBot,
    name,
    patternLines: [],
    penaltyLine: [],
    score: 0,
    wall: [],
  };
}

function initPlayerFromBot({bot, id}) {
  return {
    ...initPlayer({id, name: bot.name, isBot: true}),
    bot
  };
}

function initPlayerFromUser({user, id}) {
  return {
    ...initPlayer({id, name: user.name}),
    user
  };
}

function initPlayers(users, bots) {
  const startPlayer = 1;

  const players = [];
  let playerId = 1;
  for (const user of users) {
    players.push(initPlayerFromUser({user, id: playerId}));
    playerId++;
  }
  for (const bot of bots) {
    players.push(initPlayerFromBot({bot, id: playerId}));
    playerId++;
  }

  return {
    players,
    startPlayer
  };
}

function init(users, bots) {
  const {startPlayer, players} = initPlayers(users, bots);

  return {
    playerCount: _.concat(users, bots).length,
    pendingAction: {
      roundId: 1,
      playerId: 1
    },
    factories: [],
    bag: initBag(),
    startPlayer,
    players
  };
}

module.exports = init;
