'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { adminService } from '@/services/admin.service';
import { UserInvestmentDTO } from '@/types/admin';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { formatAmount } from '@/utils/formatters';

export default function AdminInvestments() {
    const router = useRouter();
    const { isAdminAuthenticated, loading: authLoading } = useAdminAuth();
    const [investments, setInvestments] = useState<UserInvestmentDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [userId, setUserId] = useState('');
    const [propertyId, setPropertyId] = useState('');

    useEffect(() => {
        if (!authLoading && !isAdminAuthenticated) {
            router.push('/admin/login');
        }
    }, [authLoading, isAdminAuthenticated, router]);

    useEffect(() => {
        if (isAdminAuthenticated) {
            loadInvestments();
        }
    }, [isAdminAuthenticated]);

    const loadInvestments = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await adminService.getInvestments({ userId, propertyId });
            setInvestments(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load investments');
        } finally {
            setLoading(false);
        }
    };

    const handleFilter = () => {
        loadInvestments();
    };

    const handleClearFilters = () => {
        setUserId('');
        setPropertyId('');
        setTimeout(() => loadInvestments(), 100);
    };

    const totalInvestmentAmount = investments.reduce((sum, inv) => sum + inv.investmentAmount, 0);

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
                    <h1 className="text-3xl font-serif font-bold text-primary-900">Investment Oversight</h1>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filters */}
                <Card className="p-6 mb-6">
                    <h2 className="text-lg font-serif font-bold text-gray-900 mb-4">Filter Investments</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                            label="User ID (optional)"
                            type="text"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            placeholder="Enter user ID"
                        />
                        <Input
                            label="Property ID (optional)"
                            type="text"
                            value={propertyId}
                            onChange={(e) => setPropertyId(e.target.value)}
                            placeholder="Enter property ID"
                        />
                        <div className="flex items-end gap-2">
                            <Button onClick={handleFilter} className="flex-1">
                                Apply Filters
                            </Button>
                            <Button variant="outline" onClick={handleClearFilters}>
                                Clear
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Summary Card */}
                {investments.length > 0 && (
                    <Card className="p-6 mb-6 bg-gradient-to-r from-primary-500 to-primary-600 text-white">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-primary-100 text-sm">Total Investments</p>
                                <p className="text-3xl font-bold">{investments.length}</p>
                            </div>
                            <div>
                                <p className="text-primary-100 text-sm">Total Investment Amount</p>
                                <p className="text-3xl font-bold">{formatAmount(totalInvestmentAmount)}</p>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Investments List */}
                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600">Loading investments...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                ) : investments.length === 0 ? (
                    <Card className="text-center py-12">
                        <p className="text-gray-600">No investments found</p>
                    </Card>
                ) : (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Investment ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        User ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Property ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Amount
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {investments.map((investment) => (
                                    <tr key={investment.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-700">
                                            {investment.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-700">
                                            {investment.userId}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-700">
                                            {investment.propertyId}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-primary-600">
                                            {formatAmount(investment.investmentAmount)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
}
