import _ from 'lodash';

import {
  parseFactories,
  parsePatternLines,
  parsePenalties,
  parseTableCenter
} from './lib';

import defaultGame from '../default';

export default function parseLayTileMoves(layTileMoves) {
  const initialState = Object.assign(
    {},
    defaultGame,
    {
      factories: parseFactories(layTileMoves.initial.factories),
      tableCenter: parseTableCenter(layTileMoves.initial.tableCenter)
    }
  );

  return _.map(
    layTileMoves.moves,
    move => parseLayTileMove({initialState}, move)
  );
}

function parseLayTileMove({initialState}, layTileMove) {
  const augmentedInitialState = Object.assign(
    {},
    initialState,
    {
      turn: parseTurn({
        factories: initialState.factories,
        tableCenter: initialState.tableCenter,
      }, layTileMove)
    }
  );

  const expectedState = mergeStateWithExpectations(
    Object.assign(
      {},
      augmentedInitialState,
      {
        turn: {
          id: 2,
          playerId: 2
        }
      }
    ),
    parseLayTileMoveExpectation(layTileMove)
  );

  return {
    title: layTileMove.title,
    initialState: augmentedInitialState,
    expectedState
  };
}

function parseTurn({factories, tableCenter}, move) {
  let count = 0;
  if (move.colour === '0') {
    count = 0;
  } else if (move.factoryId === 0) {
    count = _.find(tableCenter, {colour: move.colour}).count;
  } else {
    count = _.filter(_.find(factories, {id: move.factoryId}).tiles, {colour: move.colour}).length;
  }

  return {
    id: 1,
    playerId: 1,
    patternLineId: move.patternLineId,
    factoryId: move.factoryId,
    colour: move.colour,
    count
  };
}

function mergeStateWithExpectations(state, {patternLines, penalties, factories, tableCenter}) {
  return {
    ...state,
    factories,
    tableCenter,
    players: [
      {
        ...state.players[0],
        id: 1,
        patternLines,
        penalties
      },
      state.players[1]
    ]
  };
}

function parseLayTileMoveExpectation(move) {
  return {
    factories: parseFactories(move.expected.factories),
    patternLines: parsePatternLines(move.expected.patternLines),
    penalties: parsePenalties(move.expected.penalties),
    tableCenter: parseTableCenter(move.expected.tableCenter)
  };
}
