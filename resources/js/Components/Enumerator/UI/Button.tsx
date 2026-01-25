import { ReactNode } from 'react';
import MaterialIcon from '../Icons/MaterialIcon';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'disabled';

interface ButtonProps {
    children: ReactNode;
    variant?: ButtonVariant;
    icon?: string;
    iconPosition?: 'left' | 'right';
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
    fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
    primary:
        'bg-primary hover:bg-primary-dark text-white',
    secondary:
        'bg-gray-100 text-gray-400 cursor-not-allowed',
    outline:
        'bg-transparent border border-gray-200 hover:bg-gray-50 text-gray-700',
    disabled:
        'bg-gray-100 text-gray-400 cursor-not-allowed',
};

export default function Button({
    children,
    variant = 'primary',
    icon,
    iconPosition = 'right',
    onClick,
    disabled = false,
    className = '',
    fullWidth = false,
}: ButtonProps) {
    const widthClass = fullWidth ? 'w-full' : '';
    const actualVariant = disabled ? 'disabled' : variant;

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`flex items-center justify-center gap-2 font-bold py-2.5 px-4 rounded-lg transition-colors duration-200 ${variantStyles[actualVariant]} ${widthClass} ${className}`}
        >
            {icon && iconPosition === 'left' && (
                <MaterialIcon name={icon} className="text-[18px]" />
            )}
            <span>{children}</span>
            {icon && iconPosition === 'right' && (
                <MaterialIcon name={icon} className="text-[18px]" />
            )}
        </button>
    );
}
