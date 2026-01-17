import { ReactNode } from 'react';

interface TrendDataItem {
    month: string;
    score: number;
    height: number;
}

interface SLOITrendChartProps {
    trendData: TrendDataItem[];
}

export default function SLOITrendChart({
    trendData,
}: SLOITrendChartProps): ReactNode {
    return (
        <div className="lg:col-span-3">
            <div className="h-full rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Tren Data SLOI
                    </h3>
                    <select className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
                        <option>6 Bulan Terakhir</option>
                        <option>12 Bulan Terakhir</option>
                    </select>
                </div>

                <div className="flex h-48 items-end justify-between gap-4 px-2">
                    {trendData.map((item, i) => {
                        const colors = [
                            '#00753D',
                            '#00753D',
                            '#00753D',
                            '#00753D',
                            '#00753D',
                            '#00753D',
                        ];
                        return (
                            <div
                                key={i}
                                className="flex flex-1 flex-col items-center gap-2"
                            >
                                <div
                                    className="w-full rounded-t-lg transition-all hover:opacity-90"
                                    style={{
                                        height: 100,
                                        backgroundColor: colors[i] || '#14b8a6',
                                    }}
                                />
                                <span className="text-[10px] font-semibold uppercase text-slate-400">
                                    {item.month}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
