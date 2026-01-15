import { ReactNode } from 'react';

interface IconProps {
    name: string;
    className?: string;
    title?: string;
}

export default function Icon({
    name,
    className = '',
    title,
}: IconProps): ReactNode {
    return (
        <span
            className={`material-symbols-outlined ${className}`}
            title={title}
        >
            {name}
        </span>
    );
}
