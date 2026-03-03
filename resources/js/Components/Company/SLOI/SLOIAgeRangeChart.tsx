import { ReactNode } from 'react';
// sloi
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
    const colors = ['#00753D', '#00753D', '#00753D', '#00753D'];

    return (
        <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Responden Berdasarkan Usia
            </h3>
            <div className="mt-6 flex h-32 items-end justify-between gap-4 pt-4">
                {ageRange.map((item, i) => (
                    <div
                        key={item.range}
                        className="flex h-full flex-1 flex-col items-center justify-end gap-1"
                    >
                        <span className="text-[10px] font-bold text-slate-600">
                            {item.count}
                        </span>
                        <div
                            className="w-full rounded-t transition-all duration-500"
                            style={{
                                height: `${Math.max(item.height, 2)}%`,
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
