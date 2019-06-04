import _ from 'lodash';

import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import Factory from './factory';
import TableCenter from './table-center';

function FactorySet({factories, xCenter: x, yCenter: y, tableCenter}) {
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
        factory={factory}
      />
    );
  });

  return (
    <div>
      {factoryComponents}
      <TableCenter
        tableCenter={tableCenter}
        x={x - 2 * radius + 2 * 32}
        y={y - radius + 2 * 32}
      />
    </div>
  );
}

FactorySet.propTypes = {
  tableCenter: PropTypes.array.isRequired,
  factories: PropTypes.array.isRequired,
  xCenter: PropTypes.number.isRequired,
  yCenter: PropTypes.number.isRequired
};

const mapStateToProps = ({game: {factories, tableCenter}}) => ({factories, tableCenter});

export default connect(mapStateToProps)(FactorySet);
