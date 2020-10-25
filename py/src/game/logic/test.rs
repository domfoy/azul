extern crate glob;

use super::*;

#[test]
fn game_is_initiated() {
  let mut game = Game::new(2);
  game.prepare_round();

  println!("{}", &game);
  assert_eq!(game.round.table.factories[0].len() > 1, true);
  assert_eq!(game.bag.0.iter().fold(0, |acc, colour_group| acc + colour_group.count), 80);

  let colour = game.round.table.factories[0][0].colour;
  let token_count = game.round.table.factories[0][0].count;
  let action = Action{
    colour,
    pattern_line_id: 3,
    picked_place: PickPlace::Factory(0),
    player_id: 0,
  };

  game.apply_action(action);

  println!("{}", &game);

  let modified_pattern_line = game.players[0].board.get_pattern_line(3).unwrap();

  assert_eq!(modified_pattern_line.colour_group.colour, colour);
  assert_eq!(modified_pattern_line.colour_group.count, token_count);
  let test = game.round.table.factories[0].iter().find(|colour_group| colour_group.colour == colour);

  let res = match test {
    None => true,
    Some(_) => false
  };
  assert_eq!(res, true);
}

#[test]
fn run_actions() {
  use glob::glob;
  use yaml_rust::yaml;

  let mut yaml_glob_pattern = std::env::current_dir()
    .unwrap();
  yaml_glob_pattern.push("src/game/logic/data/*.yaml");
  let yaml_glob_pattern = yaml_glob_pattern.as_os_str().to_str().unwrap();

  let entries = glob(&yaml_glob_pattern).unwrap();
  // print!("{:?}", entries.count());
  for entry in entries {
    let path = entry.unwrap();

    let file = std::fs::read_to_string(path).unwrap();

    let file_yaml = yaml::YamlLoader::load_from_str(&file).unwrap();

    Game::load_from_yaml(&file_yaml[0].as_hash()[&yaml::Yaml::from_str("game")])

    print!("{:?}", &file);
  }
}

