import { FolderKanban, Users } from 'lucide-react';
import type { Company } from './types';

interface CompanyCardProps {
    company: Company;
}

export function CompanyCard({ company }: CompanyCardProps) {
    const statusColors = {
        active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
        pending:
            'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
        suspended:
            'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        deleted:
            'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400',
    };

    return (
        <div className="group flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm transition-all hover:shadow-md dark:bg-slate-800">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-lg font-bold text-white shadow-md">
                {company.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-slate-900 dark:text-white">
                    {company.name}
                </p>
                <div className="mt-1 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                        <FolderKanban className="h-3.5 w-3.5" />
                        {company.projects_count} proyek
                    </span>
                    <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {company.users_count} user
                    </span>
                </div>
            </div>
            <span
                className={
                    'rounded-full px-2.5 py-1 text-xs font-medium ' +
                    statusColors[company.status]
                }
            >
                {company.status}
            </span>
        </div>
    );
}
