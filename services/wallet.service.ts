import apiClient from '@/lib/axios';
import { Wallet, ApiResponse } from '@/types';

export const walletService = {
    async getWalletById(id: string): Promise<Wallet> {
        const response = await apiClient.get<ApiResponse<Wallet>>(`/wallets/${id}`);
        return response.data.data;
    },

    async depositFunds(userId: string, amount: number): Promise<Wallet> {
        const response = await apiClient.post<ApiResponse<Wallet>>('/wallets/deposit', {
            userId,
            amount,
        });
        return response.data.data;
    },

    async withdrawFunds(userId: string, amount: number): Promise<Wallet> {
        const response = await apiClient.post<ApiResponse<Wallet>>('/wallets/withdraw', {
            userId,
            amount,
        });
        return response.data.data;
    },
};
