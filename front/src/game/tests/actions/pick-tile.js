import {actions} from '../../index';
import initialState from '../data';

const ActionInput = {
  factory: initialState.factories[0],
  colour: 'Bu'
};

const expectedState = Object.assign(
  {},
  initialState,
  {
    turn: {
      id: 1,
      playerId: 1,
      factoryId: 1,
      colour: 'Bu',
      count: 2
    }
  }
);

export default {
  name: 'should pick tile',
  initialState,
  actionPayload: actions.pickTile(ActionInput),
  expectedState
};
