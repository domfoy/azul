import _ from 'lodash';

import initialPatternLines from '../initial-pattern-lines';

export function parseTableCenter(tableCenter) {
  return parseFactory(tableCenter);
}

export function parseFactories(factories) {
  const lines = _.split(factories, '\n');
  return _.map(lines, (factory, index) => ({
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

export function parsePatternLines(asString) {
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
    count: parseInt(count, 10)
  };
}
