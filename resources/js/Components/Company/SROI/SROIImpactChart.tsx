import { ReactNode } from 'react';

interface ImpactTimelineItem {
    year: string;
    expenses: number;
    impact: number;
    netBenefit: number;
}

interface SROIImpactChartProps {
    impactTimeline: ImpactTimelineItem[];
}

export default function SROIImpactChart({
    impactTimeline,
}: SROIImpactChartProps): ReactNode {
    return (
        <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
                <h3 className="text-base font-bold">
                    Proyeksi Investasi vs Dampak
                </h3>
                <div className="flex gap-4 text-xs font-bold">
                    <div className="flex items-center gap-1">
                        <span className="size-2 rounded-full bg-slate-300"></span>{' '}
                        Investasi
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="size-2 rounded-full bg-primary"></span>{' '}
                        Nilai Dampak
                    </div>
                </div>
            </div>
            <div className="flex h-64 items-end gap-8 px-4">
                {impactTimeline.map((item, i) => (
                    <div
                        key={i}
                        className="group flex flex-1 flex-col justify-end gap-1"
                    >
                        <div className="relative flex w-full justify-center">
                            <div
                                className="w-8 rounded-t bg-primary transition-all group-hover:bg-primary/90"
                                style={{
                                    height: `${item.impact / 5}px`,
                                }}
                            ></div>
                        </div>
                        <div className="relative flex w-full justify-center">
                            <div
                                className="w-8 rounded-t bg-slate-300 transition-all group-hover:bg-slate-400"
                                style={{
                                    height: `${item.expenses / 5}px`,
                                }}
                            ></div>
                        </div>
                        <p className="mt-2 text-center text-xs font-bold text-slate-400">
                            {item.year}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
