export interface User {
    id: string;
    name: string;
    email: string;
    roles?: string[];
    walletBalance?: number;
}

export interface Property {
    id: string;
    name: string;
    description: string;
    location: string;
    price: number;
    coverPhoto: string;
    coverVideo?: string[];
    panoramas?: string[];
    title: string;
    area: number;
    bedrooms: number;
    bathrooms: number;
    photos: string[];
    amenities: string[];
    furnishingStatus: boolean;
    availability: boolean;
    totalInvested: number;
    agencyId: string;
    availableForInvestment?: string[];
    createdAt: string;
    updatedAt: string;
}

export interface Agency {
    id: string;
    name: string;
    email: string;
    description: string;
    walletBalance: number;
    propertyIds: string[];
}

export interface Wallet {
    id: string;
    userId: string;
    agencyId?: string;
    balance: number;
}

export interface UserInvestment {
    id: string;
    userId: string;
    propertyId: string;
    investmentAmount: number;
}

export interface HoldingDTO {
    propertyId: string;
    propertyName: string;
    amountInvested: number;
    totalPropertyInvestment: number;
    sharePercentage: number;
}

export interface Transaction {
    id: string;
    userId: string;
    agencyId: string;
    propertyId: string;
    amount: number;
    transactionType: string;
    createdAt: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    refreshToken: string;
    user: User;
}

export interface ApiResponse<T = any> {
    message: string;
    data: T;
}
