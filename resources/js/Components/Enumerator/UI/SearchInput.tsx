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
            <div className="flex h-12 w-full items-center overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm focus-within:ring-2 focus-within:ring-primary/20">
                <div className="flex items-center justify-center pl-4 text-gray-400">
                    <MaterialIcon name="search" />
                </div>
                <input
                    type="text"
                    className="h-full w-full border-none bg-transparent px-3 text-base text-gray-900 placeholder:text-gray-400 focus:ring-0"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange?.(e.target.value)}
                />
            </div>
        </div>
    );
}
