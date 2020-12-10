use std::fmt;

use super::{
    Colour,
    ExtendedColour,
};

#[repr(C)]
#[derive(Clone, Debug)]
struct Group<T> {
  pub colour: T,
  pub count: u8,
}

impl<T: fmt::Display> fmt::Display for Group<T> {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    write!(f, "{}{}", self.colour, self.count)
  }
}
pub type ColourGroup = Group<Colour>;
pub type ExtendedColourGroup = Group<ExtendedColour>;