import _ from 'lodash';

import {
  parseFactories,
  parseTableCenter,
  parsePatternLines
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
      turn: parseTurn(initialState.factories, layTileMove)
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
    initialState: augmentedInitialState,
    expectedState
  };
}

function parseTurn(factories, move) {
  return {
    id: 1,
    playerId: 1,
    patternLineId: move.patternLineId,
    factoryId: move.factoryId,
    colour: move.colour,
    count: _.filter(_.find(factories, {id: move.factoryId}).tiles, {colour: move.colour}).length
  };
}

function mergeStateWithExpectations(state, {patternLines, factories, tableCenter}) {
  return {
    ...state,
    factories,
    tableCenter,
    players: [
      {
        ...state.players[0],
        id: 1,
        patternLines
      },
      state.players[1]
    ]
  };
}

function parseLayTileMoveExpectation(move) {
  return {
    patternLines: parsePatternLines(move.expected.player),
    factories: parseFactories(move.expected.factories),
    tableCenter: parseTableCenter(move.expected.tableCenter)
  };
}
