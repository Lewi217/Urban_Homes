'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { Property } from '@/types';
import { propertyService } from '@/services/property.service';
import PropertyCard from '@/components/PropertyCard';

export default function HomePage() {
    const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProperties();
    }, []);

    const loadProperties = async () => {
        try {
            const properties = await propertyService.getAllProperties();
            // Get first 3 properties for featured section
            setFeaturedProperties(properties.slice(0, 3));
        } catch (error) {
            console.error('Failed to load properties:', error);
            // Use mock properties if backend is unavailable
            setFeaturedProperties([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center">
                <div className="absolute inset-0">
                    <Image
                        src="/images/hero.png"
                        alt="Luxury Property"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-hero" />
                </div>

                <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto animate-fade-in">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6">
                        Invest in Your Future with <span className="text-accent-400">Urban Roof</span>
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 text-gray-100">
                        Build wealth through fractional property investments. Own a piece of premium real estate starting today.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/sign-up">
                            <Button size="lg" className="w-full sm:w-auto">
                                Start Investing
                            </Button>
                        </Link>
                        <Link href="#features">
                            <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white bg-opacity-10 backdrop-blur text-white border-white hover:bg-white hover:bg-opacity-20">
                                Learn More
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 animate-slide-up">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Why Choose Urban Roof?
                        </h2>
                        <p className="text-xl text-gray-600">
                            Premium features designed for smart investors
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="text-center p-8 rounded-xl bg-primary-50 hover:shadow-xl transition-all duration-300">
                            <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-3xl">🏡</span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Premium Properties</h3>
                            <p className="text-gray-600">
                                Handpicked selection of high-value real estate opportunities in prime locations across Kenya.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="text-center p-8 rounded-xl bg-natural-50 hover:shadow-xl transition-all duration-300">
                            <div className="w-16 h-16 bg-natural-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-3xl">💰</span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Fractional Investing</h3>
                            <p className="text-gray-600">
                                Start investing with any amount. No need for large capital to own premium real estate.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="text-center p-8 rounded-xl bg-accent-50 hover:shadow-xl transition-all duration-300">
                            <div className="w-16 h-16 bg-accent-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-3xl">📊</span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Track Portfolio</h3>
                            <p className="text-gray-600">
                                Monitor your investments in real-time with detailed analytics and performance metrics.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            How It Works
                        </h2>
                        <p className="text-xl text-gray-600">
                            Start building your real estate portfolio in 3 simple steps
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {/* Step 1 */}
                        <div className="relative">
                            <div className="flex flex-col items-center">
                                <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-6">
                                    1
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">Create Account</h3>
                                <p className="text-center text-gray-600">
                                    Sign up in minutes and verify your account to start your investment journey.
                                </p>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="relative">
                            <div className="flex flex-col items-center">
                                <div className="w-20 h-20 bg-natural-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-6">
                                    2
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">Browse & Invest</h3>
                                <p className="text-center text-gray-600">
                                    Explore properties, fund your wallet, and invest in properties that match your goals.
                                </p>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="relative">
                            <div className="flex flex-col items-center">
                                <div className="w-20 h-20 bg-accent-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-6">
                                    3
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">Track & Grow</h3>
                                <p className="text-center text-gray-600">
                                    Monitor your investments and watch your real estate portfolio grow over time.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Properties Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Featured Properties
                        </h2>
                        <p className="text-xl text-gray-600">
                            Explore our handpicked investment opportunities
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                        </div>
                    ) : featuredProperties.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {featuredProperties.map((property) => (
                                <PropertyCard key={property.id} property={property} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-600 text-lg">
                                No properties available at the moment. Please check back later or sign up to get notified when new properties are listed.
                            </p>
                        </div>
                    )}

                    <div className="text-center mt-12">
                        <Link href="/sign-in">
                            <Button size="lg">
                                View All Properties
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-hero text-white">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        Ready to Start Building Wealth?
                    </h2>
                    <p className="text-xl mb-8 text-gray-100">
                        Join thousands of investors already growing their portfolio with Urban Roof
                    </p>
                    <Link href="/sign-up">
                        <Button size="lg" className="bg-white text-primary-800 hover:bg-gray-100">
                            Get Started Today
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
