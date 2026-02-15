import apiClient from '@/lib/axios';
import { Property, ApiResponse } from '@/types';

export const propertyService = {
    async getAllProperties(): Promise<Property[]> {
        const response = await apiClient.get<ApiResponse<Property[]>>('/properties');
        return response.data.data;
    },

    async getPropertyById(id: string): Promise<Property> {
        const response = await apiClient.get<ApiResponse<Property>>(`/properties/${id}`);
        return response.data.data;
    },

    async addProperty(property: Partial<Property>): Promise<Property> {
        const response = await apiClient.post<ApiResponse<Property>>('/properties', property);
        return response.data.data;
    },

    async updateProperty(id: string, property: Partial<Property>): Promise<Property> {
        const response = await apiClient.put<ApiResponse<Property>>(`/properties/${id}`, property);
        return response.data.data;
    },

    async deleteProperty(id: string): Promise<void> {
        await apiClient.delete(`/properties/${id}`);
    },
};
