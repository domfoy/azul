const Game = require('mongoose').model('Game');

const {
  prepareRound
} = require('./logic');

module.exports = {
  init
};

async function init() {
  const game = new Game({
    playerCount: 2,
    pendingAction: {
      roundId: 0,
      playerId: 1
    },
    factories: [],
    bag: initBag(),
    players: initPlayers()
  });

  prepareRound(game);
  await game.save({context: 'document'});
  console.log('le jeu', JSON.stringify(game, null, 2));

  return game;
}

function initBag() {
  const array = [];
  for (let i = 1; i <= 100; i++) {
    array[i-1] = i;
  }

  return array;
}

function initPlayers() {
  const players = [];
  for (const playerId of [1, 2]) {
    players.push(initPlayer(playerId));
  }
}

function initPlayer(id) {
  return {
    id,
    hasOne: id === 1,
    score: 0,
    patternLines: {
      l1: [null],
      l2: [null, null],
      l3: [null, null, null],
      l4: [null, null, null, null],
      l5: [null, null, null, null, null]
    },
    wall: [],
    penaltyLine: []
  };
}
