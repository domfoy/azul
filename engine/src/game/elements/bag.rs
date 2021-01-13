use std::fmt;
use rand::Rng;

use itertools::Itertools;

use super::super::COLOUR_COUNT;
use super::{
    Colour,
    ColourGroup,
};

#[repr(C)]
#[derive(Debug)]
pub struct Bag(pub Vec<ColourGroup>);

impl fmt::Display for Bag {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    let formatted = self.0.iter().format(", ");

    write!(f, "{}", formatted)
  }
}

impl Bag {
  pub fn new() -> Self {
    let mut bag = Vec::with_capacity(COLOUR_COUNT);

    for &colour in Colour::iterator() {
      bag.push(ColourGroup{
        colour,
        count: 20,
      });
    }

    Self(bag)
  }

  pub fn pop_one(&mut self) -> Colour {
    let mut rng = rand::thread_rng();

    let max = self.0
      .iter()
      .fold(0, |acc, cur| acc + cur.count);
    let picked_up_index = rng.gen_range(0, max);

    let mut threshold = 0;
    let mut bag_iterator = self.0
      .iter_mut()
      .find(|current_colour_group| {
        threshold = threshold + current_colour_group.count;

        picked_up_index < threshold
      })
      .expect("Out of range bag pick");

    bag_iterator.count -= 1;
    bag_iterator.colour
  }

  pub fn pop(&mut self, count: usize) -> Vec<ColourGroup> {
    let mut colour_groups: Vec<ColourGroup> = vec!();

    let left = self.0
      .iter()
      .fold(0, |acc, colour_group| acc + colour_group.count as usize);

    if left < count {
      return vec!();
    }

    for _ in 0..count {
      let colour = self.pop_one();

      if let Some(found_group) = colour_groups
        .iter_mut()
        .find(|group| group.colour == colour) {
        found_group.count += 1;
      } else {
        colour_groups.push(ColourGroup{
          colour,
          count: 1,
        })
      }
    }

    colour_groups
  }
}