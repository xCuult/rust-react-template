use axum::{
    extract::{Request, State},
    middleware::Next,
    response::Response,
};
use axum_extra::extract::CookieJar;

use crate::auth::jwt;
use crate::error::AppError;
use crate::AppState;

/// Authenticated user data available in handlers
#[derive(Debug, Clone)]
pub struct AuthenticatedUser {
    pub id: uuid::Uuid,
    pub username: String,
}

pub async fn auth_middleware(
    State(state): State<AppState>,
    jar: CookieJar,
    mut request: Request,
    next: Next,
) -> Result<Response, AppError> {
    let token = jar
        .get("token")
        .map(|c| c.value().to_string())
        .ok_or_else(|| AppError::Auth("No authentication token found".to_string()))?;

    let claims = jwt::validate_token(&token, &state.config)?;

    let auth_user = AuthenticatedUser {
        id: claims.sub,
        username: claims.username,
    };
    request.extensions_mut().insert(auth_user);

    Ok(next.run(request).await)
}