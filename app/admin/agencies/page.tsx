'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { adminService } from '@/services/admin.service';
import { AgencyDTO } from '@/types/admin';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { formatAmount } from '@/utils/formatters';

export default function AdminAgencies() {
    const router = useRouter();
    const { isAdminAuthenticated, loading: authLoading } = useAdminAuth();
    const [agencies, setAgencies] = useState<AgencyDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!authLoading && !isAdminAuthenticated) {
            router.push('/admin/login');
        }
    }, [authLoading, isAdminAuthenticated, router]);

    useEffect(() => {
        if (isAdminAuthenticated) {
            loadAgencies();
        }
    }, [isAdminAuthenticated]);

    const loadAgencies = async () => {
        try {
            setLoading(true);
            const data = await adminService.getAllAgencies();
            setAgencies(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load agencies');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete "${name}"? This will also affect their properties.`)) return;

        try {
            await adminService.deleteAgency(id);
            setAgencies(agencies.filter(a => a.id !== id));
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to delete agency');
        }
    };

    if (authLoading || !isAdminAuthenticated) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <Link href="/admin/dashboard" className="text-primary-600 hover:text-primary-700 text-sm mb-2 inline-block">
                        ← Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-serif font-bold text-primary-900">Agency Management</h1>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600">Loading agencies...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                ) : agencies.length === 0 ? (
                    <Card className="text-center py-12">
                        <p className="text-gray-600">No agencies found</p>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {agencies.map((agency) => (
                            <Card key={agency.id} className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">
                                            {agency.name}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-2">
                                            📧 {agency.email}
                                        </p>
                                        <p className="text-gray-700 mb-4">{agency.description}</p>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                            <div className="bg-gray-50 p-3 rounded-lg">
                                                <p className="text-xs text-gray-600">Wallet Balance</p>
                                                <p className="text-lg font-bold text-primary-600">
                                                    {formatAmount(agency.walletBalance)}
                                                </p>
                                            </div>
                                            <div className="bg-gray-50 p-3 rounded-lg">
                                                <p className="text-xs text-gray-600">Properties</p>
                                                <p className="text-lg font-bold text-gray-900">
                                                    {agency.propertyIds?.length || 0}
                                                </p>
                                            </div>
                                            <div className="bg-gray-50 p-3 rounded-lg">
                                                <p className="text-xs text-gray-600">Agency ID</p>
                                                <p className="text-sm font-mono text-gray-700">
                                                    {agency.id}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDelete(agency.id, agency.name)}
                                        className="ml-4 text-red-600 hover:text-red-700 hover:border-red-500"
                                    >
                                        Delete Agency
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
