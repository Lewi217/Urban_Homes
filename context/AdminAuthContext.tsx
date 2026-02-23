'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AdminDTO, AdminApiResponse } from '@/types/admin';
import apiClient from '@/lib/axios';

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
        const storedAdmin = localStorage.getItem('admin');
        const adminToken = localStorage.getItem('adminToken');

        if (storedAdmin && adminToken) {
            setAdmin(JSON.parse(storedAdmin));
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${adminToken}`;
        }
        setLoading(false);
    }, []);

    const loginAdmin = async (email: string, password: string) => {
        try {
            // Call the dedicated admin login endpoint
            const response = await apiClient.post<AdminApiResponse<{ token: string; admin: AdminDTO }>>(
                '/admin/login',
                { email, password }
            );

            const { token, admin: adminData } = response.data.data;

            setAdmin(adminData);
            localStorage.setItem('admin', JSON.stringify(adminData));
            localStorage.setItem('adminToken', token);
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } catch (error: any) {
            setAdmin(null);
            localStorage.removeItem('admin');
            localStorage.removeItem('adminToken');
            delete apiClient.defaults.headers.common['Authorization'];
            throw new Error(error.response?.data?.message || 'Login failed. Check your credentials.');
        }
    };

    const logoutAdmin = () => {
        setAdmin(null);
        localStorage.removeItem('admin');
        localStorage.removeItem('adminToken');
        delete apiClient.defaults.headers.common['Authorization'];
    };

    return (
        <AdminAuthContext.Provider value={{ admin, loading, loginAdmin, logoutAdmin, isAdminAuthenticated: !!admin }}>
            {children}
        </AdminAuthContext.Provider>
    );
};
