import MaterialIcon from '../Icons/MaterialIcon';

interface IconButtonProps {
    icon: string;
    onClick?: () => void;
    className?: string;
}

export default function IconButton({
    icon,
    onClick,
    className = '',
}: IconButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`flex size-10 items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors ${className}`}
        >
            <MaterialIcon name={icon} className="text-[20px]" />
        </button>
    );
}
