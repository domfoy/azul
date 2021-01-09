use std::fmt;
use std::slice::Iter;

#[repr(C)]
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum Colour {
  Black,
  Blue,
  Red,
  White,
  Yellow,
}

impl Colour {
  pub fn iterator() -> Iter<'static, Colour> {
    use Colour::*;
    static COLOURS: [Colour; 5] = [
      Black,
      Blue,
      Red,
      White,
      Yellow,
    ];

    COLOURS.iter()
  }
}

impl fmt::Display for Colour {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    use Colour::*;

    match self {
      Black => write!(f, "A"),
      Blue => write!(f, "B"),
      Red => write!(f, "C"),
      White => write!(f, "D"),
      Yellow => write!(f, "E"),
    }
  }
}

#[repr(C)]
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum ExtendedColour {
  Colour(Colour),
  Marker,
}

impl fmt::Display for ExtendedColour {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    match self {
      ExtendedColour::Colour(colour) => write!(f, "{}", colour),
      ExtendedColour::Marker => write!(f, "M"),
    }
  }
}