import * as _ from 'lodash';

const DEFAULT_BACK_COLOUR = 'burlywood';
const COLOUR = {
  BLACK: 'darkslateblue',
  BLUE: 'mediumturquoise',
  CYAN: 'darkcyan',
  RED: 'darkred',
  YELLOW: 'darkgoldenrod',
};
const COLOUR_ORDER = [
  'BLUE',
  'YELLOW',
  'RED',
  'BLACK',
  'CYAN'
];

function PatternLine({tiles}) {
  return <div
    style={{
      display: 'flex',
      justifyContent: 'flex-end'
    }}
  >
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        columnGap: 2,
      }}
    >
      {
        tiles.map((tile, id) => {
          return <Tile
            key={id}
          ></Tile>;
        })
      }
    </div>
  </div>;
}

function PatternLines() {
  const cells = _(_.range(5)).map(lineId => {
    return _.range(lineId + 1).map(colId => {
      return {
        gridColumnStart: colId + 1,
        gridColumnEnd: colId + 2,
        gridLineStart: lineId + 1,
        gridLineEnd: lineId + 2,
      };
    });
  })
  .flatten();

  return <div
    style={{
      display: 'grid',
      gridTemplateRows: 'repeat(5, 1fr)',
      columnGap: 2,
      rowGap: 2
    }}
  >
    {
      lines.map((line, lineId) => {
        return <div
          style={{
            gridColumnStart:
          }}
        >

        </div>;
      })
    }
  </div>;
}

function Tile({colour}) {
  return <div
    style={{
      width: 25,
      height: 25,
      backgroundColor: COLOUR[colour] || DEFAULT_BACK_COLOUR,
      borderRadius:'10%'
    }}
  >
  </div>;
}

function Wall() {
  return <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      columnGap: 2,
      rowGap: 2,
    }}
  >
    {
      _.range(25).map(id => {
        return <Tile
          key={id}
          colour={COLOUR_ORDER[(id - Math.floor(id / 5)) % 5]}
        ></Tile>;
      })
    }
  </div>
}

function PlayerBoard() {
  return <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      columnGap: 4,
      rowGap: 4
    }}
  >
    <PatternLines></PatternLines>
    <Wall></Wall>
  </div>
}

export function Game() {
  return <PlayerBoard></PlayerBoard>;
}