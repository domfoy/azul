import _ from 'lodash';

import {createActions, handleActions} from 'redux-actions';

const defaultState = {};

export const actions = createActions({
  SET_NAME: name => ({name}),
  START: payload => payload,
  PICK_TILE: ({factory, tile}) => {
    return {factory, tile};
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
      return {
        ...state,
        name,
        startPlayerId,
        playerId,
        players: _.map(players, ({name: playerName, id}) => ({
          id,
          name: playerName,
          score: 0,
          patternLines: [],
          wall: [],
          penalties: []
        })),
        turn: {
          id: 1,
          playerId: startPlayerId
        },
        tableCenter: [{id: 0, colour: 'one'}],
        factories: _.map(factories, factory => ({
          id: factory.id,
          tiles: _.map(factory.tiles, tile => ({id: tile.id, colour: tile.colour}))
        }))
      };
    },
    [actions.pickTile]: (state, {payload: {factory, tile}}) => {
      console.log(factory, tile);

      return {
        ...state,
        turn: {
          ...state.turn,
          factoryId: factory.id,
          colour: tile.colour,
          count: _.filter(factory.tiles, {colour: tile.colour}).length
        }
      };
    },
    [actions.overPatternLine]: (state, {payload: {patternLineId}}) => {
      if (!state.turn.factoryId) {
        return state;
      }

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
      const pickedFactory = _.find(state.factories, {id: state.turn.factoryId});
      const otherTiles = _.reject(pickedFactory.tiles, {colour: state.turn.colour});
      const groupedOtherTiles = _(otherTiles)
        .groupBy('colour')
        .map((tiles, colour) => ({colour, count: tiles.length}))
        .value();

      const tableCenter = _.reduce(groupedOtherTiles, (acc, cur) => {
        const found = _.findIndex(acc, {colour: cur.colour});
        if (found >= 0) {
          acc.splice(found, 1, {colour: cur.colour, count: acc[found].count + cur.count});
        } else {
          acc.push({colour: cur.colour, count: cur.count});
        }

        return acc;
      }, state.tableCenter);

      const players = _.map(state.players, (player) => {
        if (player.id !== state.playerId) {
          return player;
        }

        const patternLineId = state.turn.patternLineId;
        const remainingPenaltiesRoom = 8 - player.penalties.length;
        const newPatternLine = _.find(player.patternLines, {id: patternLineId}) || {id: patternLineId, count: 0, colour: state.turn.colour};
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

        if (factory.id === 0) {
          return {
            ...factory,
            tiles: [
              ...factory.tiles,
              ...otherTiles
            ]
          };
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
