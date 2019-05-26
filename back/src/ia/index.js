class RandomBot {
  constructor({botId, name}) {
    return {
      botId,
      name
    };
  }
}

module.exports = function setupBots({randomCount}) {
  const bots = [];
  for (let botId = 0; botId < randomCount; botId++) {
    bots.push(new RandomBot({botId, name: `Bot ${botId + 1}`}));
  }

  return bots;
};
