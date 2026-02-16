'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { adminService } from '@/services/admin.service';
import { DashboardMetrics } from '@/types/admin';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function AdminDashboard() {
    const router = useRouter();
    const { admin, loading: authLoading, logoutAdmin, isAdminAuthenticated } = useAdminAuth();
    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!authLoading && !isAdminAuthenticated) {
            router.push('/admin/login');
        }
    }, [authLoading, isAdminAuthenticated, router]);

    useEffect(() => {
        if (isAdminAuthenticated) {
            loadMetrics();
        }
    }, [isAdminAuthenticated]);

    const loadMetrics = async () => {
        try {
            setLoading(true);
            const data = await adminService.getDashboardMetrics();
            setMetrics(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load metrics');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logoutAdmin();
        router.push('/admin/login');
    };

    if (authLoading || !isAdminAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div>
                            <h1 className="text-3xl font-serif font-bold text-primary-900">
                                Admin Dashboard
                            </h1>
                            <p className="text-sm text-gray-600 mt-1">
                                Welcome back, {admin?.fullName}
                            </p>
                        </div>
                        <Button variant="outline" size="sm" onClick={handleLogout}>
                            Logout
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Metrics Cards */}
                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600">Loading metrics...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                ) : metrics ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                                <div className="p-6">
                                    <p className="text-green-100 text-sm font-medium">Total Profit</p>
                                    <p className="text-3xl font-bold mt-2">
                                        KSh {metrics.totalProfit.toLocaleString()}
                                    </p>
                                    <p className="text-green-100 text-xs mt-2">5% commission on investments</p>
                                </div>
                            </Card>

                            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                                <div className="p-6">
                                    <p className="text-blue-100 text-sm font-medium">Total Users</p>
                                    <p className="text-3xl font-bold mt-2">{metrics.totalUsers}</p>
                                    <p className="text-blue-100 text-xs mt-2">Active investors</p>
                                </div>
                            </Card>

                            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                                <div className="p-6">
                                    <p className="text-purple-100 text-sm font-medium">Total Agencies</p>
                                    <p className="text-3xl font-bold mt-2">{metrics.totalAgencies}</p>
                                    <p className="text-purple-100 text-xs mt-2">Property providers</p>
                                </div>
                            </Card>

                            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                                <div className="p-6">
                                    <p className="text-orange-100 text-sm font-medium">Total Properties</p>
                                    <p className="text-3xl font-bold mt-2">{metrics.totalProperties}</p>
                                    <p className="text-orange-100 text-xs mt-2">Investment opportunities</p>
                                </div>
                            </Card>
                        </div>

                        {/* Management Links */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Link href="/admin/properties">
                                <Card hover className="h-full transition-all hover:shadow-lg">
                                    <div className="p-6">
                                        <div className="text-4xl mb-4">🏘️</div>
                                        <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">
                                            Property Management
                                        </h3>
                                        <p className="text-gray-600">
                                            View and manage all properties in the system
                                        </p>
                                    </div>
                                </Card>
                            </Link>

                            <Link href="/admin/agencies">
                                <Card hover className="h-full transition-all hover:shadow-lg">
                                    <div className="p-6">
                                        <div className="text-4xl mb-4">🏢</div>
                                        <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">
                                            Agency Management
                                        </h3>
                                        <p className="text-gray-600">
                                            Manage agencies and their property portfolios
                                        </p>
                                    </div>
                                </Card>
                            </Link>

                            <Link href="/admin/investments">
                                <Card hover className="h-full transition-all hover:shadow-lg">
                                    <div className="p-6">
                                        <div className="text-4xl mb-4">💰</div>
                                        <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">
                                            Investment Oversight
                                        </h3>
                                        <p className="text-gray-600">
                                            Track and analyze all investment activities
                                        </p>
                                    </div>
                                </Card>
                            </Link>
                        </div>
                    </>
                ) : null}
            </main>
        </div>
    );
}
