import MaterialIcon from '../Icons/MaterialIcon';

interface TextInputFieldProps {
    label: string;
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
    icon?: string;
    type?: 'text' | 'number' | 'email' | 'tel';
    required?: boolean;
    disabled?: boolean;
}

export default function TextInputField({
    label,
    placeholder,
    value,
    onChange,
    icon,
    type = 'text',
    required = false,
    disabled = false,
}: TextInputFieldProps) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
                {label}
                {required && <span className="ml-1 text-red-500">*</span>}
            </label>
            <div className="relative">
                {icon && (
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                        <MaterialIcon name={icon} className="text-xl" />
                    </div>
                )}
                <input
                    type={type}
                    className={`h-12 w-full ${icon ? 'pl-12' : 'pl-4'} rounded-xl border border-gray-200 bg-gray-50 pr-4 text-gray-900 transition-all placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:bg-gray-100`}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange?.(e.target.value)}
                    required={required}
                    disabled={disabled}
                />
            </div>
        </div>
    );
}
