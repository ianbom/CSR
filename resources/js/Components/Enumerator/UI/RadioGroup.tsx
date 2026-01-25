import { ReactNode } from 'react';
import MaterialIcon from '../Icons/MaterialIcon';

interface RadioOption {
    value: string;
    label: string;
    icon?: string;
}

interface RadioGroupProps {
    label?: string;
    options: RadioOption[];
    value?: string;
    onChange?: (value: string) => void;
    name: string;
    required?: boolean;
}

export default function RadioGroup({
    label,
    options,
    value,
    onChange,
    name,
    required = false,
}: RadioGroupProps) {
    return (
        <div className="flex flex-col gap-2">
            {label && (
                <label className="text-gray-700 text-sm font-medium">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <div className="flex gap-3">
                {options.map((option) => (
                    <label
                        key={option.value}
                        className="flex-1 cursor-pointer"
                    >
                        <input
                            type="radio"
                            name={name}
                            value={option.value}
                            checked={value === option.value}
                            onChange={() => onChange?.(option.value)}
                            className="peer sr-only"
                        />
                        <div className="flex items-center justify-center gap-2 h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 transition-all peer-checked:border-primary peer-checked:ring-1 peer-checked:ring-primary peer-checked:bg-primary/5 peer-checked:text-primary hover:border-primary/50">
                            {option.icon && (
                                <MaterialIcon name={option.icon} className="text-lg" />
                            )}
                            <span className="font-medium text-sm">{option.label}</span>
                        </div>
                    </label>
                ))}
            </div>
        </div>
    );
}
