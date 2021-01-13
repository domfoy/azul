use std::fmt;

use super::{
    Colour,
    ExtendedColour,
};

#[repr(C)]
#[derive(Clone, Debug)]
pub struct Group<T> {
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

impl From<ColourGroup> for ExtendedColourGroup {
    fn from(cg: ColourGroup) -> ExtendedColourGroup {
        ExtendedColourGroup{
            colour: ExtendedColour::Colour(cg.colour),
            count: cg.count
        }
    }
}

impl From<ExtendedColourGroup> for ColourGroup {
    fn from(cg: ExtendedColourGroup) -> ColourGroup {
        let colour = match cg.colour {
            ExtendedColour::Marker => panic!("Tried to convert marker to colour"),
            ExtendedColour::Colour(colour) => colour,
        };
        ColourGroup{
            colour: colour,
            count: cg.count
        }
    }
}