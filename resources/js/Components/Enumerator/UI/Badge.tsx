import { ReactNode } from 'react';

type BadgeVariant = 'blue' | 'purple' | 'green' | 'amber' | 'gray';

interface BadgeProps {
    children: ReactNode;
    variant?: BadgeVariant;
    rounded?: 'md' | 'full';
}

const variantStyles: Record<BadgeVariant, string> = {
    blue: 'bg-blue-50 text-blue-700 ring-blue-700/10',
    purple: 'bg-purple-50 text-purple-700 ring-purple-700/10',
    green: 'bg-primary/10 text-primary ring-primary/20',
    amber: 'bg-amber-50 text-amber-700 ring-amber-600/20',
    gray: 'bg-gray-100 text-gray-600 ring-gray-500/10',
};

export default function Badge({
    children,
    variant = 'blue',
    rounded = 'md',
}: BadgeProps) {
    const roundedClass = rounded === 'full' ? 'rounded-full' : 'rounded-md';

    return (
        <span
            className={`inline-flex items-center px-2 py-1 text-xs font-bold ring-1 ring-inset ${roundedClass} ${variantStyles[variant]}`}
        >
            {children}
        </span>
    );
}
