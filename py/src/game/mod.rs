use std::fmt;
use itertools::Itertools;

pub mod logic;

pub use logic::Game;

use std::slice::Iter;
use rand::Rng;

const COLOUR_COUNT : usize = 5;
const MAX_PENALTY_COUNT : u8 = 8;

#[derive(Clone, Copy, Debug, Eq, PartialEq)]
enum Colour {
  Black,
  Blue,
  Red,
  White,
  Yellow,
}

impl Colour {
  fn iterator() -> Iter<'static, Colour> {
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

#[derive(Clone, Copy, Debug, Eq, PartialEq)]
enum ExtendedColour {
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

#[derive(Clone, Debug)]
struct Group<T> {
  colour: T,
  count: u8,
}

impl<T: fmt::Display> fmt::Display for Group<T> {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    write!(f, "{}{}", self.colour, self.count)
  }
}

type ColourGroup = Group<Colour>;
type ExtendedColourGroup = Group<ExtendedColour>;

#[derive(Clone, Debug)]
struct Table {
  center: Vec<ColourGroup>,
  factories: Vec<Vec<ColourGroup>>,
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
  fn new(player_count: usize) -> Self {
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

  fn is_empty(&self) -> bool {
    self.center.len() == 0
      && self.factories
        .iter()
        .all(|factory| factory.len() == 0)
  }
}

#[derive(Clone, Debug)]
struct PatternLine {
  colour_group: ColourGroup,
  index: usize,
}

#[derive(Clone, Copy, Debug)]
struct WallTile {
  colour: Colour,
  is_covered: bool
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

#[derive(Debug)]
struct Wall([WallTile; 25]);

impl std::ops::Index<(usize, usize)> for Wall {
  type Output = WallTile;

  fn index(&self, coord: (usize, usize)) -> &Self::Output {
    let i = coord.0 % 5;
    let j = coord.1 % 5;

    &self.0[j + 5 * i]
  }
}

impl std::ops::IndexMut<(usize, usize)> for Wall {
  fn index_mut(&mut self, coord: (usize, usize)) -> &mut Self::Output {
    let i = coord.0 % 5;
    let j = coord.1 % 5;

    &mut self.0[j + 5 * i]
  }
}

const COLOUR_ORDER : [Colour; 5] = [
  Colour::Blue,
  Colour::Yellow,
  Colour::Red,
  Colour::Black,
  Colour::White,
];

impl Wall {
  fn new() -> Self {
    let mut res = [
      WallTile{
        colour: Colour::Black,
        is_covered: false
      };
      25
    ];

    for i in 0..5 {
      for j in 0..5 {
        res[j + 5 * i].colour = COLOUR_ORDER[(j + 5 - i) % 5];
      }
    }

    Self(res)
  }

  fn is_line_full(&self, i: usize) -> bool {
    for j in 0..5 {
      if !self[(i, j)].is_covered {
        return false;
      }
    }

    true
  }
}

#[derive(Debug)]
struct Board {
  floor_line: Vec<ExtendedColourGroup>,
  pattern_lines: Vec<PatternLine>,
  wall: Wall,
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
  fn get_pattern_line(&self, index: usize) -> Option<&PatternLine> {
    self.pattern_lines
      .iter()
      .find(|pattern_line| pattern_line.index == index)
  }
  fn get_pattern_line_mut(&mut self, index: usize) -> Option<&mut PatternLine> {
    self.pattern_lines
      .iter_mut()
      .find(|pattern_line| pattern_line.index == index)
  }
}

#[derive(Debug)]
struct Player {
  board: Board,
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
  fn new() -> Self {
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

  fn is_ended(&self) -> bool {
    for i in 0..5 {
      if self.board.wall.is_line_full(i) {
        return true;
      }
    }

    return false;
  }

  fn tile_wall(&mut self) -> () {
    for pattern_line in &mut self.board.pattern_lines {
     if pattern_line.colour_group.count < (pattern_line.index + 1) as u8 {
       return;
     }


     pattern_line.colour_group.count = 0;
    }
  }
}

#[derive(Debug)]
struct Bag(Vec<ColourGroup>);

impl fmt::Display for Bag {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    let formatted = self.0.iter().format(", ");

    write!(f, "{}", formatted)
  }
}

impl Bag {
  fn new() -> Self {
    let mut bag = Vec::with_capacity(COLOUR_COUNT);

    for &colour in Colour::iterator() {
      bag.push(ColourGroup{
        colour,
        count: 20,
      });
    }

    Self(bag)
  }

  fn pop_one(&mut self) -> Colour {
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

  fn pop(&mut self, count: usize) -> Vec<ColourGroup> {
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

#[derive(Clone, Copy)]
enum PickPlace {
  Center,
  Factory(usize)
}

struct Pick {
  colour_group: ColourGroup,
  has_marker: bool
}

pub struct Action {
  colour: Colour,
  pattern_line_id: usize,
  picked_place: PickPlace,
  player_id: usize,
}

#[derive(Clone, Debug)]
pub struct Round {
  id: usize,
  first_player: usize,
  marker: Option<usize>,
  table: Table
}

impl fmt::Display for Round {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    write!(f, "{}", self.table)
  }
}

pub enum ActionResult {
  End,
  NewRound(Round),
  Pick,
}

