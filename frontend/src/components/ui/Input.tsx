import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, className = '', id, ...props }, ref) => {
        const inputId = id || props.name;

        return(
            <div className="space-y-1">
                <label
                    htmlFor={inputId}
                    className="block text-sm font-medium text-gray-700"
                >
                    {label}
                </label>
                <input
                    ref={ref}
                    id={inputId}
                    className={`
                        block w-full px-3 py-2 border rounded-lg shadow-sm
                        placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500
                        ${error ? 'border-red-500' : 'border-gray-300'}
                        ${className}
                    `}
                    {...props}
                />
                {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
        );
    }
);

Input.displayName = 'Input';