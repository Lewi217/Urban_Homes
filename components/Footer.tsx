import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-primary-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                                <span className="text-primary-800 font-bold text-xl">UR</span>
                            </div>
                            <span className="text-2xl font-serif font-bold">Urban Roof</span>
                        </div>
                        <p className="text-primary-200 mb-4">
                            Invest in premium real estate properties and build your wealth portfolio with Urban Roof.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/properties" className="text-primary-200 hover:text-white transition">
                                    Browse Properties
                                </Link>
                            </li>
                            <li>
                                <Link href="/sign-in" className="text-primary-200 hover:text-white transition">
                                    Sign In
                                </Link>
                            </li>
                            <li>
                                <Link href="/sign-up" className="text-primary-200 hover:text-white transition">
                                    Sign Up
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact</h3>
                        <ul className="space-y-2 text-primary-200">
                            <li>info@urbanroof.com</li>
                            <li>+254 700 000 000</li>
                            <li>Nairobi, Kenya</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-primary-700 mt-8 pt-8 text-center text-primary-300">
                    <p>&copy; {new Date().getFullYear()} Urban Roof. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
