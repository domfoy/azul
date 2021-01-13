pub mod game;

use game::Game;

struct CGame {
    counter: i32,
    game: Game,
}

impl CGame {
    fn new() -> Self {
        CGame{
            counter: 0,
            game: Game::new(2)
        }
    }

    fn add_action(&mut self, action: i32) {
        self.counter += action;
    }
}

#[no_mangle]
pub extern "C" fn azul_game_new() -> *mut CGame {
    let game = Box::new(CGame::new());

    Box::into_raw(game)
}

#[no_mangle]
pub extern "C" fn azul_game_free(ptr: *mut CGame) {
    println!("Freeing the game");
    if ptr.is_null() {
        return;
    }
    unsafe {
        Box::from_raw(ptr);
    }
}

#[no_mangle]
pub extern "C" fn azul_game_add_action(game: &mut CGame, action: i32) {
    game.add_action(action);
}
