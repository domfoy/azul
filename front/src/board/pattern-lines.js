import _ from 'lodash';

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {actions} from '../game/actions';
import PatternLine from '../lines';

function PatternLines({parent, patternLines, measures}) {
  const {c, left, up, padding} = measures;
  const patternSide = (6 * padding.small) + (5 * c);
  const {renderTiles} = this;

  return (
    <div>
      {_.map(patternLines, (patternLine, i) => (
        <PatternLine
          left={left}
          up={up + i * (c + padding.small) + padding.small}
          width={patternSide}
          height={c + padding.small}
          onOver={createOnOver(i)}
          onMouseUp={createOnMouseUp(i)}
        />
      ))}
    </div>
  );
}

const createOnOver = (i) => {
  return () => {
    const {turn, patternLines} = this.props;

    const targettedPatternLineId = i + 1;
    const targettedPatternLine = _.find(patternLines, {id: targettedPatternLineId});
    if (turn.colour && (targettedPatternLine.count === 0 || turn.colour === targettedPatternLine.colour)) {
      overPatternLine({patternLineId: i + 1});
    }
  }
};

const createOnMouseUp = (i) => {
  return () => {
    const {turn, patternLines} = this.props;

    const targettedPatternLineId = i + 1;
    const targettedPatternLine = _.find(patternLines, {id: targettedPatternLineId});
    if (turn.colour && (targettedPatternLine.count === 0 || turn.colour === targettedPatternLine.colour)) {
      layTile();
    }
  }
};

PatternLines.propTypes = {
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
