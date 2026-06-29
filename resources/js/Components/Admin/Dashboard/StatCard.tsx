import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

interface StatCardProps {
    icon: React.ElementType;
    label: string;
    value: string | number;
    trend?: { value: number; label: string };
}

export function StatCard({ icon: Icon, label, value, trend }: StatCardProps) {
    const isPositive = trend && trend.value >= 0;

    return (
        <div className="group relative rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-200 hover:border-slate-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600">
            <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-700">
                    <Icon className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                </div>
                {trend && (
                    <div
                        className={
                            `+ lex + items-center gap-1 rounded-md px-2 py-1 text-xs font-medium` +
                            (isPositive
                                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
                                : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400')
                        }
                    >
                        {isPositive ? (
                            <ArrowUpRight className="h-3.5 w-3.5" />
                        ) : (
                            <ArrowDownRight className="h-3.5 w-3.5" />
                        )}
                        {Math.abs(trend.value)}%
                    </div>
                )}
            </div>

            <div className="mt-4">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    {label}
                </p>
                <p className="mt-1 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
                    {typeof value === 'number' ? value.toLocaleString() : value}
                </p>
                {trend && (
                    <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
                        {trend.label}
                    </p>
                )}
            </div>
        </div>
    );
}
