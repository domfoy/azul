import _ from 'lodash';

import {createActions, handleActions} from 'redux-actions';

const defaultState = {
  patternLines: [
    {
      id: 1
    },
    {
      id: 2
    },
    {
      id: 3
    },
    {
      id: 4
    },
    {
      id: 5
    }
  ]
};

export const actions = createActions({
  SET_NAME: name => ({name}),
  START: payload => payload,
  PICK_TILE: ({factory, tile}) => {
    console.log('called', factory, tile);
    return {factory, tile};
  },
  LAY_TILE: ({patternLineId}) => {
    console.log('laid tile', patternLineId);
    return {patternLineId};
  }
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
    [actions.layTile]: (state, {payload: {patternLineId}}) => {
      console.log(patternLineId);
      const pickCount = state.turn.count;

      const players = _.map(state.players, (player) => {
        if (player.id !== state.playerId) {
          return player;
        }

        const remainingPenaltiesRoom = 8 - player.penalties.length;
        const newPatternLine = _.find(player.patternLines, {id: patternLineId});
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

        const patternLines = _.map(state.patternLines, (line) => {
          if (line.id !== patternLineId) {
            return line;
          }

          return {
            ...newPatternLine
          };
        });

        return {
          ...player,
          patternLines
        };
      });

      return {
        ...state,
        players
      };
    }
  },
  defaultState
);

export default actions;
