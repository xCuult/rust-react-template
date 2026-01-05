import { apiClient } from './client';
import type { AuthResponse, LoginCredentials, RegisterCredentials, User } from '../types';

export const authApi = {
    login: (credentials: LoginCredentials): Promise<AuthResponse> =>
        apiClient.post('/auth/login', credentials),

    register: (credentials: RegisterCredentials): Promise<AuthResponse> =>
        apiClient.post('/auth/register', credentials),

    logout: (): Promise<{ message: string }> =>
        apiClient.post('/auth/logout'),

    me: (): Promise<User> =>
        apiClient.get('/auth/me'),
};