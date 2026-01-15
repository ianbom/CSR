import { ReactNode } from 'react';
import Icon from './Icon';

interface SummaryCardProps {
    icon: string;
    iconBgColor: string;
    iconColor: string;
    title: string;
    value: string | number;
    subtitle: string;
}

export default function SummaryCard({
    icon,
    iconBgColor,
    iconColor,
    title,
    value,
    subtitle,
}: SummaryCardProps): ReactNode {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="mb-4 flex items-center gap-3">
                <div
                    className={`flex size-10 items-center justify-center rounded-lg ${iconBgColor}`}
                >
                    <Icon name={icon} className={iconColor} />
                </div>
                <span className="text-sm font-semibold text-slate-700">
                    {title}
                </span>
            </div>
            <p className="text-3xl font-bold text-slate-900">{value}</p>
            <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </div>
    );
}
