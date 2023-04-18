use std::collections::BTreeMap;
use std::sync::Mutex;
use actix_web::{post, HttpResponse, Responder};

pub struct GameState {
    games: Mutex<BTreeMap<u32, u32>>,
}

impl GameState {
    pub fn new() -> Self {
        Self {
            games: Mutex::new(BTreeMap::new())
        }
    }
}

#[post("/game")]
pub async fn create(req_body: String) -> impl Responder {
    HttpResponse::Ok().body(req_body)
}