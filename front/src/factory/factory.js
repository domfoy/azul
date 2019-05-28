import _ from 'lodash';

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Tile from '../tile';

class Factory extends Component {
  render() {
    const {bucket, xCenter, yCenter} = this.props;
    const padding = 2;
    const c = 32;
    const tiles = _.map(bucket, (tile, index) => (
      <Tile
        key={tile.id}
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
  bucket: PropTypes.array.isRequired,
  xCenter: PropTypes.number.isRequired,
  yCenter: PropTypes.number.isRequired
};

export default Factory;
