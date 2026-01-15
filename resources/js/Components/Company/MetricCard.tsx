import { ReactNode } from 'react';
import Icon from './Icon';

interface MetricCardProps {
    icon: string;
    iconBgColor: string;
    iconColor: string;
    label: string;
    value: string | number;
    unit?: string;
    badge?: {
        text: string;
        type: 'positive' | 'stable' | 'info';
    };
    footer?: ReactNode;
}

export default function MetricCard({
    icon,
    iconBgColor,
    iconColor,
    label,
    value,
    unit,
    badge,
    footer,
}: MetricCardProps): ReactNode {
    const badgeStyles = {
        positive: 'bg-primary/10 text-primary',
        stable: 'bg-gray-100 text-gray-600',
        info: 'bg-blue-50 text-blue-600',
    };

    return (
        <div className="relative overflow-hidden rounded-xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5">
            <div className="mb-4 flex items-start justify-between">
                <div className={`rounded-lg p-2 ${iconBgColor} ${iconColor}`}>
                    <Icon name={icon} />
                </div>
                {badge && (
                    <div
                        className={`flex items-center gap-1 rounded px-2 py-0.5 text-xs font-bold ${badgeStyles[badge.type]}`}
                    >
                        {badge.type === 'positive' && (
                            <Icon name="trending_up" className="text-xs" />
                        )}
                        {badge.text}
                    </div>
                )}
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {label}
            </h3>
            <div className="mt-1 flex items-baseline gap-2">
                <p className="text-4xl font-black">{value}</p>
                {unit && (
                    <p className="text-sm font-medium text-slate-400">{unit}</p>
                )}
            </div>
            {footer && (
                <div className="mt-4 border-t border-slate-50 pt-4">
                    {footer}
                </div>
            )}
        </div>
    );
}
