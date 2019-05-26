import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {PixiAppContext} from './context';
import './App.css';

import CurrentPlayerBoard from './board';

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
    const {startPlayerId, players} = this.props;
    const isRenderReady = !!startPlayerId && players.length > 0;

    return (
      <div className="App" ref={this.initGameCanvas}>
        {isRenderReady && (
          <CurrentPlayerBoard
            x={(app.screen.width - 400) / 2}
            y={app.screen.height - 400}
            width={400}
            height={300}
          />
        )}
      </div>
    );
  }
}

App.propTypes = {
  startPlayerId: PropTypes.number,
  players: PropTypes.array,
};

App.defaultProps = {
  startPlayerId: undefined,
  players: []
};

App.contextType = PixiAppContext;

const mapStateToProps = ({game: {startPlayerId, players}}) => {
  return {players, startPlayerId};
};

export default connect(mapStateToProps)(App);
