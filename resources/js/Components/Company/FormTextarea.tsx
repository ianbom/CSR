import { ReactNode } from 'react';

interface FormTextareaProps {
    label: string;
    required?: boolean;
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    rows?: number;
}

export default function FormTextarea({
    label,
    required = false,
    placeholder,
    value,
    onChange,
    rows = 4,
}: FormTextareaProps): ReactNode {
    return (
        <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-900">
                {label}
                {required && <span className="text-red-500">*</span>}
            </label>
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                rows={rows}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-base transition-all placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
        </div>
    );
}
