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

  return {
    initialState: augmentedInitialState,
    expectedState: mergeStateWithExpectations(
      augmentedInitialState,
      parseLayTileMoveExpectation(layTileMove)
    )
  };
}

function parseTurn(factories, move) {
  return {
    id: 1,
    playerId: 1,
    factoryId: move.factoryId,
    colour: move.colour,
    count: _(factories)
      .filter({colour: move.colour})
      .length
  };
}

function mergeStateWithExpectations(state, {patternLines, factories, tableCenter}) {
  return _.mergeWith(
    {},
    state,
    {
      players: [
        {
          id: 1,
          patternLines
        }
      ],
      factories,
      tableCenter
    },
    (obj, src) => {
      if (_.isArray(obj) && src[0].patternLines) {
        return _.uniqBy(src, obj, 'id');
      }

      return undefined;
    }
  );
}

function parseLayTileMoveExpectation(move) {
  return {
    patternLines: parsePatternLines(move.expected.player),
    factories: parseFactories(move.expected.factories),
    tableCenter: parseTableCenter()
  };
}
