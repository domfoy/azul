import _ from 'lodash';

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import * as Pixi from 'pixi.js';

import {withPixiApp} from '../context';
import Slot from '../slot';
import PatternLines from './pattern-lines';

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

class PlayerBoard extends Component {
  constructor(props) {
    super(props);

    const {app, xCenter, yCenter} = props;

    const padding = {
      small: 4,
      medium: 4,
      large: 8
    };
    const c = 32;
    const W = (14 * padding.small) + (10 * c) + (padding.large);
    const H = (10 * padding.small) + (6 * c) + padding.large;

    const left = xCenter - (W / 2);
    const up = yCenter - (H / 2);

    Object.assign(this, {
      c, W, H, left, up, padding
    });

    const board = new Pixi.Graphics();
    board.beginFill(0x005500);
    board.drawRoundedRect(left - 5, up - 5, W + 10, H + 10, 10);
    board.beginFill(0x001100);
    board.drawRoundedRect(left, up, W, H, 10);
    board.endFill();

    app.stage.addChild(board);
  }


  render() {
    const {player} = this.props;
    const {c, H, left, up, padding} = this;
    const patternSide = (6 * padding.small) + (5 * c);

    return (
      <div>
        <PatternLines
          measures={{c, H, left, up, padding}}
          patternLines={player.patternLines}
        />
        {_.map(wallSlots, (slotLine, line) => _.map(slotLine, (slot, col) => (
          <Slot
            key={col + (line * 5)}
            x={left + padding.small + patternSide + padding.large + (padding.small + c) * (col)}
            y={up + padding.small + (padding.small + c) * (line)}
            width={c}
            height={c}
          />
        )))}
        {_.map([0, 1, 2, 3, 4, 5, 6], col => (
          <Slot
            key={col}
            x={left + padding.small + (padding.small + c) * col}
            y={up + H - (2 * padding.small) - c}
            width={c}
            height={c}
          />
        ))}
      </div>
    );
  }
}

PlayerBoard.propTypes = {
  app: PropTypes.object.isRequired,
  player: PropTypes.object.isRequired,
  xCenter: PropTypes.number.isRequired,
  yCenter: PropTypes.number.isRequired
};

export default withPixiApp(PlayerBoard);
