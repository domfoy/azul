import _ from 'lodash';

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import * as Pixi from 'pixi.js';

import Slot from '../slot';
import Tile from '../tile';

export default (config) => {
  class Line extends Component {
    constructor(props) {
      super(props);
      this.state = {};

      const {
        measures,
        handleMouseUp,
        handleMouseOver,
        parent
      } = props;
      const {
        left,
        up,
        width,
        height
      } = measures;

      const pixiLine = new Pixi.Graphics();

      pixiLine.beginFill(0x005500);
      pixiLine.drawRoundedRect(
        left,
        up,
        width,
        height,
        10
      );
      pixiLine.endFill();
      pixiLine.zIndex = 20;
      pixiLine.interactive = true;
      pixiLine.on('mouseover', handleMouseOver);
      pixiLine.on('mouseup', handleMouseUp);

      parent.addChild(pixiLine);

      function renderTiles({id, count, colour}) {
        const renderList = [];

        if (!(_.isNumber(id) && colour)) {
          return renderList;
        }

        const line = id - 1;
        for (let col = 1; col <= count; col++) {
          renderList.push(
            <Tile
              key={col + (line * 5)}
              height={c}
              width={c}
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
      const {parent, patternLines, measures} = this.props;
      const {c, left, up, padding} = measures;
      const patternSide = (6 * padding.small) + (5 * c);
      const {renderTiles} = this;

      return (
        <div>
          {_.map(config.patternSlots, (slotLine, line) => _.map(slotLine, (slot, col) => (
            <Slot
              key={col + (line * 5)}
              x={left + patternSide - (padding.small + c) * (col + 1)}
              y={up + padding.small + (padding.small + c) * (line)}
              width={c}
              height={c}
              parent={parent}
              colour
            />
          )))}
          {_.map(patternLines, renderTiles)}
        </div>
      );
    }
  }

  Line.propTypes = {
    parent: PropTypes.object.isRequired,
    handleMouseOver: PropTypes.func.isRequired,
    handleMouseUp: PropTypes.func.isRequired,
    patternLines: PropTypes.array.isRequired,
    measures: PropTypes.object.isRequired,
  };

  return Line;
};
