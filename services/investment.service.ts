import apiClient from '@/lib/axios';
import { UserInvestment, HoldingDTO, ApiResponse } from '@/types';

export const investmentService = {
    async addInvestment(data: Partial<UserInvestment>): Promise<UserInvestment> {
        const response = await apiClient.post<ApiResponse<UserInvestment>>('/user-investments', data);
        return response.data.data;
    },

    async getUserInvestments(userId: string): Promise<UserInvestment[]> {
        const response = await apiClient.get<ApiResponse<UserInvestment[]>>(`/user-investments/user/${userId}`);
        return response.data.data;
    },

    async getHoldings(userId: string): Promise<HoldingDTO[]> {
        const response = await apiClient.get<ApiResponse<HoldingDTO[]>>(`/v1/users/holdings/${userId}`);
        return response.data.data;
    },

    async updateInvestmentAmount(id: string, newAmount: number): Promise<UserInvestment> {
        const response = await apiClient.put<ApiResponse<UserInvestment>>(`/user-investments/${id}/amount`, newAmount);
        return response.data.data;
    },

    async deleteInvestment(id: string): Promise<void> {
        await apiClient.delete(`/user-investments/${id}`);
    },
};
