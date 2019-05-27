import _ from 'lodash';

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Slot from './slot';
import Tile from '../tile';

const patternSlots = [1, 2, 3, 4, 5].map((line) => {
  const slots = [];

  for (let col = 1; col <= line; col++) {
    slots.push({
      col,
      line
    });
  }

  return slots;
});

class PatternLines extends Component {
  constructor(props) {
    super(props);

    const {measures} = props;
    const {c, left, up, padding} = measures;

    const patternSide = (6 * padding.small) + (5 * c);

    function renderTiles({line, count, colour}) {
      const renderList = [];

      for (let col = 1; col <= count; col++) {
        renderList.push(
          <Tile
            x={left + patternSide - (padding.small + c) * col}
            y={up + padding.small + (padding.small + c) * line}
            colour={colour}
          />
        );
      }

      return renderList;
    }

    this.renderTiles = renderTiles;
  }


  render() {
    const {patternLines, measures} = this.props;
    const {c, left, up, padding, patternSide} = measures;
    const {renderTiles} = this;

    console.log(patternSlots);
    return (
      <div>
        {_.map(patternSlots, (slotLine, line) => _.map(slotLine, (slot, col) => (
          <Slot
            key={col + (line * 5)}
            x={left + patternSide - (padding.small + c) * (col + 1)}
            y={up + padding.small + (padding.small + c) * (line)}
            width={c}
            height={c}
            colour
          />
        )))}
        {_.map(patternLines, renderTiles)}
      </div>
    );
  }
}

PatternLines.propTypes = {
  patternLines: PropTypes.array.isRequired,
  measures: PropTypes.object.isRequired,
};

export default PatternLines;
