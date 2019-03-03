const _ = require('lodash');

const {
  COLOURS
} = require('../../models');

const EMPTY_WALL = [
  null, null, null, null, null,
  null, null, null, null, null,
  null, null, null, null, null,
  null, null, null, null, null,
  null, null, null, null, null
];

function formatGame(game) {
  console.log('game created', game.pendingAction);

  return {
    pendingAction: game.pendingAction,
    factories: formatFactories(game.factories),
    patternLines: formatPatternLines(game.players[0].patternLines),
    wall: formatWall(game.players[0].wall)
  };
}

function formatPatternLines(patternLines) {
  return _.map(_.values(patternLines), formatPatternLine);
}

function formatPatternLine(patternLine) {
  return _.map(patternLine, (patternSpotIndex) => {
    if (!patternSpotIndex) {
      return null;
    }

    return {
      index: patternSpotIndex
    };
  });
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

function formatWall(wall) {
  const res = EMPTY_WALL;

  for (const {line, col, index} of wall) {
    res[((line - 1) * 5) + (col - 1)] = {index};
  }

  return res;
}

module.exports = {formatGame};
