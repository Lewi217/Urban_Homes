// Admin-related types matching backend DTOs

export interface AdminDTO {
    id: string;
    fullName: string;
    email: string;
    role: 'ADMIN';
}

export interface AdminLoginRequest {
    email: string;
    password: string;
}

export interface AdminLoginResponse {
    message: string;
    data: {
        token: string;
        admin: AdminDTO;
    };
}

export interface DashboardMetrics {
    totalProfit: number;
    totalUsers: number;
    totalAgencies: number;
    totalProperties: number;
}

export interface AgencyDTO {
    id: string;
    name: string;
    email: string;
    description: string;
    walletBalance: number;
    propertyIds: string[];
}

export interface InvestmentRequestDTO {
    userId?: string;
    propertyId?: string;
}

export interface UserInvestmentDTO {
    id: string;
    userId: string;
    propertyId: string;
    investmentAmount: number;
}

export interface AdminApiResponse<T> {
    message: string;
    data: T;
}
