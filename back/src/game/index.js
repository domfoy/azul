require('../../register-models');

const {
  isOver,
  applyAction
} = require('./logic');

const {
  init
} = require('./init');

module.exports = {
  init,
  isOver,
  applyAction
};
