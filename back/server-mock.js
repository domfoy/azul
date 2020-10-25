const Game = require('./src/game');
const formatGame = require('./src/game/format');

const user = {
  name: 'Player'
};
const bot = {
  name: 'Bot'
};

const game = new Game([user], [bot]);
const data = Object.assign({}, formatGame(game));

module.exports = () => {
  debugger;
  return {
    game: data
  };
};
