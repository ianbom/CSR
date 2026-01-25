import { ReactNode } from 'react';
import MaterialIcon from '../Icons/MaterialIcon';

interface FilterChipProps {
    children: ReactNode;
    active?: boolean;
    onClick?: () => void;
    showDropdown?: boolean;
}

export default function FilterChip({
    children,
    active = false,
    onClick,
    showDropdown = false,
}: FilterChipProps) {
    const baseClasses =
        'flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full pl-4 pr-3 transition-all text-sm font-medium';

    const activeClasses = active
        ? 'bg-primary text-white shadow-md shadow-primary/20 font-bold'
        : 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-700';

    return (
        <button className={`${baseClasses} ${activeClasses}`} onClick={onClick}>
            <span>{children}</span>
            {showDropdown && (
                <MaterialIcon name="expand_more" className="text-[18px]" />
            )}
        </button>
    );
}
