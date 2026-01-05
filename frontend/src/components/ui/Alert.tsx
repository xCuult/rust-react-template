import { type ReactNode } from "react";

interface AlertProps {
    children: ReactNode;
    variant?: 'error' | 'success' | 'info';
    onClose?: () => void;
}

export function Alert({ children, variant = 'error', onClose }: AlertProps) {
    const variants = {
        error: 'bg-red-50 text-red-800 border-red-200',
        success: 'bg-green-50 text-green-800 border-green-200',
        info: 'bg-blue-50 text-blue-800 border-blue-200',
    };

    return (
        <div className={`p-4 rounded-lg border ${variants[variant]} relative`}>
            {children}
            {onClose && (
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-current opacity-50 hover:opacity-100"
                    aria-label="Close"
                >
                    X
                </button>
            )}
        </div>
    );
}