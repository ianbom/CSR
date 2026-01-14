import { ReactNode } from 'react';

interface ScoreItem {
    label: string;
    value: string;
}

interface ScoreDistributionProps {
    title: string;
    description: string;
    percentage: number;
    percentageLabel: string;
    scores: ScoreItem[];
}

export default function ScoreDistribution({
    title,
    description,
    percentage,
    percentageLabel,
    scores,
}: ScoreDistributionProps): ReactNode {
    return (
        <div className="flex flex-col rounded-xl border border-slate-200 bg-card-light p-8 shadow-sm">
            <h2 className="mb-1 text-lg font-bold text-slate-900">{title}</h2>
            <p className="mb-8 text-sm text-slate-500">{description}</p>
            <div className="relative flex flex-1 items-center justify-center">
                <div className="relative size-48 rounded-full border-[20px] border-primary/10">
                    <div className="absolute inset-0 rotate-45 rounded-full border-[20px] border-b-primary/40 border-l-primary/10 border-r-primary border-t-primary" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-extrabold text-slate-900">
                            {percentage}%
                        </span>
                        <span className="text-[10px] font-bold uppercase text-slate-400">
                            {percentageLabel}
                        </span>
                    </div>
                </div>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4">
                {scores.map((score) => (
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
