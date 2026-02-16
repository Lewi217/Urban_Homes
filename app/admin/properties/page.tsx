'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { adminService } from '@/services/admin.service';
import { Property } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { formatAmount } from '@/utils/formatters';

export default function AdminProperties() {
    const router = useRouter();
    const { isAdminAuthenticated, loading: authLoading } = useAdminAuth();
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (!authLoading && !isAdminAuthenticated) {
            router.push('/admin/login');
        }
    }, [authLoading, isAdminAuthenticated, router]);

    useEffect(() => {
        if (isAdminAuthenticated) {
            loadProperties();
        }
    }, [isAdminAuthenticated]);

    const loadProperties = async () => {
        try {
            setLoading(true);
            const data = await adminService.getAllProperties();
            setProperties(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load properties');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

        try {
            await adminService.deleteProperty(id);
            setProperties(properties.filter(p => p.id !== id));
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to delete property');
        }
    };

    const filteredProperties = properties.filter(property =>
        property.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (authLoading || !isAdminAuthenticated) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <Link href="/admin/dashboard" className="text-primary-600 hover:text-primary-700 text-sm mb-2 inline-block">
                                ← Back to Dashboard
                            </Link>
                            <h1 className="text-3xl font-serif font-bold text-primary-900">Property Management</h1>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search */}
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Search properties by name or location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600">Loading properties...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                ) : filteredProperties.length === 0 ? (
                    <Card className="text-center py-12">
                        <p className="text-gray-600">No properties found</p>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProperties.map((property) => (
                            <Card key={property.id} className="overflow-hidden">
                                {property.coverPhoto && (
                                    <img
                                        src={property.coverPhoto}
                                        alt={property.name}
                                        className="w-full h-48 object-cover"
                                    />
                                )}
                                <div className="p-4">
                                    <h3 className="text-lg font-serif font-bold text-gray-900 mb-2">
                                        {property.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-2">📍 {property.location}</p>
                                    <p className="text-lg font-bold text-primary-600 mb-3">
                                        {formatAmount(property.price)}
                                    </p>
                                    <div className="flex gap-2 text-sm text-gray-600 mb-4">
                                        <span>🛏️ {property.bedrooms} beds</span>
                                        <span>🚿 {property.bathrooms} baths</span>
                                        <span>📐 {property.area} sqft</span>
                                    </div>
                                    <div className="mb-4">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-600">Invested</span>
                                            <span className="font-medium">
                                                {formatAmount(property.totalInvested || 0)}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-primary-600 h-2 rounded-full"
                                                style={{
                                                    width: `${((property.totalInvested || 0) / property.price) * 100}%`
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link href={`/properties/${property.id}`} className="flex-1">
                                            <Button variant="outline" size="sm" className="w-full">
                                                View Details
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDelete(property.id, property.name)}
                                            className="text-red-600 hover:text-red-700 hover:border-red-500"
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
