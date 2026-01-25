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
            className={`flex size-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 transition-colors hover:bg-gray-50 ${className}`}
        >
            <MaterialIcon name={icon} className="text-[20px]" />
        </button>
    );
}
