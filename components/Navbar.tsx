'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/utils/formatters';
import Button from './ui/Button';

export default function Navbar() {
    const { isAuthenticated, user, logout } = useAuth();

    return (
        <nav className="bg-white shadow-md sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-gradient-hero rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">UR</span>
                        </div>
                        <span className="text-2xl font-serif font-bold text-primary-800">Urban Roof</span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        {isAuthenticated ? (
                            <>
                                <Link href="/dashboard" className="text-gray-700 hover:text-primary-600 transition">
                                    Dashboard
                                </Link>
                                <Link href="/properties" className="text-gray-700 hover:text-primary-600 transition">
                                    Properties
                                </Link>
                                <Link href="/holdings" className="text-gray-700 hover:text-primary-600 transition">
                                    My Holdings
                                </Link>
                                <Link href="/wallet" className="text-gray-700 hover:text-primary-600 transition">
                                    Wallet
                                </Link>
                                <div className="flex items-center space-x-4">
                                    <div className="bg-natural-100 px-4 py-2 rounded-lg">
                                        <span className="text-sm font-medium text-natural-800">
                                            Balance: {formatCurrency(user?.walletBalance || 0)}
                                        </span>
                                    </div>
                                    <Button onClick={logout} variant="outline" size="sm">
                                        Logout
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link href="/#features" className="text-gray-700 hover:text-primary-600 transition">
                                    Features
                                </Link>
                                <Link href="/#how-it-works" className="text-gray-700 hover:text-primary-600 transition">
                                    How It Works
                                </Link>
                                <Link href="/sign-in" className="text-gray-700 hover:text-primary-600 transition">
                                    Sign In
                                </Link>
                                <Link href="/sign-up">
                                    <Button size="sm">
                                        Sign Up
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
