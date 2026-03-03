import { ReactNode } from 'react';

interface EducationItem {
    label: string;
    value: number;
    percentage: number;
}

interface SLOIEducationChartProps {
    data?: EducationItem[];
}

const ALL_EDUCATION_LEVELS = ['SD', 'SMP', 'SMA', 'D1-D3', 'D4/S1', 'S2', 'S3'];

export default function SLOIEducationChart({
    data = [],
}: SLOIEducationChartProps): ReactNode {
    // Merge incoming data into all education levels
    const mergedData = ALL_EDUCATION_LEVELS.map((level) => {
        const found = data.find((d) => d.label === level);
        return found ?? { label: level, value: 0, percentage: 0 };
    });
    return (
        <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Tingkat Pendidikan Responden
            </h3>
            <div className="space-y-3">
                {mergedData.map((item) => (
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
