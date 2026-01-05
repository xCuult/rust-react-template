use sqlx::PgPool;
use uuid::Uuid;

use crate::auth::{hash_password, verify_password};
use crate::error::{AppError, AppResult};
use crate::models::{LoginRequest, RegisterRequest, User};
use crate::repository::UserRepository;

/// Auth service
pub struct AuthService;

impl AuthService {
    /// Register a new user
    pub async fn register(pool: &PgPool, request: RegisterRequest) -> AppResult<User> {
        // Check if username exists
        if UserRepository::exists_by_username(pool, &request.username).await? {
            return  Err(AppError::Conflict("Username already taken!".to_string()));
        }

        // Hash pass
        let password_hash = hash_password(&request.password)?;

        // Create user
        let user = UserRepository::create(pool, &request.username, &password_hash).await?;

        Ok(user)
    }

    /// Auth user with credentials
    pub async fn login(pool: &PgPool, request: LoginRequest) -> AppResult<User> {
        let user = UserRepository::find_by_username(pool, &request.username)
            .await?
            .ok_or_else(|| AppError::Auth("Wrong username or password!".to_string()))?;

        let is_valid = verify_password(&request.password, &user.password_hash)?;

        if !is_valid {
            return  Err(AppError::Auth("Wrong username or password!".to_string()));
        }

        Ok(user)
    }

    /// Get user by ID for token refresh, etc....
    pub async fn get_user(pool: &PgPool, user_id: Uuid) -> AppResult<User> {
        UserRepository::find_by_id(pool, user_id)
            .await?
            .ok_or_else(|| AppError::NotFound("User not found".to_string()))
    }
}