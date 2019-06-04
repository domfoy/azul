import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {actions} from '../game/actions';
import Tile from '../tile';


class TableCenter extends Component {
  render() {
    const {tableCenter, x, y, pickTile} = this.props;
    const padding = 2;
    const c = 32;
    const handleClick = colour => () => pickTile({colour});

    const tileComponents = [];
    let index = 0;
    for (let groupIndex = 0; groupIndex < tableCenter.length; groupIndex++) {
      const tileGroup = tableCenter[groupIndex];
      for (let i = 0; i < tileGroup.count; i++) {
        tileComponents.push(<Tile
          key={index}
          onClicked={handleClick(tileGroup.colour)}
          x={index < 8 ? x + (padding + c) * index : x + (padding + c) * (index - 8)}
          y={index < 8 ? y : y + padding + c}
          width={c}
          height={c}
          colour={tileGroup.colour}
        />);
        index += 1;
      }
    }

    return tileComponents;
  }
}

TableCenter.propTypes = {
  pickTile: PropTypes.func.isRequired,
  tableCenter: PropTypes.array.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired
};

const mapDispatchToProps = dispatch => ({
  pickTile: ({colour}) => dispatch(actions.pickTile({factory: {id: 0}, colour}))
});

export default connect(null, mapDispatchToProps)(TableCenter);
