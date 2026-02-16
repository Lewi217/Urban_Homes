import apiClient from '@/lib/axios';
import {
    AdminLoginRequest,
    AdminLoginResponse,
    DashboardMetrics,
    AgencyDTO,
    InvestmentRequestDTO,
    UserInvestmentDTO,
    AdminApiResponse,
} from '@/types/admin';
import { Property } from '@/types';

class AdminService {
    // Dashboard metrics
    async getDashboardMetrics(): Promise<DashboardMetrics> {
        const response = await apiClient.get<AdminApiResponse<DashboardMetrics>>(
            '/admin/dashboard-metrics'
        );
        return response.data.data;
    }

    // Agency management
    async getAllAgencies(): Promise<AgencyDTO[]> {
        const response = await apiClient.get<AdminApiResponse<AgencyDTO[]>>(
            '/admin/agencies'
        );
        return response.data.data;
    }

    async deleteAgency(id: string): Promise<boolean> {
        const response = await apiClient.delete<AdminApiResponse<boolean>>(
            `/admin/agencies/${id}`
        );
        return response.data.data;
    }

    // Property management
    async getAllProperties(): Promise<Property[]> {
        const response = await apiClient.get<AdminApiResponse<Property[]>>(
            '/admin/properties'
        );
        return response.data.data;
    }

    async deleteProperty(id: string): Promise<boolean> {
        const response = await apiClient.delete<AdminApiResponse<boolean>>(
            `/admin/properties/${id}`
        );
        return response.data.data;
    }

    // Investment oversight
    async getInvestments(request: InvestmentRequestDTO): Promise<UserInvestmentDTO[]> {
        const response = await apiClient.post<AdminApiResponse<UserInvestmentDTO[]>>(
            '/admin/investments',
            request
        );
        return response.data.data;
    }
}

export const adminService = new AdminService();
