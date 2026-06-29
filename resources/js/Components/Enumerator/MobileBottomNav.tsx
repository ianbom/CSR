import { Link } from '@inertiajs/react';
import MaterialIcon from './Icons/MaterialIcon';

interface NavItem {
    label: string;
    icon: string;
    href: string;
    active?: boolean;
}

interface MobileBottomNavProps {
    navItems: NavItem[];
}

export default function MobileBottomNav({ navItems }: MobileBottomNavProps) {
    return (
        <nav className="pb-safe fixed inset-x-0 bottom-0 z-50 flex items-center justify-around border-t border-gray-200 bg-white/80 pt-2 backdrop-blur-lg md:hidden">
            {navItems.map((item) => (
                <Link
                    key={item.label}
                    href={item.href}
                    className="flex w-full flex-col items-center justify-center gap-1 p-2"
                >
                    <div
                        className={`flex flex-col items-center justify-center transition-all duration-300 ${item.active ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <MaterialIcon
                            name={item.icon}
                            filled={item.active}
                            className={`text-2xl ${item.active ? 'scale-110' : ''}`}
                        />
                        <span
                            className={`text-[10px] sm:text-xs ${item.active ? 'font-bold' : 'font-medium'}`}
                        >
                            {item.label}
                        </span>
                    </div>
                </Link>
            ))}
        </nav>
    );
}
