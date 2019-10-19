import fs from 'fs';

import _ from 'lodash';
import yaml from 'yaml';

export const initialPatternLines = [
  {id: 1, count: 0},
  {id: 2, count: 0},
  {id: 3, count: 0},
  {id: 4, count: 0},
  {id: 5, count: 0},
];

export default function readYaml(path) {
  const content = fs.readFileSync(path, 'utf-8');

  const fileAsObj = yaml.parse(content);

  return parse(fileAsObj);
}

export function parse(obj, {kind = 'game'} = {}) {
  switch (kind) {
    case 'game':
    default:
      return parseGame(obj);
  }
}

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

function parseGame(obj) {
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

function parsePatternLines(asString) {
  if (!asString) {
    return initialPatternLines;
  }

  const lines = _.split(asString, '\n');

  return _.map(lines, (line, index) => ({
    id: index,
    tiles: parsePatternLine(line)
  }));
}

function parsePatternLine(line) {
  const [colour, count] = _.split(line, ' ');

  return {
    colour,
    count: Math.parseInt(count, 10)
  };
}

function parseFactories(factories) {
  return _.map(factories, (factory, index) => ({
    id: index + 1,
    tiles: parseFactory(factory)
  }));
}

function parseFactory(factoryLine) {
  const colours = _.split(factoryLine, ' ');

  return _.map(colours, colour => ({
    id: undefined,
    colour
  }));
}
