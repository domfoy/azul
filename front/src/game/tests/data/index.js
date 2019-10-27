import _ from 'lodash';

import defaultGame from './default';
import initialPatternLines from './initial-pattern-lines';
import readYaml from './parser';

const layTileMoves1 = readYaml(`${__dirname}/picks/test-1.yaml`, {kind: 'layTileMoves'});
const layTileMoves2 = readYaml(`${__dirname}/picks/test-2.yaml`, {kind: 'layTileMoves'});

export default defaultGame;

export const layTileMoves = _.flatten([
  layTileMoves1,
  layTileMoves2
]);

export {initialPatternLines};
