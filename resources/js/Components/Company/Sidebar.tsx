import Modal from '@/Components/Modal';
import { Link, router } from '@inertiajs/react';
import { ReactNode, useState } from 'react';
import Icon from './Icon';

interface NavItemProps {
    href: string;
    icon: string;
    label: string;
    active?: boolean;
    roles?: string[];
    hideForRoles?: string[];
}

interface SidebarProps {
    currentRoute?: string;
    user: {
        companyName?: string;
        name: string;
        email: string;
        avatar?: string;
        role: string;
    };
}

const navItems: NavItemProps[] = [
    { href: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { href: '/projects', icon: 'assignment', label: 'Projects' },
    {
        href: '/enumerators',
        icon: 'group',
        label: 'Enumerators',
        hideForRoles: ['superadmin', 'admin'],
    },
    // { href: '/inbox', icon: 'move_to_inbox', label: 'Data Inbox' },
    // { href: '/reports', icon: 'description', label: 'Reports' },

    { href: '/profile', icon: 'settings', label: 'Settings' },
    {
        href: '/templates',
        icon: 'folder',
        label: 'Templates',
        roles: ['superadmin', 'admin'],
    },
    {
        href: '/companies',
        icon: 'business',
        label: 'Companies',
        roles: ['superadmin', 'admin'],
    },
    {
        href: '/users',
        icon: 'manage_accounts',
        label: 'Users',
        roles: ['superadmin', 'admin'],
    },
];

function NavItem({
    href,
    icon,
    label,
    active = false,
}: NavItemProps): ReactNode {
    const baseClasses =
        'flex items-center gap-4 px-4 py-3 rounded-lg transition-all';
    const activeClasses = active
        ? 'bg-white/15 border-l-4 border-white'
        : 'hover:bg-white/10';

    return (
        <Link href={href} className={`${baseClasses} ${activeClasses}`}>
            <Icon name={icon} />
            <span className="font-medium">{label}</span>
        </Link>
    );
}

export default function Sidebar({
    currentRoute,
    user,
}: SidebarProps): ReactNode {
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogout = () => {
        router.post(route('logout'));
    };

    return (
        <aside className="relative z-10 flex w-72 flex-shrink-0 flex-col bg-primary text-white transition-all duration-300">
            {/* Logo */}
            <div className="flex items-center gap-3 p-8">
                <a href="/">
                    <img
                        src="/img/LogoHeader.png"
                        alt="Logo"
                        className="h-10 w-auto opacity-75 brightness-0 invert filter"
                    />
                </a>
            </div>

            {/* Navigation */}
            <nav className="mt-4 flex-1 space-y-1 px-4">
                {navItems
                    .filter((item) => {
                        const userRole = user.role.toLowerCase();
                        const isAllowedByRoles =
                            !item.roles ||
                            item.roles
                                .map((r) => r.toLowerCase())
                                .includes(userRole);
                        const isHiddenByRoles =
                            item.hideForRoles &&
                            item.hideForRoles
                                .map((r) => r.toLowerCase())
                                .includes(userRole);
                        return isAllowedByRoles && !isHiddenByRoles;
                    })
                    .map((item) => (
                        <NavItem
                            key={item.href}
                            {...item}
                            active={
                                currentRoute === item.href ||
                                currentRoute?.startsWith(item.href + '/')
                            }
                        />
                    ))}
            </nav>

            {/* User Profile */}
            <div className="border-t border-white/10 p-6">
                <div className="flex items-center gap-3 rounded-xl bg-white/10 p-3">
                    <div
                        className="size-10 rounded-full bg-white/20 bg-cover bg-center"
                        style={{
                            backgroundImage: user.avatar
                                ? `url("${user.avatar}")`
                                : undefined,
                        }}
                    >
                        {!user.avatar && (
                            <div className="flex size-full items-center justify-center">
                                <Icon name="person" className="text-white/70" />
                            </div>
                        )}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="truncate text-sm font-bold">
                            {user.companyName ?? user.name ?? 'Admin'}
                        </p>
                        <p className="truncate text-xs opacity-70">
                            {user.email ?? 'admin@gmail.com'}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowLogoutModal(true)}
                        className="group flex size-10 items-center justify-center rounded-lg bg-white/5 transition-all hover:bg-white/20"
                        title="Logout"
                    >
                        <Icon
                            name="logout"
                            className="text-[20px] text-white/60 transition-colors group-hover:text-white"
                        />
                    </button>
                </div>
            </div>

            {/* Logout Confirmation Modal */}
            <Modal
                show={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                maxWidth="sm"
            >
                <div className="p-6">
                    <div className="mb-4 flex items-center justify-center">
                        <div className="flex size-14 items-center justify-center rounded-full bg-red-100 text-red-600">
                            <Icon name="logout" className="text-3xl" />
                        </div>
                    </div>
                    <h3 className="mb-2 text-center text-lg font-bold text-gray-900">
                        Konfirmasi Logout
                    </h3>
                    <p className="mb-6 text-center text-sm text-gray-600">
                        Apakah Anda yakin ingin keluar dari aplikasi? Anda harus
                        login kembali untuk mengakses sistem.
                    </p>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => setShowLogoutModal(false)}
                            className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-gray-100"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-red-700 focus:ring-2 focus:ring-red-200"
                        >
                            Ya, Keluar
                        </button>
                    </div>
                </div>
            </Modal>
        </aside>
    );
}
