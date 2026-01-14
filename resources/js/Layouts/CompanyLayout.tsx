import Footer from '@/Components/Company/Footer';
import Header from '@/Components/Company/Header';
import Sidebar from '@/Components/Company/Sidebar';
import { usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode } from 'react';

interface CompanyLayoutProps extends PropsWithChildren {
    breadcrumb: {
        parent: string;
        current: string;
    };
}

export default function CompanyLayout({
    children,
    breadcrumb,
}: CompanyLayoutProps): ReactNode {
    const { auth } = usePage().props as {
        auth: { user: { name: string; email: string } };
    };
    const currentPath = window.location.pathname;

    return (
        <div className="flex h-screen overflow-hidden bg-background-light text-slate-900 antialiased">
            {/* Sidebar */}
            <Sidebar
                currentRoute={currentPath}
                user={{
                    name: auth.user.name,
                    email: auth.user.email,
                }}
            />

            {/* Main Content */}
            <main className="flex flex-1 flex-col overflow-y-auto">
                <Header breadcrumb={breadcrumb} />
                <div className="flex-1">{children}</div>
                <Footer />
            </main>
        </div>
    );
}
