const init = require('./init');
const formatGame = require('./format');

class GameContext {
  constructor(bots) {
    const game = init(bots);

    Object.assign(this, {game, bots});
  }

  displayGame() {
    return formatGame(this.game);
  }

  formatNextActionContext() {
    const game = this.game;
    const context = {
      pendingAction: {
        turnId: game.pendingAction.turnId,
        playerId: game.pendingAction.playerId
      },
      players: game.players
    };
    return context;
  }

  async applyAction(actionSubmission) {
    await this.game.applyAction(this.bots, actionSubmission);
  }

  isGameOver() {
    return this.game.isOver();
  }
}

module.exports = GameContext;
