import _ from 'lodash';

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import * as Pixi from 'pixi.js';

import {withPixiApp} from '../context';
import Slot from './slot';

class ContentBox {
  constructor({x, y, width, height, padding = 20}) {
    Object.assign(this, {
      x: x + padding,
      y: y + padding,
      width: width - (2 * padding),
      height: height - (2 * padding),
      padding
    });
  }
}

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

const wallSlots = [1, 2, 3, 4, 5].map((line) => {
  const slots = [];

  for (let col = 1; col <= 5; col++) {
    slots.push({
      col,
      line
    });
  }

  return slots;
});

function specificPlayerBoard(mapStateToProps) {
  class PlayerBoard extends Component {
    constructor(props) {
      super(props);

      const {app, x, y, width, height} = props;
      this.contentBox = new ContentBox({x: x + 5, y: y + 5, width: width - 10, height: height - 10});

      const board = new Pixi.Graphics();
      board.beginFill(0x005500);
      board.drawRoundedRect(x, y, width, height, 10);
      board.beginFill(0x001100);
      board.drawRoundedRect(x + 5, y + 5, width - 10, height - 10, 10);
      board.endFill();

      app.stage.addChild(board);
    }


    render() {
      const patternWidth = this.contentBox.width / 2 - 10;
      const patternHeight = this.contentBox.height - 10;

      return (
        <div>
          {_.map(patternSlots, (slotLine, line) => _.map(slotLine, (slot, col) => (
            <Slot
              key={col + (line * 5)}
              x={this.contentBox.x + 5 + patternWidth - ((patternWidth / 5) * (col + 1))}
              y={this.contentBox.y + 5 + (patternHeight / 5) * (line)}
              width={patternWidth / 5}
              height={patternHeight / 5}
            />
          )))}
          {_.map(wallSlots, (slotLine, line) => _.map(slotLine, (slot, col) => (
            <Slot
              key={col + (line * 5)}
              x={this.contentBox.x + this.contentBox.width / 2 + 5 + (patternWidth / 5) * (col)}
              y={this.contentBox.y + 5 + (patternHeight / 5) * (line)}
              width={patternWidth / 5}
              height={patternHeight / 5}
            />
          )))}
        </div>
      );
    }
  }

  PlayerBoard.propTypes = {
    app: PropTypes.object.isRequired,
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
  };

  return connect(mapStateToProps)(withPixiApp(PlayerBoard));
}

export default specificPlayerBoard;
