import _ from 'lodash';

import initialPatternLines from '../initial-pattern-lines';
import {parseFactories, parsePatternLines} from './lib';

const defaultGame = {
  name: 'New Game',
  playerId: 1,
  startPlayerId: 1,
  factories: [],
  tableCenter: [{colour: 'one', count: 1}],
  turn: {
    id: 1,
    playerId: 1
  }
};

export default function parseGame(obj) {
  return _.defaultsDeep(
    {
      name: obj.name,
      playerId: obj.playerId,
      startPlayerId: obj.startPlayerId,
      players: _.map(obj.players, (player, index) => parsePlayer({...player, index})),
      factories: parseFactories(obj.factories),
      tableCenter: [{colour: 'one', count: 1}],
      turn: {
        id: 1,
        playerId: 1
      }
    },
    defaultGame
  );
}

function parsePlayer(obj) {
  const index = obj.index || 1;

  const defaultPlayer = {
    name: `Player ${index}`,
    id: index,
    score: 0,
    patternLines: initialPatternLines,
    wall: [],
    penalties: []
  };

  return _.defaultsDeep(
    {
      name: obj.name,
      id: obj.id,
      score: obj.score,
      patternLines: parsePatternLines(obj.patternLines),
      wall: [],
      penalties: []
    },
    defaultPlayer
  );
}