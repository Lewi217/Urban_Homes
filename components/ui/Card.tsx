import React, { ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps {
    children: ReactNode;
    className?: string;
    hover?: boolean;
}

export default function Card({ children, className, hover = false }: CardProps) {
    return (
        <div
            className={clsx(
                'bg-white rounded-xl shadow-md overflow-hidden',
                hover && 'transition-transform duration-300 hover:scale-105 hover:shadow-xl cursor-pointer',
                className
            )}
        >
            {children}
        </div>
    );
}
