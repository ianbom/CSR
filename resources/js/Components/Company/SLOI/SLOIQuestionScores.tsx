import { ReactNode } from 'react';

interface QuestionScore {
    id: string;
    score: number;
}

interface SLOIQuestionScoresProps {
    scores?: QuestionScore[];
}

export default function SLOIQuestionScores({
    scores = [
        { id: 'Q1', score: 4.2 },
        { id: 'Q2', score: 3.8 },
        { id: 'Q3', score: 4.5 },
        { id: 'Q4', score: 3.2 },
        { id: 'Q5', score: 4.1 },
        { id: 'Q6', score: 3.9 },
        { id: 'Q7', score: 4.3 },
        { id: 'Q8', score: 3.5 },
        { id: 'Q9', score: 4.0 },
        { id: 'Q10', score: 4.4 },
        { id: 'Q11', score: 3.7 },
        { id: 'Q12', score: 4.2 },
    ],
}: SLOIQuestionScoresProps): ReactNode {
    const getBarColor = (score: number) => {
        if (score >= 4) return 'bg-green-500';
        if (score >= 3) return 'bg-primary';
        return 'bg-amber-500';
    };

    return (
        <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">
                    Rerata Skor Per Pertanyaan SLOI
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="size-3 rounded bg-primary"></span>
                    <span>Skor (skala 1-5)</span>
                </div>
            </div>
            <div className="flex h-64 items-end justify-between gap-2 border-b border-l border-slate-200 pb-2 pl-2">
                {scores.map((item) => {
                    const heightPercent = (item.score / 5) * 100;
                    return (
                        <div
                            key={item.id}
                            className="group flex flex-1 flex-col items-center"
                        >
                            <div className="relative flex w-full flex-col items-center">
                                <span className="mb-1 text-[10px] font-bold text-slate-700">
                                    {item.score}
                                </span>
                                <div
                                    className={`w-full max-w-8 rounded-t ${getBarColor(item.score)} transition-all group-hover:opacity-80`}
                                    style={{
                                        height: `${heightPercent * 2}px`,
                                    }}
                                ></div>
                            </div>
                        </div>
                    );
                })}
            </div>
            {/* X-axis labels */}
            <div className="mt-2 flex justify-between gap-2 pl-2">
                {scores.map((item) => (
                    <div
                        key={item.id}
                        className="flex-1 text-center text-[10px] font-bold text-slate-400"
                    >
                        {item.id}
                    </div>
                ))}
            </div>
        </div>
    );
}
