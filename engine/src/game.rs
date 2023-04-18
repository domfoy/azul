use std::fmt;

use itertools::Itertools;
use serde::{Serialize, Deserialize};

use crate::logic;
use crate::elements::{
  Action,
  ActionResult,
  Bag,
  Player,
  Round,
};

pub const COLOUR_COUNT : usize = 5;
pub const MAX_PENALTY_COUNT : u8 = 8;

#[repr(C)]
#[derive(Debug, Serialize, Deserialize)]
pub struct Game {
  pub(crate) bag: Bag,
  pub(crate) players: Vec<Player>,
  pub(crate) round: Round
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

  pub fn prepare_round(&mut self) -> Round {
    logic::prepare_round(self)
  }

  pub fn step(&mut self, action: Action) -> ActionResult {
    logic::add_action(self, &action);

    if self.round.is_factory_offer_ended() {
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
mod tests;