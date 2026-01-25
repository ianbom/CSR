import Logo from './Icons/Logo';
import MaterialIcon from './Icons/MaterialIcon';

interface MobileHeaderProps {
    onMenuClick?: () => void;
    isMenuOpen?: boolean;
}

export default function MobileHeader({ onMenuClick, isMenuOpen = false }: MobileHeaderProps) {
    return (
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white z-20 sticky top-0">
            <div className="flex items-center gap-3">
                <div className="size-6 text-primary">
                    <Logo />
                </div>
                <span className="font-bold text-lg text-gray-900">
                    Sistem Survei
                </span>
            </div>
            <button
                onClick={onMenuClick}
                className="text-gray-900 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
                <MaterialIcon name={isMenuOpen ? 'close' : 'menu'} />
            </button>
        </header>
    );
}
