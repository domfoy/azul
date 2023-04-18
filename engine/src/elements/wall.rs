use serde::{Serialize, Deserialize};

use super::{
    Colour,
    WallTile,
};

#[repr(C)]
#[derive(Debug, Serialize, Deserialize)]
pub struct Wall(pub [WallTile; 25]);

impl std::ops::Index<(usize, usize)> for Wall {
  type Output = WallTile;

  fn index(&self, coord: (usize, usize)) -> &Self::Output {
    let i = coord.0 % 5;
    let j = coord.1 % 5;

    &self.0[j + 5 * i]
  }
}

impl std::ops::IndexMut<(usize, usize)> for Wall {
  fn index_mut(&mut self, coord: (usize, usize)) -> &mut Self::Output {
    let i = coord.0 % 5;
    let j = coord.1 % 5;

    &mut self.0[j + 5 * i]
  }
}

const COLOUR_ORDER : [Colour; 5] = [
  Colour::Blue,
  Colour::Yellow,
  Colour::Red,
  Colour::Black,
  Colour::White,
];

impl Wall {
  pub fn new() -> Self {
    let mut res = [
      WallTile{
        colour: Colour::Black,
        is_covered: false
      };
      25
    ];

    for i in 0..5 {
      for j in 0..5 {
        res[j + 5 * i].colour = COLOUR_ORDER[(j + 5 - i) % 5];
      }
    }

    Self(res)
  }

  pub fn is_line_full(&self, i: usize) -> bool {
    for j in 0..5 {
      if !self[(i, j)].is_covered {
        return false;
      }
    }

    true
  }
}