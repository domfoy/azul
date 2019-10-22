import _ from 'lodash';

export default (state) => {
  if (!state.turn.patternLineId) {
    return state;
  }

  const factories = updateFactories(state);
  const players = updatePlayers(state);
  const tableCenter = updateTableCenter(state);
  const turn = updateTurn(state);

  return {
    ...state,
    factories,
    players,
    tableCenter,
    turn
  };
};

function updateTableCenter(state) {
  let tableCenter = state.tableCenter;

  if (state.turn.factoryId === 0) {
    tableCenter = _.reject(state.tableCenter, {colour: state.turn.colour});
  } else {
    const pickedFactory = _.find(state.factories, {id: state.turn.factoryId});
    const otherTiles = _.reject(pickedFactory.tiles, {colour: state.turn.colour});
    const groupedOtherTiles = _(otherTiles)
      .groupBy('colour')
      .map((tiles, colour) => ({colour, count: tiles.length}))
      .value();

    tableCenter = _.reduce([...state.tableCenter, ...groupedOtherTiles], (acc, cur) => {
      const found = _.find(acc, {colour: cur.colour});
      if (found) {
        found.count += cur.count;
      } else {
        acc.push({colour: cur.colour, count: cur.count});
      }

      return acc;
    }, []);
  }

  return tableCenter;
}

function updatePlayers(state) {
  const pickCount = state.turn.count;
  const players = _.map(state.players, (player) => {
    if (player.id !== state.playerId) {
      return player;
    }

    const patternLineId = state.turn.patternLineId;
    const remainingPenaltiesRoom = 8 - player.penalties.length;
    const targettedPatternLine = _.find(player.patternLines, {id: patternLineId});
    const newPatternLine = {...targettedPatternLine, colour: state.turn.colour};
    const remainingRoom = patternLineId - newPatternLine.count;

    if (pickCount <= remainingRoom) {
      newPatternLine.count += pickCount;
    } else {
      newPatternLine.count = patternLineId;

      const toPenalty = pickCount - remainingRoom;
      const reallyToPenalty = toPenalty <= remainingPenaltiesRoom ? toPenalty : remainingPenaltiesRoom;

      if (reallyToPenalty > 0) {
        player.penalties.push({colour: state.turn.colour, count: toPenalty});
      }
    }

    const newLineIndex = _.findIndex(player.patternLines, {id: patternLineId});

    let newPatternLines;
    if (newLineIndex < 0) {
      newPatternLines = _.concat(player.patternLines, newPatternLine);
    } else {
      newPatternLines = [
        ...player.patternLines.slice(0, newLineIndex),
        newPatternLine,
        ...player.patternLines.slice(newLineIndex + 1)
      ];
    }

    return {
      ...player,
      patternLines: newPatternLines
    };
  });

  return players;
}

function updateFactories(state) {
  const factories = _.map(state.factories, (factory) => {
    if (factory.id !== state.turn.factoryId) {
      return factory;
    }

    return {
      ...factory,
      tiles: []
    };
  });

  return factories;
}

function updateTurn(state) {
  return {
    id: state.turn.id + 1,
    playerId: state.turn.playerId < state.players.length ? state.turn.playerId + 1 : 1
  };
}
