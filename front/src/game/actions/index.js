import _ from 'lodash';

import {createActions, handleActions} from 'redux-actions';

import layTile from './lay-tile';

const defaultState = {};

export const actions = createActions({
  SET_NAME: name => ({name}),
  START: payload => payload,
  PICK_TILE: ({factory, colour}) => ({factory, colour}),
  OVER_PATTERN_LINE: ({patternLineId}) => ({patternLineId}),
  LAY_TILE: () => {}
});

export const reducer = handleActions(
  {
    [actions.setName]: (state, {payload: {name}}) => ({...state, player: {name}}),
    [actions.start]: (state, {payload}) => {
      const {
        name,
        playerId,
        players,
        startPlayerId,
        factories
      } = payload;
      const patternLines = _.reduce([1, 2, 3, 4, 5], (acc, cur) => {
        acc.push({id: cur, count: 0});

        return acc;
      }, []);

      return {
        ...state,
        name,
        startPlayerId,
        playerId,
        players: _.map(players, ({name: playerName, id}) => ({
          id,
          name: playerName,
          score: 0,
          patternLines,
          wall: [],
          penalties: []
        })),
        turn: {
          id: 1,
          playerId: startPlayerId
        },
        tableCenter: [{colour: 'one', count: 1}],
        factories: _.map(factories, factory => ({
          id: factory.id,
          tiles: _.map(factory.tiles, tile => ({id: tile.id, colour: tile.colour}))
        }))
      };
    },
    [actions.pickTile]: (state, {payload: {factory, colour}}) => ({
      ...state,
      turn: {
        ...state.turn,
        factoryId: factory.id,
        colour,
        count: factory.id === 0 ? _.find(state.tableCenter, {colour}).count : _.filter(factory.tiles, {colour}).length
      }
    }),
    [actions.overPatternLine]: (state, {payload: {patternLineId}}) => ({
      ...state,
      turn: {
        ...state.turn,
        patternLineId
      }
    }),
    [actions.layTile]: layTile
  },
  defaultState
);

export default actions;
