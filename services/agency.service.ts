import apiClient from '@/lib/axios';
import { AgencyDTO, AdminApiResponse } from '@/types/admin';
import { Property } from '@/types';

class AgencyService {
    // Create agency
    async createAgency(agencyData: Omit<AgencyDTO, 'id'>): Promise<AgencyDTO> {
        const response = await apiClient.post<AdminApiResponse<AgencyDTO>>(
            '/agencies',
            agencyData
        );
        return response.data.data;
    }

    // Get agency by ID
    async getAgencyById(id: string): Promise<AgencyDTO> {
        const response = await apiClient.get<AdminApiResponse<AgencyDTO>>(
            `/agencies/${id}`
        );
        return response.data.data;
    }

    // Update agency
    async updateAgency(id: string, agencyData: Partial<AgencyDTO>): Promise<AgencyDTO> {
        const response = await apiClient.put<AdminApiResponse<AgencyDTO>>(
            `/agencies/${id}`,
            agencyData
        );
        return response.data.data;
    }

    // Delete agency
    async deleteAgency(id: string): Promise<boolean> {
        const response = await apiClient.delete<AdminApiResponse<boolean>>(
            `/agencies/${id}`
        );
        return response.data.data;
    }

    // Withdraw from wallet
    async withdrawFromWallet(id: string, amount: number): Promise<boolean> {
        const response = await apiClient.post<AdminApiResponse<boolean>>(
            `/agencies/${id}/withdraw?amount=${amount}`
        );
        return response.data.data;
    }

    // List agency properties
    async listAgencyProperties(id: string): Promise<Property[]> {
        const response = await apiClient.get<AdminApiResponse<Property[]>>(
            `/agencies/${id}/properties`
        );
        return response.data.data;
    }
}

export const agencyService = new AgencyService();
