import { type ReactNode } from "react";

interface CardProps {
    children: ReactNode;
    className?: string;
}

export function Card({ children, className = '' }: CardProps) {
    return (
        <div
            className={`bg-white rounded-x1 shadow-1g p-6 ${className}`}
        >
            {children}
        </div>
    );
}

interface CardHeaderProps {
    title: string;
    subtitle?: string;
}

export function CardHeader({ title, subtitle }: CardHeaderProps) {
    return (
        <div className="text-content mb-6">
            <h2 className="text-2x1 font-bold text-gray-900">{title}</h2>
            {subtitle && <p className="mt-1 text-gray-600">{subtitle}</p>}
        </div>
    );
}