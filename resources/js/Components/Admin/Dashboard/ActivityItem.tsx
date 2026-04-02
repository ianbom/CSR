import { Building2, FileText, FolderKanban, Users } from 'lucide-react';
import type { RecentActivity } from './types';

interface ActivityItemProps {
    activity: RecentActivity;
}

export function ActivityItem({ activity }: ActivityItemProps) {
    const typeConfig = {
        submission: {
            icon: FileText,
            color: 'bg-blue-500',
        },
        project: {
            icon: FolderKanban,
            color: 'bg-emerald-500',
        },
        company: {
            icon: Building2,
            color: 'bg-purple-500',
        },
        user: {
            icon: Users,
            color: 'bg-amber-500',
        },
    };

    const config = typeConfig[activity.type];
    const Icon = config.icon;

    return (
        <div className="flex gap-3 py-3">
            <div
                className={'flex h-9 w-9 shrink-0 items-center justify-center rounded-full ' + config.color}
            >
                <Icon className="h-4 w-4 text-white" />
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {activity.action}
                </p>
                <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                    {activity.description}
                </p>
            </div>
            <span className="shrink-0 text-xs text-slate-400">
                {activity.time}
            </span>
        </div>
    );
}
