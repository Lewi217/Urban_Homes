'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { propertyService } from '@/services/property.service';
import { adminService } from '@/services/admin.service';
import { AgencyDTO } from '@/types/admin';
import { Property } from '@/types';

interface AddPropertyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (property: Property) => void;
}

const initialForm = {
    name: '',
    title: '',
    description: '',
    location: '',
    price: '',
    area: '',
    bedrooms: '',
    bathrooms: '',
    coverPhoto: '',
    agencyId: '',
    amenities: '',
    furnishingStatus: false,
    availability: true,
};

export default function AddPropertyModal({ isOpen, onClose, onSuccess }: AddPropertyModalProps) {
    const [form, setForm] = useState(initialForm);
    const [agencies, setAgencies] = useState<AgencyDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            loadAgencies();
            setForm(initialForm);
            setError('');
        }
    }, [isOpen]);

    const loadAgencies = async () => {
        try {
            const data = await adminService.getAllAgencies();
            setAgencies(data || []);
        } catch {
            // Silently fail - user can type agencyId manually
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const payload = {
                name: form.name,
                title: form.title || form.name,
                description: form.description,
                location: form.location,
                price: parseFloat(form.price),
                area: parseFloat(form.area),
                bedrooms: parseInt(form.bedrooms),
                bathrooms: parseInt(form.bathrooms),
                coverPhoto: form.coverPhoto,
                agencyId: form.agencyId,
                amenities: form.amenities ? form.amenities.split(',').map(a => a.trim()) : [],
                furnishingStatus: form.furnishingStatus,
                availability: form.availability,
                totalInvested: 0,
                photos: [],
                coverVideo: [],
                panoramas: [],
            };

            const created = await propertyService.addProperty(payload);
            onSuccess(created);
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create property. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New Property">
            <div className="max-h-[70vh] overflow-y-auto pr-1">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                        <Input
                            label="Property Name *"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            placeholder="Sunset Villa"
                        />
                        <Input
                            label="Title"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="Luxury 3-bedroom villa"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            required
                            rows={3}
                            placeholder="A stunning property..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                        />
                    </div>

                    <Input
                        label="Location *"
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                        required
                        placeholder="Nairobi, Kenya"
                    />

                    <div className="grid grid-cols-2 gap-3">
                        <Input
                            label="Price (KSH) *"
                            name="price"
                            type="number"
                            value={form.price}
                            onChange={handleChange}
                            required
                            placeholder="5000000"
                        />
                        <Input
                            label="Area (sqft) *"
                            name="area"
                            type="number"
                            value={form.area}
                            onChange={handleChange}
                            required
                            placeholder="1200"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Input
                            label="Bedrooms *"
                            name="bedrooms"
                            type="number"
                            value={form.bedrooms}
                            onChange={handleChange}
                            required
                            placeholder="3"
                        />
                        <Input
                            label="Bathrooms *"
                            name="bathrooms"
                            type="number"
                            value={form.bathrooms}
                            onChange={handleChange}
                            required
                            placeholder="2"
                        />
                    </div>

                    <Input
                        label="Cover Photo URL"
                        name="coverPhoto"
                        value={form.coverPhoto}
                        onChange={handleChange}
                        placeholder="https://..."
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Agency *</label>
                        {agencies.length > 0 ? (
                            <select
                                name="agencyId"
                                value={form.agencyId}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                            >
                                <option value="">Select an agency</option>
                                {agencies.map(agency => (
                                    <option key={agency.id} value={agency.id}>
                                        {agency.name}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <Input
                                name="agencyId"
                                value={form.agencyId}
                                onChange={handleChange}
                                required
                                placeholder="Agency ID"
                            />
                        )}
                    </div>

                    <Input
                        label="Amenities (comma separated)"
                        name="amenities"
                        value={form.amenities}
                        onChange={handleChange}
                        placeholder="Pool, Gym, Parking, Security"
                    />

                    <div className="flex gap-6">
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                            <input
                                type="checkbox"
                                name="furnishingStatus"
                                checked={form.furnishingStatus}
                                onChange={handleChange}
                                className="w-4 h-4 text-primary-600"
                            />
                            Furnished
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                            <input
                                type="checkbox"
                                name="availability"
                                checked={form.availability}
                                onChange={handleChange}
                                className="w-4 h-4 text-primary-600"
                            />
                            Available for Investment
                        </label>
                    </div>

                    <div className="flex gap-3 pt-2 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="flex-1"
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            className="flex-1"
                            disabled={loading}
                        >
                            {loading ? 'Creating...' : 'Create Property'}
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
