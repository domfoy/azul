import _ from 'lodash';

export default (state) => {
  if (state.turn.factoryId !== 0 && !state.turn.patternLineId) {
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
  if (state.turn.factoryId === 0) {
    const tableCenterWithoutPenaltyToken = _.find(state.tableCenter, {colour: '0'})
      ? _.reject(state.tableCenter, {colour: '0'})
      : state.tableCenter;

    return _.reject(tableCenterWithoutPenaltyToken, {colour: state.turn.colour});
  }

  const pickedFactory = _.find(state.factories, {id: state.turn.factoryId});
  const otherTiles = _.reject(pickedFactory.tiles, {colour: state.turn.colour});

  const groupedOtherTiles = _(otherTiles)
    .groupBy('colour')
    .map((tiles, colour) => ({colour, count: tiles.length}))
    .value();

  // TODO change reduce into groupBy
  return _.reduce([...state.tableCenter, ...groupedOtherTiles], (acc, cur) => {
    const found = _.find(acc, {colour: cur.colour});
    if (found) {
      found.count += cur.count;
    } else {
      acc.push({colour: cur.colour, count: cur.count});
    }

    return acc;
  }, []);
}

function updatePlayers(state) {
  const players = _.map(state.players,
    player => updatePlayer(state, player));

  return players;
}

function updatePlayer(state, player) {
  if (player.id !== state.playerId) {
    return player;
  }

  const patternLineId = state.turn.patternLineId;

  if (patternLineId === null) {
    // from table center or factory to penalties
    return updatePlayerOnPenaltiesTargetted(state, player);
  }

  // from table center or factory to pattern line
  return updatePlayerOnPatternLineTargetted(state, player);
}

function updatePlayerOnPenaltiesTargetted(state, player) {
  let newPenalties = player.penalties;
  if (_.find(state.tableCenter, {colour: '0'})) {
    newPenalties = [
      ...player.penalties,
      {colour: '0', count: 1}
    ];
  }

  const pickCount = state.turn.count;
  const remainingPenaltiesRoom = 8 - player.penalties.length;
  if (pickCount === 0 || remainingPenaltiesRoom === 0) {
    return {
      ...player,
      penalties: newPenalties
    };
  }

  return {
    ...player,
    penalties: [
      ...newPenalties,
      {
        count: pickCount,
        colour: pickCount <= remainingPenaltiesRoom
          ? state.turn.colour
          : remainingPenaltiesRoom
      }
    ]
  };
}

function updatePlayerOnPatternLineTargetted(state, player) {
  const pickCount = state.turn.count;
  const patternLineId = state.turn.patternLineId;

  const targettedPatternLine = _.find(player.patternLines, {id: patternLineId});
  const newPatternLine = {...targettedPatternLine, colour: state.turn.colour};
  const remainingRoom = patternLineId - newPatternLine.count;

  if (pickCount <= remainingRoom) {
    newPatternLine.count += pickCount;
  } else {
    newPatternLine.count = patternLineId;

    const remainingPenaltiesRoom = 8 - player.penalties.length;

    const toPenalty = pickCount - remainingRoom;
    const reallyToPenalty = toPenalty <= remainingPenaltiesRoom
      ? toPenalty
      : remainingPenaltiesRoom;

    if (reallyToPenalty > 0) {
      player.penalties.push({colour: state.turn.colour, count: toPenalty});
    }
  }

  const newPatternLines = updatePatternLines({patternLineId, newPatternLine}, player)

  return {
    ...player,
    patternLines: newPatternLines
  };
}

function updatePatternLines({patternLineId, newPatternLine}, player) {
  const newLineIndex = _.findIndex(player.patternLines, {id: patternLineId});

  if (newLineIndex < 0) {
    return _.concat(player.patternLines, newPatternLine);
  }

  return [
    ...player.patternLines.slice(0, newLineIndex),
    newPatternLine,
    ...player.patternLines.slice(newLineIndex + 1)
  ];
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
