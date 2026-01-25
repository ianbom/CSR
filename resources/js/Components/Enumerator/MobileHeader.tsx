import Logo from './Icons/Logo';
import MaterialIcon from './Icons/MaterialIcon';

interface MobileHeaderProps {
    onMenuClick?: () => void;
    isMenuOpen?: boolean;
}

export default function MobileHeader({
    onMenuClick,
    isMenuOpen = false,
}: MobileHeaderProps) {
    return (
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 md:hidden">
            <div className="flex items-center gap-3">
                <div className="size-6 text-primary">
                    <Logo />
                </div>
                <span className="text-lg font-bold text-gray-900">
                    Sistem Survei
                </span>
            </div>
            <button
                onClick={onMenuClick}
                className="rounded-lg p-2 text-gray-900 transition-colors hover:bg-gray-100"
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
                <MaterialIcon name={isMenuOpen ? 'close' : 'menu'} />
            </button>
        </header>
    );
}
