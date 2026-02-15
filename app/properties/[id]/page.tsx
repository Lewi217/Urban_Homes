'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import ProtectedRoute from '@/components/ProtectedRoute';
import { propertyService } from '@/services/property.service';
import { investmentService } from '@/services/investment.service';
import { walletService } from '@/services/wallet.service';
import { Property } from '@/types';
import { formatCurrency, formatNumber } from '@/utils/formatters';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';

export default function PropertyDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [property, setProperty] = useState<Property | null>(null);
    const [loading, setLoading] = useState(true);
    const [investModalOpen, setInvestModalOpen] = useState(false);
    const [investAmount, setInvestAmount] = useState('');
    const [investing, setInvesting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (params.id) {
            loadProperty(params.id as string);
        }
    }, [params.id]);

    const loadProperty = async (id: string) => {
        try {
            const data = await propertyService.getPropertyById(id);
            setProperty(data);
        } catch (error) {
            console.error('Failed to load property:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInvest = async () => {
        if (!property || !user) return;

        const amount = parseFloat(investAmount);
        if (isNaN(amount) || amount <= 0) {
            setError('Please enter a valid amount');
            return;
        }

        if (amount > (user.walletBalance || 0)) {
            setError('Insufficient wallet balance');
            return;
        }

        setInvesting(true);
        setError('');

        try {
            // Create investment
            await investmentService.addInvestment({
                userId: user.id,
                propertyId: property.id,
                investmentAmount: amount,
            });

            // Deduct from wallet
            await walletService.withdrawFunds(user.id, amount);

            alert('Investment successful!');
            setInvestModalOpen(false);
            router.push('/dashboard');
        } catch (error: any) {
            setError(error.response?.data?.data || 'Investment failed. Please try again.');
        } finally {
            setInvesting(false);
        }
    };

    if (loading) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
                </div>
            </ProtectedRoute>
        );
    }

    if (!property) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h2>
                        <Button onClick={() => router.push('/properties')}>Back to Properties</Button>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    const investmentProgress = (property.totalInvested / property.price) * 100;

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Back Button */}
                    <Button
                        variant="outline"
                        onClick={() => router.back()}
                        className="mb-6"
                    >
                        ← Back
                    </Button>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            {/* Cover Photo */}
                            <div className="relative h-96 rounded-xl overflow-hidden mb-6">
                                {property.coverPhoto ? (
                                    <Image
                                        src={property.coverPhoto}
                                        alt={property.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-primary-100 flex items-center justify-center">
                                        <span className="text-primary-600 text-2xl font-semibold">No Image</span>
                                    </div>
                                )}
                            </div>

                            {/* Property Details */}
                            <Card className="p-8 mb-6">
                                <h1 className="text-4xl font-bold text-gray-900 mb-2">{property.name}</h1>
                                <p className="text-xl text-gray-600 mb-6">📍 {property.location}</p>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                                        <div className="text-3xl mb-2">🛏️</div>
                                        <div className="font-semibold text-gray-900">{property.bedrooms}</div>
                                        <div className="text-sm text-gray-600">Bedrooms</div>
                                    </div>
                                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                                        <div className="text-3xl mb-2">🚿</div>
                                        <div className="font-semibold text-gray-900">{property.bathrooms}</div>
                                        <div className="text-sm text-gray-600">Bathrooms</div>
                                    </div>
                                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                                        <div className="text-3xl mb-2">📐</div>
                                        <div className="font-semibold text-gray-900">{formatNumber(property.area)}</div>
                                        <div className="text-sm text-gray-600">Sqft</div>
                                    </div>
                                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                                        <div className="text-3xl mb-2">✨</div>
                                        <div className="font-semibold text-gray-900">
                                            {property.furnishingStatus ? 'Yes' : 'No'}
                                        </div>
                                        <div className="text-sm text-gray-600">Furnished</div>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
                                    <p className="text-gray-600 leading-relaxed">{property.description}</p>
                                </div>

                                {property.amenities && property.amenities.length > 0 && (
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Amenities</h2>
                                        <div className="grid grid-cols-2 md:grid cols-3 gap-3">
                                            {property.amenities.map((amenity, index) => (
                                                <div key={index} className="flex items-center space-x-2">
                                                    <span className="text-natural-600">✓</span>
                                                    <span className="text-gray-700">{amenity}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </Card>
                        </div>

                        {/* Sidebar - Investment Info */}
                        <div className="lg:col-span-1">
                            <Card className="p-6 sticky top-24">
                                <div className="mb-6">
                                    <div className="text-sm text-gray-600 mb-1">Property Price</div>
                                    <div className="text-3xl font-bold text-gray-900">
                                        {formatCurrency(property.price)}
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-600">Total Invested</span>
                                        <span className="font-semibold">{investmentProgress.toFixed(1)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                                        <div
                                            className="bg-natural-500 h-3 rounded-full transition-all"
                                            style={{ width: `${Math.min(investmentProgress, 100)}%` }}
                                        />
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {formatCurrency(property.totalInvested)} of {formatCurrency(property.price)}
                                    </div>
                                </div>

                                {property.availability ? (
                                    <>
                                        <Button
                                            onClick={() => setInvestModalOpen(true)}
                                            className="w-full mb-4"
                                            size="lg"
                                        >
                                            Invest Now
                                        </Button>
                                        <div className="text-xs text-center text-gray-500">
                                            Your wallet balance: {formatCurrency(user?.walletBalance || 0)}
                                        </div>
                                    </>
                                ) : (
                                    <div className="bg-red-50 text-red-700 p-4 rounded-lg text-center">
                                        <strong>Not Available</strong>
                                        <p className="text-sm mt-1">This property is currently unavailable for investment</p>
                                    </div>
                                )}
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            {/* Investment Modal */}
            <Modal
                isOpen={investModalOpen}
                onClose={() => {
                    setInvestModalOpen(false);
                    setInvestAmount('');
                    setError('');
                }}
                title="Make Investment"
            >
                <div className="space-y-4">
                    <div>
                        <p className="text-sm text-gray-600 mb-4">
                            Enter the amount you'd like to invest in <strong>{property.name}</strong>
                        </p>
                        <Input
                            label="Investment Amount (KSH)"
                            type="number"
                            value={investAmount}
                            onChange={(e) => {
                                setInvestAmount(e.target.value);
                                setError('');
                            }}
                            placeholder="10000"
                            error={error}
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            Available balance: {formatCurrency(user?.walletBalance || 0)}
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setInvestModalOpen(false)}
                            className="flex-1"
                            disabled={investing}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleInvest}
                            className="flex-1"
                            disabled={investing}
                        >
                            {investing ? 'Processing...' : 'Confirm Investment'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </ProtectedRoute>
    );
}
