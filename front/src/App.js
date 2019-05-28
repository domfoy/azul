import _ from 'lodash';

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {PixiAppContext} from './context';
import './App.css';

import FactorySet from './factory';
import PlayerBoard from './board';

class App extends Component {
  componentWillUnmount() {
    const app = this.context;
    app.stop();
  }

  initGameCanvas = (rawDiv) => {
    const app = this.context;
    this.gameCanvas = rawDiv;
    this.gameCanvas.appendChild(app.view);
    app.renderer.backgroundColor = 0x014055;
    app.renderer.antialias = true;
    app.start();
  }

  render() {
    const app = this.context;
    const {startPlayerId, players, playerId, factories} = this.props;
    const isRenderReady = !!startPlayerId && players.length > 0;

    if (!isRenderReady) {
      return null;
    }

    const currentPlayer = _.find(players, {id: playerId});
    const opponents = _.filter(players, player => player.id !== playerId);
    return (
      <div className="App" ref={this.initGameCanvas}>
        <PlayerBoard
          xCenter={(app.screen.width) / 2}
          yCenter={app.screen.height - 200}
          player={currentPlayer}
        />

        {_.map(opponents, opponent => (
          <PlayerBoard
            key={opponent.id}
            xCenter={(app.screen.width) / 2}
            yCenter={app.screen.height - 200}
            player={opponent}
          />
        ))}

        <FactorySet
          factories={factories}
          xCenter={app.screen.width / 2}
          yCenter={app.screen.height / 2}
        />
      </div>
    );
  }
}

App.propTypes = {
  factories: PropTypes.array,
  startPlayerId: PropTypes.number,
  playerId: PropTypes.number,
  players: PropTypes.array,
};

App.defaultProps = {
  factories: [],
  startPlayerId: undefined,
  playerId: undefined,
  players: []
};

App.contextType = PixiAppContext;

const mapStateToProps = ({game: {startPlayerId, players, playerId, factories}}) => ({players, startPlayerId, playerId, factories});

export default connect(mapStateToProps)(App);
