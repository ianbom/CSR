import { ReactNode } from 'react';

interface ReviewItemProps {
    label: string;
    value: string;
    badge?: ReactNode;
    onEdit?: () => void;
}

export default function ReviewItem({
    label,
    value,
    badge,
    onEdit,
}: ReviewItemProps) {
    return (
        <div className="group relative flex flex-col justify-between gap-2 p-4 transition-colors hover:bg-gray-50 sm:flex-row sm:items-center md:p-5">
            <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-green-600">
                    {label}
                </span>
                <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{value}</span>
                    {badge}
                </div>
            </div>
            {onEdit && (
                <button
                    onClick={onEdit}
                    aria-label={`Edit ${label}`}
                    className="absolute right-4 top-4 text-primary opacity-0 transition-opacity hover:text-primary-dark focus:opacity-100 group-hover:opacity-100 sm:static"
                >
                    <span className="material-symbols-outlined text-[20px]">
                        edit
                    </span>
                </button>
            )}
        </div>
    );
}
