import _ from 'lodash';

import {actions} from '../../index';
import {layTileMoves} from '../data';

export default _.map(layTileMoves, (move, index) => ({
  name: `should lay tile (iteration ${index + 1}): ${move.title}`,
  initialState: move.initialState,
  actionPayload: actions.layTile(),
  expectedState: move.expectedState
}));
