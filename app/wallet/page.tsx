'use client';

import React, { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { walletService } from '@/services/wallet.service';
import { formatCurrency } from '@/utils/formatters';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function WalletPage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleDeposit = async () => {
        if (!user) return;

        const depositAmount = parseFloat(amount);
        if (isNaN(depositAmount) || depositAmount <= 0) {
            setError('Please enter a valid amount');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await walletService.depositFunds(user.id, depositAmount);
            setSuccess(`Successfully deposited ${formatCurrency(depositAmount)} to your wallet`);
            setAmount('');
            // Refresh page to update balance
            window.location.reload();
        } catch (error: any) {
            setError(error.response?.data?.data || 'Deposit failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleWithdraw = async () => {
        if (!user) return;

        const withdrawAmount = parseFloat(amount);
        if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
            setError('Please enter a valid amount');
            return;
        }

        if (withdrawAmount > (user.walletBalance || 0)) {
            setError('Insufficient balance');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await walletService.withdrawFunds(user.id, withdrawAmount);
            setSuccess(`Successfully withdrew ${formatCurrency(withdrawAmount)} from your wallet`);
            setAmount('');
            // Refresh page to update balance
            window.location.reload();
        } catch (error: any) {
            setError(error.response?.data?.data || 'Withdrawal failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">My Wallet</h1>
                        <p className="text-gray-600">Manage your funds for property investments</p>
                    </div>

                    {/* Balance Card */}
                    <Card className="p-8 mb-8 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
                        <div className="text-center">
                            <div className="text-lg opacity-90 mb-2">Current Balance</div>
                            <div className="text-5xl font-bold mb-4">
                                {formatCurrency(user?.walletBalance || 0)}
                            </div>
                            <p className="text-sm opacity-80">Available for investment</p>
                        </div>
                    </Card>

                    {/* Transaction Tabs */}
                    <Card className="p-6">
                        {/* Tab Headers */}
                        <div className="flex border-b mb-6">
                            <button
                                onClick={() => {
                                    setActiveTab('deposit');
                                    setAmount('');
                                    setError('');
                                    setSuccess('');
                                }}
                                className={`flex-1 py-3 font-semibold transition ${activeTab === 'deposit'
                                    ? 'border-b-2 border-primary-600 text-primary-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                💳 Deposit Funds
                            </button>
                            <button
                                onClick={() => {
                                    setActiveTab('withdraw');
                                    setAmount('');
                                    setError('');
                                    setSuccess('');
                                }}
                                className={`flex-1 py-3 font-semibold transition ${activeTab === 'withdraw'
                                    ? 'border-b-2 border-primary-600 text-primary-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                💸 Withdraw Funds
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div className="space-y-6">
                            {success && (
                                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                                    {success}
                                </div>
                            )}

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                    {error}
                                </div>
                            )}

                            {activeTab === 'deposit' ? (
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">Add Money to Wallet</h3>
                                    <p className="text-gray-600 mb-6">
                                        Deposit funds using M-Pesa or card payment via Pesapal integration.
                                    </p>

                                    <Input
                                        label="Amount (KSH)"
                                        type="number"
                                        value={amount}
                                        onChange={(e) => {
                                            setAmount(e.target.value);
                                            setError('');
                                            setSuccess('');
                                        }}
                                        placeholder="10000"
                                    />

                                    <Button
                                        onClick={handleDeposit}
                                        disabled={loading}
                                        size="lg"
                                        className="w-full mt-4"
                                    >
                                        {loading ? 'Processing...' : 'Deposit Funds'}
                                    </Button>

                                    <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                                        <h4 className="font-semibold text-blue-900 mb-2">Payment Methods</h4>
                                        <ul className="text-sm text-blue-800 space-y-1">
                                            <li>• M-Pesa</li>
                                            <li>• Credit/Debit Card</li>
                                            <li>• Bank Transfer</li>
                                        </ul>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">Withdraw from Wallet</h3>
                                    <p className="text-gray-600 mb-6">
                                        Transfer funds from your wallet to your M-Pesa or bank account.
                                    </p>

                                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-4">
                                        <div className="flex items-start">
                                            <span className="text-yellow-600 mr-2">⚠️</span>
                                            <div>
                                                <p className="text-sm text-yellow-800">
                                                    <strong>Available Balance:</strong> {formatCurrency(user?.walletBalance || 0)}
                                                </p>
                                                <p className="text-xs text-yellow-700 mt-1">
                                                    Withdrawals may take 1-3 business days to process
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <Input
                                        label="Amount (KSH)"
                                        type="number"
                                        value={amount}
                                        onChange={(e) => {
                                            setAmount(e.target.value);
                                            setError('');
                                            setSuccess('');
                                        }}
                                        placeholder="10000"
                                    />

                                    <Button
                                        onClick={handleWithdraw}
                                        disabled={loading}
                                        size="lg"
                                        className="w-full mt-4"
                                        variant="secondary"
                                    >
                                        {loading ? 'Processing...' : 'Withdraw Funds'}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Transaction History Placeholder */}
                    <Card className="p-6 mt-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Transactions</h3>
                        <div className="text-center py-12 text-gray-500">
                            <div className="text-5xl mb-4">📋</div>
                            <p>No transactions yet</p>
                        </div>
                    </Card>
                </div>
            </div>
        </ProtectedRoute>
    );
}
