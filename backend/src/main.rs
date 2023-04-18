use actix_web::{web, App, HttpServer};

mod api;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let state = web::Data::new(
        api::game::GameState::new()
    );

    HttpServer::new(move || {
        App::new()
            .app_data(state.clone())
            .service(api::game::create)
            .route("/hey", web::get().to(api::manual_hello))
    })
    .bind("localhost:8080")?
    .run()
    .await
}