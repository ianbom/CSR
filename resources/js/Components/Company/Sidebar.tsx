import { Link } from '@inertiajs/react';
import { ReactNode } from 'react';
import Icon from './Icon';

interface NavItemProps {
    href: string;
    icon: string;
    label: string;
    active?: boolean;
}

interface SidebarProps {
    currentRoute?: string;
    user: {
        name: string;
        email: string;
        avatar?: string;
    };
}

const navItems: NavItemProps[] = [
    { href: '/company/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { href: '/company/projects', icon: 'assignment', label: 'Projects' },
    { href: '/company/enumerators', icon: 'group', label: 'Enumerators' },
    { href: '/company/inbox', icon: 'move_to_inbox', label: 'Data Inbox' },
    { href: '/company/reports', icon: 'description', label: 'Reports' },
    { href: '/company/settings', icon: 'settings', label: 'Settings' },
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
    return (
        <aside className="flex w-72 flex-shrink-0 flex-col bg-primary text-white transition-all duration-300">
            {/* Logo */}
            <div className="flex items-center gap-3 p-8">
                <div className="rounded-lg bg-white/20 p-2">
                    <Icon name="analytics" className="text-3xl text-white" />
                </div>
                <h1 className="text-xl font-extrabold tracking-tight">
                    CSR<span className="font-light opacity-80">SAAS</span>
                </h1>
            </div>

            {/* Navigation */}
            <nav className="mt-4 flex-1 space-y-1 px-4">
                {navItems.map((item) => (
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
                            {user.name}
                        </p>
                        <p className="truncate text-xs opacity-70">
                            {user.email}
                        </p>
                    </div>
                    <Link href={route('logout')} method="post" as="button">
                        <Icon
                            name="logout"
                            className="text-sm opacity-60 transition-opacity hover:opacity-100"
                        />
                    </Link>
                </div>
            </div>
        </aside>
    );
}
