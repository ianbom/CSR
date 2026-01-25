import MaterialIcon from '../Icons/MaterialIcon';

interface SearchInputProps {
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
    className?: string;
}

export default function SearchInput({
    placeholder = 'Cari...',
    value,
    onChange,
    className = '',
}: SearchInputProps) {
    return (
        <div className={`relative ${className}`}>
            <div className="flex w-full items-center rounded-xl bg-white border border-gray-200 focus-within:ring-2 focus-within:ring-primary/20 h-12 overflow-hidden shadow-sm">
                <div className="pl-4 flex items-center justify-center text-gray-400">
                    <MaterialIcon name="search" />
                </div>
                <input
                    type="text"
                    className="w-full h-full bg-transparent border-none text-gray-900 placeholder:text-gray-400 px-3 focus:ring-0 text-base"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange?.(e.target.value)}
                />
            </div>
        </div>
    );
}
