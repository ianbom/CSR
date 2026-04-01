import { ReactNode } from 'react';
import Icon from './Icon';

interface FormTextareaProps {
    label: string;
    required?: boolean;
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    rows?: number;
    helpText?: string;
    error?: string;
}

export default function FormTextarea({
    label,
    required = false,
    placeholder,
    value,
    onChange,
    rows = 4,
    helpText,
    error,
}: FormTextareaProps): ReactNode {
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
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                rows={rows}
                className={`min-h-[120px] w-full resize-y rounded-xl border px-4 py-3.5 text-base transition-all placeholder:text-slate-400 focus:ring-2 ${
                    error
                        ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-slate-200 bg-slate-50 focus:border-primary focus:ring-primary/20'
                }`}
            />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
}
