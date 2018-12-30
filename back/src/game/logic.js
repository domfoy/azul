const assert = require('assert');

const _ = require('lodash');

const {
  COLOURS,
  COLOURS_COUNT
} = require('../../models');

const TILES = _.flatten(_.map(COLOURS, (colour, offset) => {
  const tiles = [];
  for (let i = 0; i < 20; i++) {
    tiles.push({
      index: (offset * 20) + i + 1,
      id: `${colour}${i + 1}`,
      colour
    });
  }

  return tiles;
}));

module.exports = {
  isOver,
  prepareRound,
  applyAction
};

function isOver(game) {
  return _.some(game.players, (player) => {
    return _.some(_.values(_.groupBy(player.wall, 'line')), line => line.length === 5);
  });
}

async function applyAction(game, {playerId, factoryId, colour, patternLineId}) {
  playTiles(game, playerId, factoryId, colour, patternLineId);

  if (isFactoryOfferOver(game)) {
    tileWalls(game);
    if (!isOver(game)) {
      prepareRound(game);
    }
  }

  await game.save({context: 'document'});
}

function playTiles(game, playerId, factoryId, colour, patternLineId) {
  const factory = _.find(game.factories, factoryId);
  const tiles = _.filter(TILES, tile => _.includes(factory.tiles, tile.index) && tile.colour === colour);
  const remainingTiles = _.filter(TILES, tile => _.includes(factory.tiles, tile.index) && tile.colour !== colour);

  assert(tiles.length);

  const player = _.find(game.players, {id: playerId});
  const oneTileIndex = factoryId === 0 ? _.findIndex(factory.tiles, {index: 0}) : -1;

  clearFactory(game, factory, player, tiles);
  putRemainingTilesIntoCenter(game, factory, remainingTiles);
  fillPatternLine(game, player, factory, patternLineId, tiles, oneTileIndex);

  return {
    center: game.factories[0],
    patternLine: _.find(game.players, {id: playerId})[patternLineId]
  };
}

function clearFactory(game, factory, player, tiles) {
  factory.tiles = _.map(factory.tiles, tile => (_.includes(_.map(tiles, 'index'), tile.index) ? null : tile));
}

function putRemainingTilesIntoCenter(game, factory, remainingTiles) {
  if (factory.id === 0) {
    return;
  }
  const center = _.find(game.factories, {id: 0});

  _.each(remainingTiles, tile => game.factories[0].tiles.push(tile));

  center.tiles = _(COLOURS)
    .map(col => _.filter(game.factories[0].tiles, tile => tile.colour === col))
    .flatten()
    .value();
}

function fillPatternLine(game, player, factory, patternLineId, tiles, oneTileIndex) {
  if (oneTileIndex >= 0) {
    factory.tiles[oneTileIndex] = null;
    player.hasOne = true;
    addTileToPenaltyLine(player, {index: 0});
  }

  const patternLineLength = player.patternLines[patternLineId].length;
  const freePenaltiesCount = _.filter(player.penaltyLine, spot => spot === null).length;

  const fillingTiles = _.slice(tiles, 0, patternLineLength);
  const penaltyTiles = _.slice(tiles, patternLineLength, patternLineLength + freePenaltiesCount);
  const remainingTiles = _.slice(tiles, patternLineLength + freePenaltiesCount);

  player.patternLines[patternLineId] = fillingTiles;

  addTilesToPenaltyline(player, penaltyTiles);
  putTilesIntoBag(game, remainingTiles);
}

function addTilesToPenaltyline(player, tiles) {
  _.each(tiles, tile => addTileToPenaltyLine(player, tile));
}

function addTileToPenaltyLine(player, tile) {
  const leftmostEmptySpot = _.indexOf(player.penaltyLine, spot => spot === null);

  if (leftmostEmptySpot >= 0) {
    player.penaltyLine[leftmostEmptySpot] = tile.index;
  }
}

function putTilesIntoBag(game, tiles) {
  _.each(tiles, tile => game.bag.push(tile.index));

  game.bag = _.sort(game.bag);
}

function isFactoryOfferOver(game) {
  return _.every(game.factories, f => _.filter(f.tiles, t => t === null).length === 0);
}

function tileWalls(game) {
  for (const player of game.players) {
    tilePlayerWall(game, player);
  }
}

function tilePlayerWall(game, player) {
  for (const patternLine of _.values(player.patternLines)) {
    if (_.filter(patternLine, spot => spot === null).length === 0) {
      const marker = _.find(TILES, {index: patternLine[0].index});
      const remainingTiles = _.slice(patternLine, 1);

      player.wall.push({
        index: marker.index,
        colour: marker.colour,
        line: patternLine.length,
        col: findWallTileColumn(patternLine.id, marker.colour)
      });

      putTilesIntoBag(game, remainingTiles);
    }
  }
}

function findWallTileColumn(patternLineId, tileColour) {
  const colourIndex = _.findIndex(COLOURS, tileColour);

  return ((colourIndex + (patternLineId - 1)) % COLOURS_COUNT) + 1;
}

function prepareRound(game) {
  const shuffled = _.shuffle(game.bag);
  const buckets = _.splice(_.chunk(shuffled, 4), 0, 5);
  const factories = _.union({
    id: 0,
    tiles: [0]
  }, _.map(buckets, (bucket, index) => {
    return {
      id: index + 1,
      tiles: bucket
    };
  }));

  game.bag = _.difference(game.bag, _.flatten(buckets));
  game.factories = factories;
  game.pendingAction.roundId += 1;
  game.pendingAction.playerId = 1;
  return factories;
}
