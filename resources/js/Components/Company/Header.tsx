import { ReactNode } from 'react';
import Icon from './Icon';

interface HeaderProps {
    breadcrumb: {
        parent: string;
        current: string;
    };
}

export default function Header({ breadcrumb }: HeaderProps): ReactNode {
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

            {/* Right Actions */}
            <div className="flex items-center gap-6">
                {/* Search */}
                <div className="relative w-72">
                    <Icon
                        name="search"
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                        type="text"
                        placeholder="Search data points..."
                        className="w-full rounded-lg border-none bg-slate-100 py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/50"
                    />
                </div>

                {/* Notifications */}
                <button className="relative p-2 text-slate-500 transition-colors hover:text-primary">
                    <Icon name="notifications" />
                    <span className="absolute right-2 top-2 size-2 rounded-full border-2 border-white bg-red-500" />
                </button>

                {/* Divider */}
                <div className="h-8 w-px bg-slate-200" />

                {/* Help */}
                <button className="flex items-center gap-2 rounded-lg px-3 py-1.5 transition-colors hover:bg-slate-100">
                    <div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
                        <Icon name="help" className="text-xl text-primary" />
                    </div>
                </button>
            </div>
        </header>
    );
}
