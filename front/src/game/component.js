import _ from 'lodash';

import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {withPixiApp} from '../context';
import FactorySet from '../factory';
import PlayerBoard from '../board';

function Game({app, players, playerId, factories}) {
  const currentPlayer = _.find(players, {id: playerId});
  const opponents = _.filter(players, player => player.id !== playerId);
  return (
    <div>
      <PlayerBoard
        xCenter={(app.screen.width) / 2}
        yCenter={app.screen.height - 200}
        player={currentPlayer}
      />

      {_.map(opponents, opponent => (
        <PlayerBoard
          key={opponent.id}
          xCenter={(app.screen.width) / 2}
          yCenter={200}
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

Game.propTypes = {
  app: PropTypes.object.isRequired,
  factories: PropTypes.array.isRequired,
  playerId: PropTypes.number.isRequired,
  players: PropTypes.array.isRequired,
};

const mapStateToProps = ({game: {startPlayerId, players, playerId, factories}}) => ({players, startPlayerId, playerId, factories});

export default connect(mapStateToProps)(withPixiApp(Game));