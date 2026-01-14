import { ReactNode } from 'react';
import Icon from './Icon';

interface ActivityItemProps {
    icon: string;
    iconBgColor: string;
    iconColor: string;
    title: string;
    description: string;
    time: string;
}

interface ActivityFeedProps {
    title: string;
    activities: ActivityItemProps[];
    viewAllLink?: string;
}

function ActivityItem({
    icon,
    iconBgColor,
    iconColor,
    title,
    description,
    time,
}: ActivityItemProps): ReactNode {
    return (
        <div className="flex items-start gap-4 rounded-lg p-4 transition-colors hover:bg-slate-50">
            <div
                className={`size-8 rounded-full ${iconBgColor} flex flex-shrink-0 items-center justify-center`}
            >
                <Icon name={icon} className={`${iconColor} text-sm`} />
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900">{title}</p>
                <p className="truncate text-[11px] text-slate-500">
                    {description}
                </p>
                <p className="mt-1 text-[10px] text-slate-400">{time}</p>
            </div>
        </div>
    );
}

export default function ActivityFeed({
    title,
    activities,
    viewAllLink = '#',
}: ActivityFeedProps): ReactNode {
    return (
        <div className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-card-light shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 p-6">
                <h2 className="font-bold text-slate-900">{title}</h2>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-tighter text-primary">
                    Live
                </span>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
                <div className="space-y-1">
                    {activities.map((activity, index) => (
                        <ActivityItem key={index} {...activity} />
                    ))}
                </div>
            </div>
            <a
                href={viewAllLink}
                className="bg-slate-50 p-4 text-center text-xs font-bold text-primary transition-colors hover:bg-primary/5"
            >
                View All Activity
            </a>
        </div>
    );
}
