const mongoose = require('mongoose');

const {
  isOver,
  applyAction,
  prepareRound
} = require('../src/game');

const {
  COLOURS
} = require('./Consts');

const MIN_PLAYERS = 2;
const MAX_PLAYERS = 4;

const Colour = {type: String, enum: COLOURS};

const Factory = {
  id: Number,
  tiles: [Number]
};

module.exports = function registerGame() {
  const gameSchema = new mongoose.Schema({
    playerCount: {type: Number, min: MIN_PLAYERS, max: MAX_PLAYERS},
    pendingAction: {
      roundId: {type: Number, min: 1},
      playerId: {type: Number, min: 1, max: MAX_PLAYERS}
    },
    factories: [Factory],
    bag: [Number],
    players: {
      type: [{
        id: {type: Number, min: 1, max: MAX_PLAYERS},
        hasOne: Boolean,
        score: Number,
        patternLines: {
          type: {
            l1: [Number],
            l2: [Number],
            l3: [Number],
            l4: [Number],
            l5: [Number]
          },
          required: true
        },
        penaltyLine: [Number],
        wall: [{
          index: Number,
          colour: Colour,
          line: Number,
          col: Number
        }]
      }]
    }
  }, {
    usePushEach: true,
    bufferCommands: false,
    toObject: {
      retainKeyOrder: true
    }
  });

  gameSchema.methods.isOver = function _isOver() {
    return isOver(this);
  };
  gameSchema.methods.getPhasis = function _isOver() {
    return isOver(this);
  };
  gameSchema.methods.prepareRound = function _prepareRound() {
    return prepareRound(this);
  };
  gameSchema.methods.applyAction = function _applyAction(bots, actionSubmission) {
    return applyAction(this, bots, actionSubmission);
  };

  mongoose.model('Game', gameSchema);
};
