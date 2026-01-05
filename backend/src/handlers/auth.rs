use axum::{extract::State, Extension, Json};
use axum_extra::extract::cookie::{Cookie, CookieJar, SameSite};
use serde_json::{json, Value};
use time::Duration;
use tracing::{info, error, debug};
use validator::Validate;

use crate::auth::{jwt, AuthenticatedUser};
use crate::error::{AppError, AppResult};
use crate::models::{AuthResponse, LoginRequest, RegisterRequest, UserResponse};
use crate::services::AuthService;
use crate::AppState;

/// POST /api/auth/register
pub async fn register(
    State(state): State<AppState>,
    jar: CookieJar,
    Json(payload): Json<RegisterRequest>,
) -> AppResult<(CookieJar, Json<AuthResponse>)> {
    info!("Registration attempt for username: {}", payload.username);
    
    // Validate input
    if let Err(e) = payload.validate() {
        error!("Validation failed: {:?}", e);
        return Err(AppError::Validation(format!("{}", e)));
    }
    debug!("Validation passed");

    // Register user
    let user = match AuthService::register(&state.db, payload).await {
        Ok(u) => {
            info!("User created successfully: {}", u.username);
            u
        }
        Err(e) => {
            error!("Registration service error: {:?}", e);
            return Err(e);
        }
    };

    // Generate token
    let token = match jwt::generate_token(user.id, &user.username, &state.config) {
        Ok(t) => {
            debug!("Token generated successfully");
            t
        }
        Err(e) => {
            error!("Token generation error: {:?}", e);
            return Err(e);
        }
    };

    // Create HttpOnly cookie
    let cookie = create_auth_cookie(&token, &state.config);
    let jar = jar.add(cookie);
    debug!("Cookie created");

    Ok((
        jar,
        Json(AuthResponse {
            user: UserResponse::from(user),
            message: "Registration successful".to_string(),
        }),
    ))
}

/// POST /api/auth/login
pub async fn login(
    State(state): State<AppState>,
    jar: CookieJar,
    Json(payload): Json<LoginRequest>,
) -> AppResult<(CookieJar, Json<AuthResponse>)> {
    info!("Login attempt for username: {}", payload.username);
    
    // Validate input
    payload
        .validate()
        .map_err(|e| AppError::Validation(format!("{}", e)))?;

    // Authenticate user
    let user = AuthService::login(&state.db, payload).await?;
    info!("User authenticated: {}", user.username);

    // Generate token
    let token = jwt::generate_token(user.id, &user.username, &state.config)?;

    // Create HttpOnly cookie
    let cookie = create_auth_cookie(&token, &state.config);
    let jar = jar.add(cookie);

    Ok((
        jar,
        Json(AuthResponse {
            user: UserResponse::from(user),
            message: "Login successful".to_string(),
        }),
    ))
}

/// POST /api/auth/logout
pub async fn logout(jar: CookieJar) -> (CookieJar, Json<Value>) {
    info!("Logout request");
    
    let cookie = Cookie::build(("token", ""))
        .path("/")
        .max_age(Duration::seconds(0))
        .http_only(true)
        .build();

    let jar = jar.add(cookie);

    (jar, Json(json!({ "message": "Logged out successfully" })))
}

/// GET /api/auth/me - Protected route
pub async fn me(
    Extension(auth_user): Extension<AuthenticatedUser>,
    State(state): State<AppState>,
) -> AppResult<Json<UserResponse>> {
    debug!("Fetching user info for: {}", auth_user.username);
    let user = AuthService::get_user(&state.db, auth_user.id).await?;
    Ok(Json(UserResponse::from(user)))
}

/// Helper to create authentication cookie
fn create_auth_cookie(token: &str, config: &crate::config::Config) -> Cookie<'static> {
    let max_age = Duration::hours(config.jwt_expiration_hours);

    let mut builder = Cookie::build(("token", token.to_string()))
        .path("/")
        .max_age(max_age)
        .http_only(true)
        .same_site(SameSite::Lax);

    if config.cookie_secure {
        builder = builder.secure(true);
    }

    builder.build()
}