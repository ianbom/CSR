import MaterialIcon from '../Icons/MaterialIcon';

interface ChipOption {
    value: string;
    label: string;
    icon?: string;
}

interface ChipGroupProps {
    label?: string;
    options: ChipOption[];
    value?: string;
    onChange?: (value: string) => void;
    required?: boolean;
}

export default function ChipGroup({
    label,
    options,
    value,
    onChange,
    required = false,
}: ChipGroupProps) {
    return (
        <div className="flex flex-col gap-2">
            {label && (
                <label className="text-sm font-medium text-gray-700">
                    {label}
                    {required && <span className="ml-1 text-red-500">*</span>}
                </label>
            )}
            <div className="flex flex-wrap gap-2">
                {options.map((option) => (
                    <button
                        key={option.value}
                        type="button"
                        onClick={() => onChange?.(option.value)}
                        className={`flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-all ${
                            value === option.value
                                ? 'border-primary bg-primary text-white shadow-sm'
                                : 'border-gray-200 bg-white text-gray-700 hover:border-primary/50'
                        }`}
                    >
                        {option.icon && (
                            <MaterialIcon
                                name={option.icon}
                                className="text-lg"
                            />
                        )}
                        <span>{option.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
