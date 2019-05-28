import {Component} from 'react';
import PropTypes from 'prop-types';
import * as Pixi from 'pixi.js';

import {withPixiApp} from './context';

class Tile extends Component {
  constructor(props) {
    super(props);

    const {app, x, y, width, height, colour} = props;

    let colourCode;
    switch (colour) {
      case 'Bu':
        colourCode = 0x001166;
        break;
      case 'Ba':
        colourCode = 0x11111;
        break;
      case 'W':
        colourCode = 0x888888;
        break;
      case 'R':
        colourCode = 0x661100;
        break;
      case 'Y':
        colourCode = 0x666611;
        break;
      default:
        colourCode = 0x222222;
        break;
    }

    const board = new Pixi.Graphics();
    board.beginFill(colourCode);
    board.drawRoundedRect(x, y, width, height, 5);
    board.endFill();

    app.stage.addChild(board);
  }

  render() {
    return null;
  }
}

Tile.propTypes = {
  app: PropTypes.object.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  colour: PropTypes.string.isRequired
};

export default withPixiApp(Tile);
