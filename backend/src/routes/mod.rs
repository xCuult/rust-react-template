pub mod auth;

use axum::Router;
use crate::AppState;

pub fn create_routes(state: AppState) -> Router<AppState> {
    Router::new()
        .merge(auth::public_routes())
        .merge(auth::protected_routes(state))
        .route("/health", axum::routing::get(crate::handlers::health::health_check))
}