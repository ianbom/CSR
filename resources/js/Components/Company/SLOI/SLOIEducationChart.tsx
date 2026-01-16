import { ReactNode } from 'react';

interface EducationItem {
    label: string;
    value: number;
    percentage: number;
}

interface SLOIEducationChartProps {
    data?: EducationItem[];
}

export default function SLOIEducationChart({
    data = [
        { label: 'SD', value: 120, percentage: 6.5 },
        { label: 'SMP', value: 245, percentage: 13.3 },
        { label: 'SMA', value: 612, percentage: 33.2 },
        { label: 'S1/D4', value: 680, percentage: 36.9 },
        { label: 'S2', value: 152, percentage: 8.3 },
        { label: 'S3', value: 33, percentage: 1.8 },
    ],
}: SLOIEducationChartProps): ReactNode {
    return (
        <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Tingkat Pendidikan Responden
            </h3>
            <div className="space-y-3">
                {data.map((item) => (
                    <div key={item.label} className="flex items-center gap-3">
                        <span className="w-12 text-xs font-bold text-slate-600">
                            {item.label}
                        </span>
                        <div className="h-6 flex-1 overflow-hidden rounded-full bg-slate-100">
                            <div
                                className="h-full rounded-full bg-primary transition-all"
                                style={{
                                    width: `${item.percentage}%`,
                                }}
                            ></div>
                        </div>
                        <span className="w-16 text-right text-xs font-bold text-slate-500">
                            {item.value}{' '}
                            <span className="text-slate-400">
                                ({item.percentage}%)
                            </span>
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
