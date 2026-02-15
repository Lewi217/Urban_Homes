import apiClient from '@/lib/axios';
import { LoginRequest, RegisterRequest, LoginResponse, ApiResponse, User } from '@/types';

export const authService = {
    async register(data: RegisterRequest): Promise<User> {
        const response = await apiClient.post<ApiResponse<User>>('/v1/users/register', data);
        return response.data.data;
    },

    async login(data: LoginRequest): Promise<LoginResponse> {
        const response = await apiClient.post<ApiResponse<LoginResponse>>('/v1/users/login', data);
        const loginData = response.data.data;

        // Store token and user data
        if (loginData.token) {
            localStorage.setItem('token', loginData.token);
            localStorage.setItem('refreshToken', loginData.refreshToken);
            localStorage.setItem('user', JSON.stringify(loginData.user));
        }

        return loginData;
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    },

    getCurrentUser(): User | null {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    getToken(): string | null {
        return localStorage.getItem('token');
    },

    isAuthenticated(): boolean {
        return !!this.getToken();
    },
};
