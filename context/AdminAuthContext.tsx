'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AdminDTO } from '@/types/admin';
import apiClient from '@/lib/axios';
import { LoginResponse, ApiResponse } from '@/types';

interface AdminAuthContextType {
    admin: AdminDTO | null;
    loading: boolean;
    loginAdmin: (email: string, password: string) => Promise<void>;
    logoutAdmin: () => void;
    isAdminAuthenticated: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const useAdminAuth = () => {
    const context = useContext(AdminAuthContext);
    if (!context) {
        throw new Error('useAdminAuth must be used within an AdminAuthProvider');
    }
    return context;
};

interface AdminAuthProviderProps {
    children: ReactNode;
}

export const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({ children }) => {
    const [admin, setAdmin] = useState<AdminDTO | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing admin session
        const storedAdmin = localStorage.getItem('admin');
        const adminToken = localStorage.getItem('adminToken');

        if (storedAdmin && adminToken) {
            setAdmin(JSON.parse(storedAdmin));
        }
        setLoading(false);
    }, []);

    const loginAdmin = async (email: string, password: string) => {
        try {
            // Use the existing user login endpoint
            const response = await apiClient.post<ApiResponse<LoginResponse>>(
                '/v1/users/login',
                { email, password }
            );

            const { token, refreshToken, user } = response.data.data;

            // Check if user has ADMIN role
            if (!user.roles || !user.roles.includes('ADMIN')) {
                throw new Error('Access denied. Admin privileges required.');
            }

            // Convert User to AdminDTO
            const adminData: AdminDTO = {
                id: user.id,
                fullName: user.name,
                email: user.email,
                role: 'ADMIN'
            };

            setAdmin(adminData);
            localStorage.setItem('admin', JSON.stringify(adminData));
            localStorage.setItem('adminToken', token);

            // Set auth header for admin requests
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } catch (error: any) {
            // Clean up any partial state
            setAdmin(null);
            localStorage.removeItem('admin');
            localStorage.removeItem('adminToken');

            if (error.message === 'Access denied. Admin privileges required.') {
                throw error;
            }
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    };

    const logoutAdmin = () => {
        setAdmin(null);
        localStorage.removeItem('admin');
        localStorage.removeItem('adminToken');
        delete apiClient.defaults.headers.common['Authorization'];
    };

    const value = {
        admin,
        loading,
        loginAdmin,
        logoutAdmin,
        isAdminAuthenticated: !!admin,
    };

    return (
        <AdminAuthContext.Provider value={value}>
            {children}
        </AdminAuthContext.Provider>
    );
};
