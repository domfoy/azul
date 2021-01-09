use std::fmt;

use itertools::Itertools;

mod elements;
mod logic;

use elements::{
  Action,
  ActionResult,
  Bag,
  Player,
  Round
};

const COLOUR_COUNT : usize = 5;
const MAX_PENALTY_COUNT : u8 = 8;

#[repr(C)]
#[derive(Debug)]
pub struct Game {
  bag: Bag,
  players: Vec<Player>,
  round: Round
}

impl fmt::Display for Game {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    let formatted_players = self.players
      .iter()
      .format_with("\n", |factory, f| {
        f(&factory)
      });

    write!(
      f,
      "bag: {}\nround: {}\nplayers: {}",
      self.bag,
      self.round,
      formatted_players
    )
  }
}

impl Game {
  pub fn new(player_count: usize) -> Self {
    let bag = Bag::new();

    let mut players = vec!();
    for _ in 0..player_count {
      players.push(Player::new());
    }

    let round = Round::new(player_count);
    Game{
      bag,
      players,
      round
    }
  }

  fn is_ended(&self) -> bool {
    self.players
      .iter()
      .any(|player| player.is_ended())
  }

  pub fn step(&mut self, action: Action) -> ActionResult {
    let pick = logic::retrieve_pick(self, &action);
    logic::add_pick_to_player_board(self, &action, pick);

    if !self.round.table.is_empty() {
      return ActionResult::Pick;
    }

    logic::tile_walls(self);

    if self.is_ended() {
      return ActionResult::End;
    }

    ActionResult::NewRound(logic::prepare_round(self))
  }
}

#[cfg(test)]
mod test;