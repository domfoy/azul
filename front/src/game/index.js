import _ from 'lodash';

import {createActions, handleActions} from 'redux-actions';

const defaultState = {
};

export const actions = createActions({
  SET_NAME: name => ({name}),
  START: payload => payload,
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
          wall: []
        })),
        turn: {
          id: 1,
          playerId: startPlayerId
        }
      };
    },
  },
  defaultState
);

export default actions;
