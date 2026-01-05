import type { ApiError } from '../types';

const API_BASE = "/api";

class ApiClient {
    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${API_BASE}${endpoint}`;

        const config: RequestInit = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            credentials: 'include', // Inportant for cookies
        };

        const response = await fetch(url, config);

        if (!response.ok) {
            const error: ApiError = await response.json();
            throw new Error(error.error.message);
        }

        return response.json();
    }

    get<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, { method: 'GET' });
    }

    post<T>(endpoint: string, data?: unknown): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        });
    }
}

export const apiClient = new ApiClient();