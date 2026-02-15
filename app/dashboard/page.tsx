'use client';

import React, { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { investmentService } from '@/services/investment.service';
import { HoldingDTO } from '@/types';
import { formatCurrency, formatPercentage } from '@/utils/formatters';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function DashboardPage() {
    const { user } = useAuth();
    const [holdings, setHoldings] = useState<HoldingDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalInvested, setTotalInvested] = useState(0);

    useEffect(() => {
        if (user) {
            loadHoldings();
        }
    }, [user]);

    const loadHoldings = async () => {
        try {
            const data = await investmentService.getHoldings(user!.id);
            setHoldings(data);
            const total = data.reduce((sum, h) => sum + h.amountInvested, 0);
            setTotalInvested(total);
        } catch (error) {
            console.error('Failed to load holdings:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Welcome Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
                        <p className="text-gray-600 mt-2">Here's an overview of your investment portfolio</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Wallet Balance */}
                        <Card className="p-6 bg-gradient-to-br from-primary-500 to-primary-700 text-white">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold opacity-90">Wallet Balance</h3>
                                <span className="text-3xl">💰</span>
                            </div>
                            <p className="text-3xl font-bold">{formatCurrency(user?.walletBalance || 0)}</p>
                            <Link href="/wallet">
                                <Button variant="outline" size="sm" className="mt-4 bg-white bg-opacity-10 border-white text-white hover:bg-opacity-20">
                                    Manage Wallet
                                </Button>
                            </Link>
                        </Card>

                        {/* Total Invested */}
                        <Card className="p-6 bg-gradient-to-br from-natural-500 to-natural-700 text-white">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold opacity-90">Total Invested</h3>
                                <span className="text-3xl">📊</span>
                            </div>
                            <p className="text-3xl font-bold">{formatCurrency(totalInvested)}</p>
                            <Link href="/holdings">
                                <Button variant="outline" size="sm" className="mt-4 bg-white bg-opacity-10 border-white text-white hover:bg-opacity-20">
                                    View Holdings
                                </Button>
                            </Link>
                        </Card>

                        {/* Number of Properties */}
                        <Card className="p-6 bg-gradient-to-br from-accent-500 to-accent-700 text-white">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold opacity-90">Properties Owned</h3>
                                <span className="text-3xl">🏡</span>
                            </div>
                            <p className="text-3xl font-bold">{holdings.length}</p>
                            <Link href="/properties">
                                <Button variant="outline" size="sm" className="mt-4 bg-white bg-opacity-10 border-white text-white hover:bg-opacity-20">
                                    Browse More
                                </Button>
                            </Link>
                        </Card>
                    </div>

                    {/* Recent Holdings */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Your Holdings</h2>
                            <Link href="/holdings" className="text-primary-600 hover:text-primary-700 font-semibold">
                                View All →
                            </Link>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                            </div>
                        ) : holdings.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {holdings.slice(0, 3).map((holding) => (
                                    <Card key={holding.propertyId} className="p-6 hover:shadow-lg transition">
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">{holding.propertyName}</h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Your Investment</span>
                                                <span className="font-semibold text-gray-900">
                                                    {formatCurrency(holding.amountInvested)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Your Share</span>
                                                <span className="font-semibold text-natural-600">
                                                    {formatPercentage(holding.sharePercentage)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-natural-500 h-2 rounded-full"
                                                    style={{ width: `${holding.sharePercentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Card className="p-12 text-center">
                                <div className="text-6xl mb-4">🏡</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No Investments Yet</h3>
                                <p className="text-gray-600 mb-6">
                                    Start building your real estate portfolio by investing in premium properties
                                </p>
                                <Link href="/properties">
                                    <Button>Browse Properties</Button>
                                </Link>
                            </Card>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Link href="/wallet">
                                <Card hover className="p-6 text-center">
                                    <span className="text-4xl mb-4 block">💳</span>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">Deposit Funds</h3>
                                    <p className="text-gray-600 text-sm">Add money to your wallet to start investing</p>
                                </Card>
                            </Link>

                            <Link href="/properties">
                                <Card hover className="p-6 text-center">
                                    <span className="text-4xl mb-4 block">🔍</span>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">Find Properties</h3>
                                    <p className="text-gray-600 text-sm">Browse available investment opportunities</p>
                                </Card>
                            </Link>

                            <Link href="/holdings">
                                <Card hover className="p-6 text-center">
                                    <span className="text-4xl mb-4 block">📈</span>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">Track Portfolio</h3>
                                    <p className="text-gray-600 text-sm">Monitor all your property investments</p>
                                </Card>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
