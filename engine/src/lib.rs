pub mod game;

use game::Game;

#[no_mangle]
pub extern "C" fn azul_game_new() -> *mut Game {
    let game = Box::new(Game::new(2));

    Box::into_raw(game)
}

#[no_mangle]
pub extern "C" fn azul_game_free(ptr: *mut Game) {
    println!("Freeing the game");
    if ptr.is_null() {
        return;
    }
    unsafe {
        Box::from_raw(ptr);
    }
}
