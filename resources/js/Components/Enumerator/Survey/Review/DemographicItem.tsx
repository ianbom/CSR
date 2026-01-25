interface DemographicItemProps {
    label: string;
    value: string;
    onEdit?: () => void;
}

export default function DemographicItem({
    label,
    value,
    onEdit,
}: DemographicItemProps) {
    return (
        <div className="group relative flex flex-col gap-1 rounded-lg border border-transparent p-3 transition-colors hover:border-gray-100 hover:bg-gray-50">
            <span className="text-xs font-semibold uppercase tracking-wider text-green-600">
                {label}
            </span>
            <span className="text-lg font-medium text-gray-900">{value}</span>
            {onEdit && (
                <button
                    onClick={onEdit}
                    aria-label={`Edit ${label}`}
                    className="absolute right-2 top-2 text-primary opacity-0 group-hover:opacity-100"
                >
                    <span className="material-symbols-outlined text-[18px]">
                        edit
                    </span>
                </button>
            )}
        </div>
    );
}
