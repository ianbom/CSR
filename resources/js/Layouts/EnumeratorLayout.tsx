import { MobileHeader, Sidebar, TopBar } from '@/Components/Enumerator';
import { router } from '@inertiajs/react';
import { PropsWithChildren, useState } from 'react';

interface NavItem {
    label: string;
    icon: string;
    href: string;
    active?: boolean;
}

interface EnumeratorLayoutProps extends PropsWithChildren {
    activeNav?: string;
}

export default function EnumeratorLayout({
    children,
    activeNav = 'dashboard',
}: EnumeratorLayoutProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navItems: NavItem[] = [
        {
            label: 'Dashboard',
            icon: 'dashboard',
            href: '#',
            active: activeNav === 'dashboard',
        },
        {
            label: 'Tugasku',
            icon: 'assignment',
            href: '#',
            active: activeNav === 'tugasku',
        },
        {
            label: 'Riwayat',
            icon: 'history',
            href: '#',
            active: activeNav === 'riwayat',
        },
        {
            label: 'Profil',
            icon: 'person',
            href: '#',
            active: activeNav === 'profil',
        },
    ];

    const handleLogout = () => {
        router.post(route('logout'));
    };

    const closeMobileMenu = () => setMobileMenuOpen(false);
    const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            {/* Sidebar (Desktop & Mobile) */}
            <Sidebar
                navItems={navItems}
                userName="Enumerator"
                isOnline={true}
                onLogout={handleLogout}
                isMobileOpen={mobileMenuOpen}
                onMobileClose={closeMobileMenu}
            />

            {/* Main Content */}
            <main className="flex flex-1 flex-col overflow-y-auto">
                <MobileHeader
                    onMenuClick={toggleMobileMenu}
                    isMenuOpen={mobileMenuOpen}
                />
                <TopBar profileImage="https://lh3.googleusercontent.com/aida-public/AB6AXuA3Akw0BRi5rbwckYP1b0uFE48O5Kzcz4Bqnw6dYEHhksrtKrnxqDUvLhiCjVIY7Z1jIJ_S4OnL6Rg5qNiHaJlgDgATV9AHam64rZXvmdsdbdBXFf2qlLGgqvQ6ssrei7iAZkbkFQOLO3i9Dkiw5R46Nag0bicWMRkdcNMTvuspmiTCKQKXlIqP04fy5p0PwdHkN0C1aMKZQFa93c85fQ7SeWSWW9iK2hHfLho4cD_STDyGBJdAV1DTqAOuw2sULydiuMSB3-COyAU" />
                <div className="flex-1 p-4 md:px-6 md:py-6">{children}</div>
            </main>
        </div>
    );
}
