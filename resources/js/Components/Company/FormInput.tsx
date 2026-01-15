import { ReactNode } from 'react';
import Icon from './Icon';

interface FormInputProps {
    label: string;
    required?: boolean;
    placeholder?: string;
    type?: 'text' | 'number' | 'date' | 'email';
    value: string | number;
    onChange: (value: string) => void;
    helpText?: string;
}

export default function FormInput({
    label,
    required = false,
    placeholder,
    type = 'text',
    value,
    onChange,
    helpText,
}: FormInputProps): ReactNode {
    return (
        <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-900">
                {label}
                {required && <span className="text-red-500">*</span>}
                {helpText && (
                    <Icon
                        name="info"
                        className="cursor-help text-base text-slate-400"
                        title={helpText}
                    />
                )}
            </label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-base transition-all placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
        </div>
    );
}
