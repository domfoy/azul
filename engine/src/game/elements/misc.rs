use std::fmt;

use super::{
    Colour,
    ColourGroup,
    Table,
};

#[repr(C)]
#[derive(Clone, Copy)]
pub enum PickPlace {
  Center,
  Factory(usize)
}
#[repr(C)]
pub struct Pick {
  pub colour_group: ColourGroup,
  pub has_marker: bool
}
#[repr(C)]
pub struct Action {
  colour: Colour,
  pattern_line_id: usize,
  picked_place: PickPlace,
  player_id: usize,
}
#[repr(C)]
#[derive(Clone, Debug)]
pub struct Round {
  id: usize,
  first_player: usize,
  marker: Option<usize>,
  pub table: Table
}

impl fmt::Display for Round {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    write!(f, "{}", self.table)
  }
}
#[repr(C)]
pub enum ActionResult {
  End,
  NewRound(Round),
  Pick,
}

#[repr(C)]
#[derive(Clone, Debug)]
pub struct PatternLine {
  pub colour_group: ColourGroup,
  pub index: usize,
}

#[repr(C)]
#[derive(Clone, Copy, Debug)]
pub struct WallTile {
  pub colour: Colour,
  pub is_covered: bool
}

impl fmt::Display for WallTile {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    let formatted = if self.is_covered {
      format!("{}", self.colour)
    } else {
      format!(" ")
    };

    write!(
      f,
      "{}",
      formatted
    )
  }
}