import _ from 'lodash';

import {createActions, handleActions} from 'redux-actions';

const defaultState = {};

export const actions = createActions({
  SET_NAME: name => ({name}),
  START: payload => payload,
  PICK_TILE: ({factory, colour}) => {
    return {factory, colour};
  },
  OVER_PATTERN_LINE: ({patternLineId}) => {
    return {patternLineId};
  },
  LAY_TILE: () => {}
});

export const reducer = handleActions(
  {
    [actions.setName]: (state, {name}) => ({...state, player: {name}}),
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
    [actions.pickTile]: (state, {payload: {factory, colour}}) => {
      return {
        ...state,
        turn: {
          ...state.turn,
          factoryId: factory.id,
          colour,
          count: factory.id === 0 ? _.find(state.tableCenter, {colour}).count : _.filter(factory.tiles, {colour}).length
        }
      };
    },
    [actions.overPatternLine]: (state, {payload: {patternLineId}}) => {
      return {
        ...state,
        turn: {
          ...state.turn,
          patternLineId
        }
      };
    },
    [actions.layTile]: (state) => {
      if (!state.turn.patternLineId) {
        return state;
      }

      const pickCount = state.turn.count;
      let tableCenter = state.tableCenter;

      if (state.turn.factoryId === 0) {
        tableCenter = _.reject(state.tableCenter, {colour: state.turn.colour});
      } else {
        const pickedFactory = _.find(state.factories, {id: state.turn.factoryId});
        const otherTiles = _.reject(pickedFactory.tiles, {colour: state.turn.colour});
        const groupedOtherTiles = _(otherTiles)
          .groupBy('colour')
          .map((tiles, colour) => ({colour, count: tiles.length}))
          .value();

        tableCenter = _.reduce([...state.tableCenter, ...groupedOtherTiles], (acc, cur) => {
          const found = _.find(acc, {colour: cur.colour});
          if (found) {
            found.count += cur.count;
          } else {
            acc.push({colour: cur.colour, count: cur.count});
          }

          return acc;
        }, []);
      }

      const players = _.map(state.players, (player) => {
        if (player.id !== state.playerId) {
          return player;
        }

        const patternLineId = state.turn.patternLineId;
        const remainingPenaltiesRoom = 8 - player.penalties.length;
        const targettedPatternLine = _.find(player.patternLines, {id: patternLineId});
        const newPatternLine = {...targettedPatternLine, colour: state.turn.colour};
        const remainingRoom = patternLineId - newPatternLine.count;

        if (pickCount <= remainingRoom) {
          newPatternLine.count += pickCount;
        } else {
          newPatternLine.count = patternLineId;

          const toPenalty = pickCount - remainingRoom;
          const reallyToPenalty = toPenalty <= remainingPenaltiesRoom ? toPenalty : remainingPenaltiesRoom;

          if (reallyToPenalty > 0) {
            player.penalties.push({colour: state.turn.colour, count: toPenalty});
          }
        }

        const newLineIndex = _.findIndex(player.patternLines, {id: patternLineId});

        let newPatternLines;
        if (newLineIndex < 0) {
          newPatternLines = _.concat(player.patternLines, newPatternLine);
        } else {
          newPatternLines = [
            ...player.patternLines.slice(0, newLineIndex),
            newPatternLine,
            ...player.patternLines.slice(newLineIndex + 1)
          ];
        }

        return {
          ...player,
          patternLines: newPatternLines
        };
      });

      const factories = _.map(state.factories, (factory) => {
        if (factory.id !== state.turn.factoryId) {
          return factory;
        }

        return {
          ...factory,
          tiles: []
        };
      });

      const turn = {
        id: state.turn.id + 1,
        playerId: state.turn.playerId < state.players.length ? state.turn.playerId + 1 : 1
      };

      return {
        ...state,
        turn,
        players,
        tableCenter,
        factories
      };
    }
  },
  defaultState
);

export default actions;
