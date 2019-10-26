import {actions} from '../../index';
import {layTileMoves} from '../data';

export default [
  {
    name: 'should lay tile',
    initialState: layTileMoves[0].initialState,
    actionPayload: actions.layTile(),
    expectedState: layTileMoves[0].expectedState
  }
];
