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
            <label className="text-gray-700 text-sm font-medium">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="relative">
                <select
                    className="w-full h-12 pl-4 pr-10 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all appearance-none disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
                    <MaterialIcon name="expand_more" className="text-xl" />
                </div>
            </div>
        </div>
    );
}
