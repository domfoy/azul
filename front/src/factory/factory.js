import _ from 'lodash';

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {actions} from '../game/actions';
import Tile from '../tile';

class Factory extends Component {
  render() {
    const {factory, xCenter, yCenter, pickTile} = this.props;
    const padding = 2;
    const c = 32;
    const tiles = _.map(factory.tiles, (tile, index) => (
      <Tile
        key={tile.id}
        onClicked={() => pickTile({factory, tile})}
        x={index % 2 === 0 ? xCenter - padding - c : xCenter + padding}
        y={index <= 1 ? yCenter - padding - c : yCenter + padding}
        width={c}
        height={c}
        colour={tile.colour}
      />
    ));

    return tiles;
  }
}

Factory.propTypes = {
  pickTile: PropTypes.func.isRequired,
  factory: PropTypes.object.isRequired,
  xCenter: PropTypes.number.isRequired,
  yCenter: PropTypes.number.isRequired
};

const mapDispatchToProps = dispatch => ({
  pickTile: ({factory, tile}) => dispatch(actions.pickTile({factory, tile}))
});

export default connect(null, mapDispatchToProps)(Factory);
