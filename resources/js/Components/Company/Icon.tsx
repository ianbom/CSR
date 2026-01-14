import { ReactNode } from 'react';

interface IconProps {
    name: string;
    className?: string;
}

export default function Icon({ name, className = '' }: IconProps): ReactNode {
    return (
        <span className={`material-symbols-outlined ${className}`}>{name}</span>
    );
}
