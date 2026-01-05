use axum::{middleware, routing::{get, post}, Router};

use crate::auth::middleware::auth_middleware;
use crate::handlers::auth;
use crate::AppState;

pub fn public_routes() -> Router<AppState> {
    Router::new()
        .route("/auth/register", post(auth::register))
        .route("/auth/login", post(auth::login))
        .route("/auth/logout", post(auth::logout))
}

pub fn protected_routes(state: AppState) -> Router<AppState> {
    Router::new()
        .route("/auth/me", get(auth::me))
        .route_layer(middleware::from_fn_with_state(state, auth_middleware))
}