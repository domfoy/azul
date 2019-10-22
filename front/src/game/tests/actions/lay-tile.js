import {actions} from '../../index';
import {layTileMoves} from '../data';

console.log(JSON.stringify(layTileMoves[0]));


export default [
  {
    name: 'should pick tile',
    initialState: layTileMoves[0].initialState,
    actionPayload: actions.layTile(),
    expectedState: layTileMoves[0].expectedState
  }
];
