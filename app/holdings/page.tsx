'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { investmentService } from '@/services/investment.service';
import { HoldingDTO } from '@/types';
import { formatCurrency, formatPercentage } from '@/utils/formatters';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function HoldingsPage() {
    const { user } = useAuth();
    const [holdings, setHoldings] = useState<HoldingDTO[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            loadHoldings();
        }
    }, [user]);

    const loadHoldings = async () => {
        try {
            const data = await investmentService.getHoldings(user!.id);
            setHoldings(data);
        } catch (error) {
            console.error('Failed to load holdings:', error);
        } finally {
            setLoading(false);
        }
    };

    const totalInvested = holdings.reduce((sum, h) => sum + h.amountInvested, 0);

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">My Holdings</h1>
                        <p className="text-gray-600">Track your real estate investment portfolio</p>
                    </div>

                    {/* Summary Card */}
                    <Card className="p-6 mb-8 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <div className="text-sm opacity-90 mb-1">Total Invested</div>
                                <div className="text-3xl font-bold">{formatCurrency(totalInvested)}</div>
                            </div>
                            <div>
                                <div className="text-sm opacity-90 mb-1">Number of Properties</div>
                                <div className="text-3xl font-bold">{holdings.length}</div>
                            </div>
                            <div>
                                <div className="text-sm opacity-90 mb-1">Portfolio Value</div>
                                <div className="text-3xl font-bold">{formatCurrency(totalInvested)}</div>
                            </div>
                        </div>
                    </Card>

                    {/* Holdings List */}
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
                        </div>
                    ) : holdings.length > 0 ? (
                        <div className="space-y-4">
                            {holdings.map((holding) => (
                                <Card key={holding.propertyId} className="p-6 hover:shadow-lg transition">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                        <div className="mb-4 md:mb-0">
                                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                                {holding.propertyName}
                                            </h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <div className="text-sm text-gray-600">Your Investment</div>
                                                    <div className="text-lg font-semibold text-gray-900">
                                                        {formatCurrency(holding.amountInvested)}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-sm text-gray-600">Total Property Value</div>
                                                    <div className="text-lg font-semibold text-gray-900">
                                                        {formatCurrency(holding.totalPropertyInvestment)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-center md:text-right">
                                            <div className="mb-2">
                                                <div className="text-sm text-gray-600">Your Share</div>
                                                <div className="text-3xl font-bold text-natural-600">
                                                    {formatPercentage(holding.sharePercentage)}
                                                </div>
                                            </div>
                                            <Link href={`/properties/${holding.propertyId}`}>
                                                <Button variant="outline" size="sm">
                                                    View Property
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="mt-4">
                                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                                            <span>Your share</span>
                                            <span>{formatPercentage(holding.sharePercentage)}</span>
                                        </div>
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
                            <div className="text-6xl mb-4">📊</div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Holdings Yet</h3>
                            <p className="text-gray-600 mb-6">
                                Start building your portfolio by investing in premium properties
                            </p>
                            <Link href="/properties">
                                <Button>Browse Properties</Button>
                            </Link>
                        </Card>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}
