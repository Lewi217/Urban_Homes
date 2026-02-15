'use client';

import React, { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import PropertyCard from '@/components/PropertyCard';
import { propertyService } from '@/services/property.service';
import { Property } from '@/types';
import Input from '@/components/ui/Input';

export default function PropertiesPage() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadProperties();
    }, []);

    useEffect(() => {
        filterProperties();
    }, [searchTerm, properties]);

    const loadProperties = async () => {
        try {
            const data = await propertyService.getAllProperties();
            setProperties(data);
            setFilteredProperties(data);
        } catch (error) {
            console.error('Failed to load properties:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterProperties = () => {
        if (!searchTerm) {
            setFilteredProperties(properties);
            return;
        }

        const filtered = properties.filter(
            (property) =>
                property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                property.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProperties(filtered);
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Browse Properties</h1>
                        <p className="text-gray-600">Discover premium real estate investment opportunities</p>
                    </div>

                    {/* Search and Filters */}
                    <div className="mb-8">
                        <div className="max-w-md">
                            <Input
                                type="text"
                                placeholder="Search properties by name, location..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Properties Grid */}
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
                        </div>
                    ) : filteredProperties.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredProperties.map((property) => (
                                <PropertyCard key={property.id} property={property} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <div className="text-6xl mb-4">🏡</div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                {searchTerm ? 'No properties found' : 'No properties available'}
                            </h3>
                            <p className="text-gray-600">
                                {searchTerm
                                    ? 'Try adjusting your search criteria'
                                    : 'Check back later for new investment opportunities'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}
