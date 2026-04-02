import Footer from '@/Components/Company/Footer';
import Header from '@/Components/Company/Header';
import Sidebar from '@/Components/Company/Sidebar';
import { Toaster } from '@/Components/ui/toaster';
import { usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode } from 'react';

interface AppLayoutProps extends PropsWithChildren {
    breadcrumb: {
        parent: string;
        current: string;
    };
}

export default function AppLayout({
    children,
    breadcrumb,
}: AppLayoutProps): ReactNode {
    const { auth } = usePage().props as unknown as {
        auth: {
            user: { name: string; email: string; role: string };
            companyName?: string;
        };
    };
    const currentPath = window.location.pathname;

    return (
        <div className="flex h-screen overflow-hidden bg-background-light text-slate-900 antialiased">
            {/* Sidebar */}
            <Sidebar
                currentRoute={currentPath}
                user={{
                    companyName: auth.companyName,
                    name: auth.user.name,
                    email: auth.user.email,
                    role: auth.user.role,
                }}
            />

            {/* Main Content */}
            <main className="flex flex-1 flex-col overflow-y-auto">
                <Header breadcrumb={breadcrumb} />
                <div className="flex-1">{children}</div>
                <Footer />
            </main>

            {/* Toast Notifications */}
            <Toaster />
        </div>
    );
}
