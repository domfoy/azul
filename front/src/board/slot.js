import {Component} from 'react';
import PropTypes from 'prop-types';
import * as Pixi from 'pixi.js';

import {withPixiApp} from '../context';

class PatternSlot extends Component {
  constructor(props) {
    super(props);

    const {app, x, y, width, height} = props;

    const board = new Pixi.Graphics();
    board.beginFill(0x005500);
    board.drawRoundedRect(x, y, width, height, 10);
    board.beginFill(0x001100);
    board.drawRoundedRect(x + 2, y + 2, width - 4, height - 4, 10);
    board.endFill();

    app.stage.addChild(board);
  }

  render() {
    return null;
  }
}

PatternSlot.propTypes = {
  app: PropTypes.object.isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired
};

export default withPixiApp(PatternSlot);
