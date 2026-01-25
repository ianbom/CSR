import MaterialIcon from '../Icons/MaterialIcon';

interface SelectOption {
    value: string;
    label: string;
}

interface SelectFieldProps {
    label: string;
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
    options: SelectOption[];
    required?: boolean;
    disabled?: boolean;
}

export default function SelectField({
    label,
    placeholder = 'Pilih...',
    value,
    onChange,
    options,
    required = false,
    disabled = false,
}: SelectFieldProps) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
                {label}
                {required && <span className="ml-1 text-red-500">*</span>}
            </label>
            <div className="relative">
                <select
                    className="h-12 w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 pl-4 pr-10 text-gray-900 transition-all focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:bg-gray-100"
                    value={value}
                    onChange={(e) => onChange?.(e.target.value)}
                    required={required}
                    disabled={disabled}
                >
                    <option value="" disabled>
                        {placeholder}
                    </option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400">
                    <MaterialIcon name="expand_more" className="text-xl" />
                </div>
            </div>
        </div>
    );
}
