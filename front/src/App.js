import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {PixiAppContext} from './context';
import './App.css';

import {Game} from './game';

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
    const {playerId, players} = this.props;
    const isRenderReady = !!playerId && players.length > 0;

    if (!isRenderReady) {
      return null;
    }

    return (
      <div className="App" ref={this.initGameCanvas}>
        <Game />
      </div>
    );
  }
}

App.propTypes = {
  playerId: PropTypes.number,
  players: PropTypes.array,
};

App.defaultProps = {
  playerId: undefined,
  players: []
};

App.contextType = PixiAppContext;

const mapStateToProps = ({game: {playerId, players}}) => ({players, playerId});

export default connect(mapStateToProps)(App);
