use std::fmt;
use itertools::Itertools;
use yaml_rust::yaml;

use super::MAX_PENALTY_COUNT;
use super::elements::{
  Action,
  Board,
  ColourGroup,
  ExtendedColour,
  ExtendedColourGroup,
  PatternLine,
  Pick,
  PickPlace,
  Round,
};

use super::Game;

pub fn add_penalty(board: &mut Board, penalty: ExtendedColourGroup) -> () {
  if penalty.count == 0 {
    return;
  }

  let penalty_count = board.floor_line
    .iter()
    .fold(
      0,
      |acc, extended_colour_group| acc + extended_colour_group.count
    );
  let free_penalty_count = MAX_PENALTY_COUNT - penalty_count as u8;

  if free_penalty_count == 0 {
    return;
  }

  board.floor_line.push(ExtendedColourGroup{
    colour: penalty.colour,
    count: if penalty.count <= free_penalty_count {
      penalty.count
    } else {
      free_penalty_count
    }
  });
}

fn add_penalties_to_player_board(board: &mut Board, penalties: Vec<ExtendedColourGroup>) -> () {
  for penalty in penalties {
     add_penalty(board, penalty)
  }
}

pub fn get_penalty_count(game: &mut Game, action: &Action, picked_colour_group: ColourGroup) -> u8 {
  let player_board = &mut game.players[action.player_id].board;
  let found_pattern_line = player_board
    .get_pattern_line_mut(action.pattern_line_id);

  if found_pattern_line.is_none() {
    player_board.pattern_lines.push(PatternLine{
      colour_group: ColourGroup{
        colour: picked_colour_group.colour,
        count: 0
      },
      index: action.pattern_line_id,
    });
  }

  let pattern_line = player_board
    .get_pattern_line_mut(action.pattern_line_id)
    .unwrap();

  let max_count = (pattern_line.index as u8) + 1;
  let free_pattern_count = max_count - pattern_line.colour_group.count as u8;
  if picked_colour_group.count <= free_pattern_count {
    pattern_line.colour_group.count += picked_colour_group.count;

    return 0;
  }
  pattern_line.colour_group.count = max_count;

  return (picked_colour_group.count - free_pattern_count) as u8;
}

fn add_pick(game: &mut Game, action: &Action, pick: Pick) -> Vec<ExtendedColourGroup> {
  let penalty_count = get_penalty_count(game, action, pick.colour_group);

  let mut penalties = vec!(ExtendedColourGroup{
    colour: ExtendedColour::Colour(action.colour),
    count: penalty_count
  });

  if pick.has_marker {
    penalties.push(ExtendedColourGroup{
      colour: ExtendedColour::Marker,
      count: 1
    });
  }

  penalties
}

pub fn add_pick_to_player_board(game: &mut Game, action: &Action, pick: Pick) -> () {
  let penalties = add_pick(game, &action, pick);

  let player_board = &mut game.players[action.player_id].board;
  add_penalties_to_player_board(player_board, penalties);
}

pub fn retrieve_pick(game: &mut Game, action: &Action) -> Pick {
  let mut has_marker = false;
  let picked_place = match action.picked_place {
    PickPlace::Center => {
      if game.round.marker.is_none() {
        game.round.marker = Some(action.player_id);
        has_marker = true;
      }

      &mut game.round.table.center
    },
    PickPlace::Factory(factory_id) => {
      &mut game.round.table.factories[factory_id]
    }
  };

  let colour_group_index = picked_place
    .iter()
    .position(|colour_group| colour_group.colour == action.colour)
    .unwrap();

  let colour_group = picked_place
    .splice(
      colour_group_index..=colour_group_index,
      std::iter::empty()
    )
    .collect::<Vec<ColourGroup>>()
    .swap_remove(0);

  Pick{
    colour_group,
    has_marker
  }
}

pub fn tile_walls(game: &mut Game) -> () {
    for player in &mut game.players {
        player.tile_wall();
    }
}

pub fn prepare_round(game: &mut Game) -> Round {
    for factory_id in 0..game.round.table.factories.len() {
        let colour_groups = game.bag.pop(4);

        game.round.table.factories[factory_id] = colour_groups;
    }

    game.round.clone()
}