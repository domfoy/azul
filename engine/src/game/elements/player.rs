use std::fmt;

use super::{
    Board,
    Wall,
};

#[repr(C)]
#[derive(Debug)]
pub struct Player {
  pub board: Board,
  score: i8,
}

impl fmt::Display for Player {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    write!(
      f,
      "{}",
      self.board
    )
  }
}

impl Player {
  pub fn new() -> Self {
    let board = Board{
      floor_line: vec!(),
      pattern_lines: vec!(),
      wall: Wall::new(),
    };

    Player{
      board,
      score: 0,
    }
  }

  pub fn is_ended(&self) -> bool {
    for i in 0..5 {
      if self.board.wall.is_line_full(i) {
        return true;
      }
    }

    return false;
  }

  pub fn tile_wall(&mut self) -> () {
    for pattern_line in &mut self.board.pattern_lines {
     if pattern_line.colour_group.count < (pattern_line.index + 1) as u8 {
       return;
     }


     pattern_line.colour_group.count = 0;
    }
  }
}