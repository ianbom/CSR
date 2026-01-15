import { ReactNode } from 'react';

interface DistributionItem {
    score: number;
    percentage: number;
    color: string;
}

interface IKMAnswerDistributionProps {
    distribution: DistributionItem[];
}

export default function IKMAnswerDistribution({
    distribution,
}: IKMAnswerDistributionProps): ReactNode {
    return (
        <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="mb-6 text-base font-bold">
                Distribusi Jawaban (1-5)
            </h3>
            <div className="space-y-6">
                {distribution.map((item) => (
                    <div key={item.score} className="flex items-center gap-3">
                        <span className="w-4 text-xs font-bold">
                            {item.score}
                        </span>
                        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-50">
                            <div
                                className={`h-full rounded-full ${item.color}`}
                                style={{ width: `${item.percentage}%` }}
                            />
                        </div>
                        <span className="w-10 text-right font-mono text-xs text-slate-400">
                            {item.percentage}%
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
