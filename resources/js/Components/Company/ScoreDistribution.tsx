import { ReactNode, useState } from 'react';

interface ScoreItem {
    label: string;
    value: string;
}

interface ScoreDistributionTypeData {
    percentage: number;
    percentageLabel: string;
    totalSubmissions: number;
    scores: ScoreItem[];
}

interface ScoreDistributionProps {
    title: string;
    ikm: ScoreDistributionTypeData;
    sloi: ScoreDistributionTypeData;
}

export default function ScoreDistribution({
    title,
    ikm,
    sloi,
}: ScoreDistributionProps): ReactNode {
    const [activeType, setActiveType] = useState<'IKM' | 'SLOI'>('IKM');

    const activeData = activeType === 'IKM' ? ikm : sloi;
    const scaleInfo = activeType === 'IKM' ? 'skala 1-4' : 'skala 1-6';

    return (
        <div className="flex flex-col rounded-xl border border-slate-200 bg-card-light p-8 shadow-sm">
            <div className="mb-8">
                <div className="mb-1 flex items-center justify-between gap-3">
                    <h2 className="text-lg font-bold text-slate-900">
                        {title}
                    </h2>
                    <select
                        value={activeType}
                        onChange={(e) =>
                            setActiveType(e.target.value as 'IKM' | 'SLOI')
                        }
                        className="rounded-md border border-slate-300 bg-white px-3 py-1 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:border-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                        <option value="IKM">IKM</option>
                        <option value="SLOI">SLOI</option>
                    </select>
                </div>
                <p className="text-sm text-slate-500">
                    Sentimen agregat {activeType} ({scaleInfo})
                </p>
                <p className="mt-1 text-xs font-semibold text-slate-600">
                    Total Submission:{' '}
                    {activeData.totalSubmissions.toLocaleString()}
                </p>
            </div>

            <div className="relative flex flex-1 items-center justify-center">
                <div className="relative size-48 rounded-full border-[20px] border-primary/10">
                    <div className="absolute inset-0 rotate-45 rounded-full border-[20px] border-b-primary/40 border-l-primary/10 border-r-primary border-t-primary" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-extrabold text-slate-900">
                            {activeData.percentage}%
                        </span>
                        <span className="text-[10px] font-bold uppercase text-slate-400">
                            {activeData.percentageLabel}
                        </span>
                    </div>
                </div>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4">
                {activeData.scores.map((score) => (
                    <div key={score.label} className="flex flex-col">
                        <span className="text-xs font-bold uppercase text-slate-400">
                            {score.label}
                        </span>
                        <span className="text-lg font-bold text-slate-900">
                            {score.value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
