import { ReactNode } from 'react';

interface AgeRangeItem {
    range: string;
    count: number;
    height: number;
}

interface SLOIAgeRangeChartProps {
    ageRange: AgeRangeItem[];
}

export default function SLOIAgeRangeChart({
    ageRange,
}: SLOIAgeRangeChartProps): ReactNode {
    const colors = ['#14b8a6', '#0d9488', '#0f766e', '#115e59'];

    return (
        <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Responden Berdasarkan Usia
            </h3>
            <div className="flex h-28 items-end justify-between gap-4">
                {ageRange.map((item, i) => (
                    <div
                        key={item.range}
                        className="flex flex-1 flex-col items-center gap-2"
                    >
                        <div
                            className="w-full rounded-t"
                            style={{
                                height: 40,
                                backgroundColor: colors[i] || '#0d9488',
                            }}
                        />
                        <span className="text-[10px] font-semibold text-slate-400">
                            {item.range}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
