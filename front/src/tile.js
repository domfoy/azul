import {Component} from 'react';
import PropTypes from 'prop-types';
import * as Pixi from 'pixi.js';

import {withPixiApp} from './context';

class Tile extends Component {
  constructor(props) {
    super(props);

    const {app, x, y, width, height, colour} = props;
    const colourCode = colour ? 0x005500 : 0x550000;

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
