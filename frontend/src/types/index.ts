export interface User {
    id: string;
    username: string;
    created_at: string;
}

export interface AuthResponse {
    user: User;
    message: string;
}

export interface ApiError {
    error: {
        type: string;
        message: string;
    };
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface RegisterCredentials {
    username: string;
    password: string;
}