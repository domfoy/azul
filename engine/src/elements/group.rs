use std::fmt;
use serde::{Serialize, Deserialize, Deserializer};

use super::{
    Colour,
    ExtendedColour,
};

#[repr(C)]
#[derive(Clone, Debug, Serialize)]
pub struct Group<T> {
  pub colour: T,
  pub count: u8,
}

impl<'de, T> Deserialize<'de> for Group<T> {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: Deserializer<'de>,
    {
        let s: &str = Deserialize::deserialize(deserializer)?;
        if s.len() != 2 {
            return D::Error::custom;
        }

        Ok(Group::<T>({
          colour: Deserialize.deserialize<T>(str[0]),
          count: Deserialize.deserialize<u8>(str[1]),
        }))
    }
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