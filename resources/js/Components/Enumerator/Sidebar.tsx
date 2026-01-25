import { Link } from '@inertiajs/react';
import Logo from './Icons/Logo';
import MaterialIcon from './Icons/MaterialIcon';

interface NavItem {
    label: string;
    icon: string;
    href: string;
    active?: boolean;
}

interface SidebarProps {
    navItems: NavItem[];
    userName?: string;
    isOnline?: boolean;
    onLogout?: () => void;
    isMobileOpen?: boolean;
    onMobileClose?: () => void;
}

export default function Sidebar({
    navItems,
    userName = 'Enumerator',
    isOnline = true,
    onLogout,
    isMobileOpen = false,
    onMobileClose,
}: SidebarProps) {
    return (
        <>
            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 md:hidden"
                    onClick={onMobileClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 h-full w-64 transform flex-col border-r border-gray-200 bg-white transition-transform duration-300 ease-in-out md:static md:bg-gray-50 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} md:flex md:translate-x-0 ${isMobileOpen ? 'flex' : 'hidden md:flex'} `}
            >
                {/* Logo */}
                <div className="flex items-center gap-3 p-6">
                    <div className="flex size-8 items-center justify-center text-primary">
                        <Logo />
                    </div>
                    <h2 className="text-xl font-bold tracking-tight text-gray-900">
                        Sistem Survei
                    </h2>
                </div>

                {/* User Status */}
                <div className="px-4 py-2">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-base font-bold text-gray-900">
                            {userName}
                        </h1>
                        <div className="flex items-center gap-2">
                            <span
                                className={`block size-2 rounded-full ${isOnline ? 'bg-primary' : 'bg-gray-400'}`}
                            />
                            <p className="text-sm font-medium text-gray-500">
                                {isOnline ? 'Online' : 'Offline'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto px-4 py-4">
                    <nav className="flex flex-col gap-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                                    item.active
                                        ? 'bg-gray-200 text-primary'
                                        : 'text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                <MaterialIcon
                                    name={item.icon}
                                    filled={item.active}
                                />
                                <p
                                    className={`text-sm ${item.active ? 'font-bold' : 'font-medium'}`}
                                >
                                    {item.label}
                                </p>
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Logout Button */}
                <div className="border-t border-gray-200 p-4">
                    <button
                        onClick={onLogout}
                        className="flex w-full items-center gap-3 px-3 py-2 text-gray-500 transition-colors hover:text-red-500"
                    >
                        <MaterialIcon name="logout" />
                        <p className="text-sm font-medium">Log Out</p>
                    </button>
                </div>

                {/* Mobile Close Button */}
                <button
                    onClick={onMobileClose}
                    className="absolute right-4 top-4 p-2 text-gray-500 hover:text-gray-700 md:hidden"
                >
                    <MaterialIcon name="close" />
                </button>
            </aside>
        </>
    );
}
