use std::fmt;

use itertools::Itertools;

use super::{
    PatternLine,
    ExtendedColourGroup,
    Wall,
};

#[repr(C)]
#[derive(Debug)]
pub struct Board {
  pub floor_line: Vec<ExtendedColourGroup>,
  pub pattern_lines: Vec<PatternLine>,
  pub wall: Wall,
}

impl fmt::Display for Board {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    let mut res =vec!();

    for i in 0..5 {
      let default_formatted_pattern_line = format!("{: >3}", "");
      let formatted_pattern_line = self.pattern_lines
        .iter()
        .find(|pattern_line| pattern_line.index == i)
        .map_or(
          default_formatted_pattern_line,
          |pattern_line| format!("{: >3}", pattern_line.colour_group)
        );

      let formatted_wall_line = self.wall.0[i..i+5]
      .iter()
      .format(", ");

      res.push(format!(
        "\n{} --> {}",
        formatted_pattern_line,
        formatted_wall_line
      ));
    }

    write!(
      f,
      "{}",
      res.iter().join("")
    )
  }
}

impl Board {
  pub fn get_pattern_line(&self, index: usize) -> Option<&PatternLine> {
    self.pattern_lines
      .iter()
      .find(|pattern_line| pattern_line.index == index)
  }
  pub fn get_pattern_line_mut(&mut self, index: usize) -> Option<&mut PatternLine> {
    self.pattern_lines
      .iter_mut()
      .find(|pattern_line| pattern_line.index == index)
  }
}