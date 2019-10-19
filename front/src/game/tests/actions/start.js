import {actions} from '../../index';
import defaultState from '../data';

const startActionInput = {
  name: 'New Game',
  playerId: 1,
  players: [
    {
      name: 'Player 1',
      id: 1
    },
    {
      name: 'Player 2',
      id: 2
    }
  ],
  startPlayerId: 1,
  factories: defaultState.factories
};

export default {
  name: 'should setup the game state',
  initialState: undefined,
  actionPayload: actions.start(startActionInput),
  expectedState: defaultState
};
