import _ from 'lodash';

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import * as Pixi from 'pixi.js';
import {connect} from 'react-redux';

import {actions} from '../game/actions';
import Slot from '../slot';
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
    this.state = {

    };

    const {measures, parent, overPatternLine, layTile} = props;
    const {c, left, up, padding} = measures;

    const patternSide = (6 * padding.small) + (5 * c);


    for (let i = 0; i < 5; i++) {
      const patternLine = new Pixi.Graphics();

      patternLine.beginFill(0x005500);
      patternLine.drawRoundedRect(left, up + i * (c + padding.small) + padding.small, patternSide, c + padding.small, 10);
      patternLine.endFill();
      patternLine.zIndex = 20;
      patternLine.interactive = true;
      patternLine.on('mouseover', () => {
        const {turn, patternLines} = this.props;

        const targettedPatternLineId = i + 1;
        const targettedPatternLine = _.find(patternLines, {id: targettedPatternLineId});
        if (turn.colour && (targettedPatternLine.count === 0 || turn.colour === targettedPatternLine.colour)) {
          overPatternLine({patternLineId: i + 1});
        }
      });
      patternLine.on('mouseup', () => {
        const {turn, patternLines} = this.props;

        const targettedPatternLineId = i + 1;
        const targettedPatternLine = _.find(patternLines, {id: targettedPatternLineId});
        if (turn.colour && (targettedPatternLine.count === 0 || turn.colour === targettedPatternLine.colour)) {
          layTile();
        }
      });

      parent.addChild(patternLine);
    }

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
        {_.map(patternSlots, (slotLine, line) => _.map(slotLine, (slot, col) => (
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

PatternLines.propTypes = {
  turn: PropTypes.object.isRequired,
  parent: PropTypes.object.isRequired,
  overPatternLine: PropTypes.func.isRequired,
  layTile: PropTypes.func.isRequired,
  patternLines: PropTypes.array.isRequired,
  measures: PropTypes.object.isRequired,
};

const mapStateToProps = ({game: {turn}}) => ({turn});

const mapDispatchToProps = dispatch => ({
  overPatternLine: ({patternLineId}) => dispatch(actions.overPatternLine({patternLineId})),
  layTile: () => dispatch(actions.layTile())
});

export default connect(mapStateToProps, mapDispatchToProps)(PatternLines);
