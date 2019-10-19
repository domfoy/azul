import {actions} from '../../index';

const initialState = undefined;
const actionPayload = actions.setName('Player 1');
const expectedState = {
  player: {
    name: 'Player 1'
  }
};

export default {
  name: 'should set name of the player',
  initialState,
  actionPayload,
  expectedState
};
