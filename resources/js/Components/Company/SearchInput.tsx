import { ReactNode } from 'react';
import Icon from './Icon';

interface SearchInputProps {
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
}

export default function SearchInput({
    placeholder = 'Search...',
    value,
    onChange,
}: SearchInputProps): ReactNode {
    return (
        <div className="relative flex-1">
            <Icon
                name="search"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
        </div>
    );
}
