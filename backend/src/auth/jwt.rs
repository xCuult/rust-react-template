use chrono::{Duration, Utc};
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::config::Config;
use crate::error::{AppError, AppResult};

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: Uuid,           // User ID
    pub username: String,
    pub exp: i64,            // Expiration timestamp
    pub iat: i64,            // Issued at
}

/// Generate JWT token for authenticated user
pub fn generate_token(user_id: Uuid, username: &str, config: &Config) -> AppResult<String> {
    let now = Utc::now();
    let expiration = now + Duration::hours(config.jwt_expiration_hours);

    let claims = Claims {
        sub: user_id,
        username: username.to_string(),
        exp: expiration.timestamp(),
        iat: now.timestamp(),
    };

    let token = encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(config.jwt_secret.as_bytes()),
    )
    .map_err(|e| AppError::Internal(anyhow::anyhow!("Token generation failed: {}", e)))?;

    Ok(token)
}

/// Validate and decode JWT token
pub fn validate_token(token: &str, config: &Config) -> AppResult<Claims> {
    let token_data = decode::<Claims>(
        token,
        &DecodingKey::from_secret(config.jwt_secret.as_bytes()),
        &Validation::default(),
    )
    .map_err(|e| match e.kind() {
        jsonwebtoken::errors::ErrorKind::ExpiredSignature => {
            AppError::Auth("Token has expired".to_string())
        }
        jsonwebtoken::errors::ErrorKind::InvalidToken => {
            AppError::Auth("Invalid token".to_string())
        }
        _ => AppError::Auth(format!("Token validation failed: {}", e)),
    })?;

    Ok(token_data.claims)
}