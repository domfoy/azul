import _ from 'lodash';

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Factory from './factory';

class FactorySet extends Component {
  render() {
    const {factories, xCenter: x, yCenter: y} = this.props;
    const genericFactories = _.filter(factories, f => f.id > 0);
    const factoryCount = genericFactories.length;
    const radius = 110;

    const factoryComponents = _.map(genericFactories, (factory) => {
      const shift = Math.PI / 2;
      const fullRadian = 2 * Math.PI;

      return (
        <Factory
          key={factory.id}
          xCenter={x + (radius * 2 * Math.cos(fullRadian * (factory.id - 1) / factoryCount + shift))}
          yCenter={y + (radius * Math.sin(fullRadian * (factory.id - 1) / factoryCount + shift))}
          bucket={factory.tiles}
        />
      );
    });

    return factoryComponents;
  }
}

FactorySet.propTypes = {
  factories: PropTypes.array.isRequired,
  xCenter: PropTypes.number.isRequired,
  yCenter: PropTypes.number.isRequired
};

export default FactorySet;
