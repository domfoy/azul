import defaultGame from './default';
import initialPatternLines from './initial-pattern-lines';
import readYaml from './parser';

const layTileMoves = readYaml(`${__dirname}/picks/test-1.yaml`, {kind: 'layTileMoves'});

export default defaultGame;

export {
  initialPatternLines,
  layTileMoves
};
