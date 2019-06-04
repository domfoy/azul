import {Component} from 'react';
import PropTypes from 'prop-types';
import * as Pixi from 'pixi.js';

import {withPixiApp} from './context';

class Slot extends Component {
  constructor(props) {
    super(props);

    const {app, x, y, width, height, parent} = props;

    const board = new Pixi.Graphics();
    board.beginFill(0x991100);
    board.drawRoundedRect(x, y, width, height, 10);
    board.beginFill(0x004400);
    board.drawRoundedRect(x + 2, y + 2, width - 4, height - 4, 10);
    board.endFill();
    board.zIndex = 10;

    (parent || app.stage).addChild(board);
  }

  render() {
    return null;
  }
}

Slot.propTypes = {
  app: PropTypes.object,
  parent: PropTypes.object,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired
};

Slot.defaultProps = {
  app: undefined,
  parent: undefined
};

export default withPixiApp(Slot);
