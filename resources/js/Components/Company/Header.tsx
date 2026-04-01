import { usePage } from '@inertiajs/react';
import { Building2 } from 'lucide-react';
import { ReactNode } from 'react';
import Icon from './Icon';

interface HeaderProps {
    breadcrumb: {
        parent: string;
        current: string;
    };
}

export default function Header({ breadcrumb }: HeaderProps): ReactNode {
    const { auth } = usePage().props as {
        auth: { user: { name: string }; companyName?: string | null };
    };

    const displayName = auth.companyName ?? auth.user.name;

    return (
        <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-slate-200 bg-card-light px-8">
            {/* Breadcrumb */}
            <div className="flex items-center gap-4 text-slate-500">
                <span className="text-sm font-medium">{breadcrumb.parent}</span>
                <Icon name="chevron_right" className="text-base" />
                <span className="text-sm font-bold text-slate-900">
                    {breadcrumb.current}
                </span>
            </div>

            {/* Company / User Name */}
            <div className="flex items-center gap-2.5 border-slate-200 bg-slate-50 px-4 py-2 shadow-sm">
                <div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
                    <Building2 className="size-4 text-primary" />
                </div>
                <span className="text-sm font-bold text-slate-800">
                    {displayName}
                </span>
            </div>
        </header>
    );
}
