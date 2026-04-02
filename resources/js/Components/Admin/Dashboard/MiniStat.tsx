interface MiniStatProps {
    icon: React.ElementType;
    label: string;
    value: number;
    subtitle?: string;
}

export function MiniStat({ icon: Icon, label, value, subtitle }: MiniStatProps) {
    return (
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700">
                <Icon className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-xl font-semibold text-slate-900 dark:text-white">
                    {value.toLocaleString()}
                </p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                    {label}
                </p>
            </div>
        </div>
    );
}
