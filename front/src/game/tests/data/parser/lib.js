import _ from 'lodash';

import initialPatternLines from '../initial-pattern-lines';

export function parseTableCenter(tableCenter) {
  const tileGroups = _.split(tableCenter, ' ');

  return _(tileGroups)
    .map((group) => {
      const [colour, count] = _.split(group, ',');

      if (colour) {
        return {
          count: count ? parseInt(count, 10) : 1,
          colour
        };
      }

      return undefined;
    })
    .compact()
    .value();
}

export function parseFactories(factories) {
  const lines = parseBlockOfLines(factories);

  const parsed = _(lines)
    .map((factory, index) => parseFactory(factory, index + 1))
    .compact()
    .value();

  return [1, 2, 3, 4, 5].map((id) => {
    const foundParsed = _.find(parsed, {id});

    if (foundParsed) {
      return foundParsed;
    }

    return {
      id,
      tiles: []
    };
  });
}

function parseFactory(factoryLine, id) {
  const colours = _.split(factoryLine, ' ');

  if (colours.length === 0 || !colours[0]) {
    return {
      id,
      tiles: []
    };
  }

  return {
    id,
    tiles: _.map(colours, colour => ({
      id: 12,
      colour
    }))
  };
}

export function parsePatternLines(asString) {
  if (!asString) {
    return initialPatternLines;
  }

  const lines = parseBlockOfLines(asString);

  const parsed = _(lines)
    .map((line, index) => parsePatternLine(line, index + 1))
    .compact()
    .value();

  return [1, 2, 3, 4, 5].map((id) => {
    const foundParsed = _.find(parsed, {id});

    if (foundParsed) {
      return foundParsed;
    }

    return {
      id,
      count: 0
    };
  });
}

function parsePatternLine(line, id) {
  const tokens = _.split(line, ' ');

  if (tokens.length === 0 || !tokens[0]) {
    return {
      id,
      count: 0
    };
  }

  return {
    id,
    colour: tokens[0],
    count: tokens.length
  };
}

function parseBlockOfLines(block) {
  const parsedBlock = _.split(block, '\n');
  const lines = _.slice(parsedBlock, 0, parsedBlock.length - 1);

  return lines;
}
