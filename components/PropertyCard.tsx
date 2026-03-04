'use client';

import Link from 'next/link';
import { Property } from '@/types';
import Card from './ui/Card';
import { formatCurrency } from '@/utils/formatters';
import { useAuth } from '@/context/AuthContext';

interface PropertyCardProps {
    property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
    const { isAuthenticated } = useAuth();
    const href = isAuthenticated ? `/properties/${property.id}` : '/sign-in';

    return (
        <Link href={href}>
            <Card hover className="h-full">
                {/* Property Image */}
                <div className="relative h-48 bg-gray-200">
                    {property.coverPhoto ? (
                        <img
                            src={property.coverPhoto}
                            alt={property.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = '';
                                e.currentTarget.style.display = 'none';
                                const fallback = e.currentTarget.parentElement?.querySelector('.fallback-icon');
                                if (fallback) (fallback as HTMLElement).style.display = 'flex';
                            }}
                        />
                    ) : null}
                    <div
                        className="fallback-icon w-full h-full items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200"
                        style={{ display: property.coverPhoto ? 'none' : 'flex' }}
                    >
                        <span className="text-4xl">🏡</span>
                    </div>
                    {!property.availability && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            Unavailable
                        </div>
                    )}
                </div>

                {/* Property Details */}
                <div className="p-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{property.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{property.location}</p>

                    <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl font-bold text-primary-600">
                            {formatCurrency(property.price)}
                        </span>
                    </div>

                    {/* Property Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-600 border-t pt-3">
                        <div className="flex items-center space-x-1">
                            <span>🛏️</span>
                            <span>{property.bedrooms} Beds</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <span>🚿</span>
                            <span>{property.bathrooms} Baths</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <span>📐</span>
                            <span>{property.area} sqft</span>
                        </div>
                    </div>

                    {/* Investment Progress */}
                    {property.totalInvested > 0 && (
                        <div className="mt-3">
                            <div className="flex justify-between text-xs text-gray-600 mb-1">
                                <span>Invested</span>
                                <span>{((property.totalInvested / property.price) * 100).toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-natural-500 h-2 rounded-full"
                                    style={{ width: `${Math.min((property.totalInvested / property.price) * 100, 100)}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        </Link>
    );
}
