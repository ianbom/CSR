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
            <label className="text-gray-700 text-sm font-medium">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="relative">
                {icon && (
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                        <MaterialIcon name={icon} className="text-xl" />
                    </div>
                )}
                <input
                    type={type}
                    className={`w-full h-12 ${icon ? 'pl-12' : 'pl-4'} pr-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all disabled:bg-gray-100 disabled:cursor-not-allowed`}
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
