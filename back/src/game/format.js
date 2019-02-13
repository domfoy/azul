const _ = require('lodash');

const {
  COLOURS
} = require('../../models');

function formatGame(game) {
  console.log('game created', game.pendingAction);

  return {
    pendingAction: game.pendingAction,
    factories: formatFactories(game.factories),
    patternLines: formatPatternLines(game)
  };
}

function formatPatternLines(game) {
  return _.map(_.values(game.players[0].patternLines), patternLine => _.map(patternLine, getTileColour));
}

function formatFactories(factories) {
  return _.map(factories, factory => ({
    id: factory.id,
    tiles: _.map(factory.tiles, tile => ({
      id: tile,
      colour: getTileColour(tile)
    }))
  }));
}

function getTileColour(tileId) {
  if (tileId === 0) {
    return '1st';
  }

  return COLOURS[Math.floor((tileId - 1) / 20)];
}

module.exports = {formatGame};
