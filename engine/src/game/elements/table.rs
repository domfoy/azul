use std::fmt;
use std::ops::Deref;

use itertools::Itertools;

use super::{
    Colour,
    ColourGroup,
    ExtendedColour,
    ExtendedColourGroup,
    Pick,
};
#[repr(C)]
#[derive(Clone, Debug)]
pub struct Factory(pub Vec<ColourGroup>);
#[repr(C)]
#[derive(Clone, Debug)]
pub struct Center(Vec<ExtendedColourGroup>);

impl Deref for Factory {
    type Target = Vec<ColourGroup>;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}
impl Deref for Center {
    type Target = Vec<ExtendedColourGroup>;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

impl Factory {
    pub fn new() -> Self {
        Self(vec!())
    }
    pub fn pick_colour(&mut self, colour: Colour) -> Pick {
        let colour_group_index = self.0
            .iter()
            .position(|colour_group| colour_group.colour == colour)
            .ok_or_else(|| "No colour in picked factory")
            .unwrap();

        let colour_group = self.0.remove(colour_group_index);

        Pick{
            colour_group: colour_group.into(),
            has_marker: false
        }
    }
}
impl Center {
    pub fn pick_colour(&mut self, colour: Colour) -> Pick {
        let colour_group_index = self.0
            .iter()
            .position(|colour_group| colour_group.colour == ExtendedColour::Colour(colour))
            .ok_or_else(|| "No colour in center")
            .unwrap();

        let colour_group = self.0.remove(colour_group_index);

        Pick{
            colour_group: colour_group.into(),
            has_marker: self.has_marker()
        }
    }

    fn has_marker(&self) -> bool {
        self.0
            .iter()
            .find(|extended_colour_group| extended_colour_group.colour == ExtendedColour::Marker)
            .is_some()
    }
}

#[repr(C)]
#[derive(Clone, Debug)]
pub struct Table {
  pub center: Center,
  pub factories: Vec<Factory>,
}

impl fmt::Display for Table {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    let formatted_center = self.center.0.iter().format(", ");
    let formatted_factories= self.factories
      .iter()
      .format_with("\n", |factory, f| {
        f(&factory.0.iter().format(", "))
      });

    write!(f, "c: {},\nfs:\n{}", formatted_center, formatted_factories)
  }
}

impl Table {
  pub fn new(player_count: usize) -> Self {
    let factory_count = match player_count {
      2 => 5,
      3 => 7,
      4 => 9,
      _ => panic!("Wrong player count when instantiating Table")
    };

    let mut factories = vec!();
    for _ in 0..factory_count {
      factories.push(Factory::new());
    }

    Table{
      center: vec!(),
      factories
    }
  }

  pub fn is_empty(&self) -> bool {
    self.center.len() == 0
      && self.factories
        .iter()
        .all(|factory| factory.len() == 0)
  }
}