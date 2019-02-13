require('../../register-models');

const {
  isOver,
  applyAction
} = require('./logic');

const {
  init
} = require('./init');

const {
  formatGame
} = require('./format');

module.exports = {
  init,
  isOver,
  formatGame,
  applyAction
};
