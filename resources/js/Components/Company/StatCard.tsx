import { ReactNode } from 'react';
import Icon from './Icon';

interface StatCardProps {
    icon: string;
    iconBgColor: string;
    iconColor: string;
    label: string;
    badge: string;
    value: string | number;
    trend?: {
        text: string;
        isPositive?: boolean;
    };
}

export default function StatCard({
    icon,
    iconBgColor,
    iconColor,
    label,
    badge,
    value,
    trend,
}: StatCardProps): ReactNode {
    return (
        <div className="rounded-xl border border-slate-200 bg-card-light p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-4 flex items-start justify-between">
                <div className={`p-2 ${iconBgColor} ${iconColor} rounded-lg`}>
                    <Icon name={icon} />
                </div>
                <span className="text-xs font-bold text-slate-400">
                    {badge}
                </span>
            </div>
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <h3 className="mt-1 text-3xl font-extrabold text-slate-900">
                {value}
            </h3>
            {trend && (
                <p
                    className={`mt-2 flex items-center gap-1 text-xs font-bold ${trend.isPositive !== false ? 'text-primary' : 'text-slate-400'}`}
                >
                    {trend.isPositive !== false && (
                        <Icon name="trending_up" className="text-xs" />
                    )}
                    {trend.text}
                </p>
            )}
        </div>
    );
}
