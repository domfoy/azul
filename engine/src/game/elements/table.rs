use std::fmt;

use itertools::Itertools;

use super::{
    ColourGroup,
};

#[repr(C)]
#[derive(Clone, Debug)]
pub struct Table {
  pub center: Vec<ColourGroup>,
  pub factories: Vec<Vec<ColourGroup>>,
}

impl fmt::Display for Table {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    let formatted_center = self.center.iter().format(", ");
    let formatted_factories= self.factories
      .iter()
      .format_with("\n", |factory, f| {
        f(&factory.iter().format(", "))
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
      factories.push(vec!());
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