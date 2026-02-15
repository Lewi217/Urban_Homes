import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Earth-tone palette for real estate theme
                primary: {
                    50: '#f8f6f3',
                    100: '#ede8e0',
                    200: '#dbd0c0',
                    300: '#c4b199',
                    400: '#b09478',
                    500: '#a0805f',
                    600: '#936f53',
                    700: '#7a5a45',
                    800: '#654b3b',
                    900: '#533e31',
                },
                accent: {
                    50: '#fefce8',
                    100: '#fef9c3',
                    200: '#fef08a',
                    300: '#fde047',
                    400: '#facc15',
                    500: '#eab308',
                    600: '#ca8a04',
                    700: '#a16207',
                    800: '#854d0e',
                    900: '#713f12',
                },
                natural: {
                    50: '#f7f9f7',
                    100: '#e8f0e8',
                    200: '#d4e4d4',
                    300: '#a8cca8',
                    400: '#7ab77a',
                    500: '#5a9f5a',
                    600: '#468246',
                    700: '#396839',
                    800: '#2f542f',
                    900: '#284528',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                serif: ['Playfair Display', 'Georgia', 'serif'],
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-hero': 'linear-gradient(135deg, rgba(147, 111, 83, 0.9) 0%, rgba(83, 62, 49, 0.95) 100%)',
            },
            animation: {
                'fade-in': 'fadeIn 0.6s ease-in-out',
                'slide-up': 'slideUp 0.7s ease-out',
                'float': 'float 3s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(30px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
            },
        },
    },
    plugins: [],
};

export default config;
