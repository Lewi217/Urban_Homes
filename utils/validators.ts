export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePassword = (password: string): { valid: boolean; message?: string } => {
    if (password.length < 6) {
        return { valid: false, message: 'Password must be at least 6 characters long' };
    }
    return { valid: true };
};

export const validateAmount = (amount: number, max?: number): { valid: boolean; message?: string } => {
    if (amount <= 0) {
        return { valid: false, message: 'Amount must be greater than 0' };
    }
    if (max && amount > max) {
        return { valid: false, message: `Amount cannot exceed ${max}` };
    }
    return { valid: true };
};
