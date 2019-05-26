const {
  init: _init,
  isOver: _isOver,
  prepareRound: _prepareRound,
  applyAction: _applyAction,
} = require('./logic');

class Game {
  constructor(users, bots) {
    const game = _init(users, bots);

    _prepareRound(game);

    Object.assign(this, game);
  }

  isOver() {
    return _isOver(this);
  }
  prepareRound() {
    return _prepareRound(this);
  }
  applyAction() {
    return _applyAction(this);
  }
}

module.exports = Game;
