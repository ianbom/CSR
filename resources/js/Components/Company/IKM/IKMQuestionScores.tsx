import { ReactNode } from 'react';

interface QuestionScore {
    id: string;
    question: string;
    score: number;
    isTop: boolean;
    isBottom: boolean;
}

interface IKMQuestionScoresProps {
    questionScores: QuestionScore[];
}

export default function IKMQuestionScores({
    questionScores,
}: IKMQuestionScoresProps): ReactNode {
    const filteredScores = questionScores.filter((q) => q.isTop || q.isBottom);

    return (
        <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm lg:col-span-2">
            <h3 className="mb-8 text-base font-bold">
                Skor Rata-rata per Pertanyaan
            </h3>
            <div className="space-y-8">
                {filteredScores.map((q) => (
                    <div key={q.id} className="flex items-center gap-4">
                        <div className="flex-1">
                            {q.isTop ? (
                                <p className="mb-1 text-[10px] font-bold uppercase text-green-500">
                                    PERFORMA TERBAIK
                                </p>
                            ) : q.isBottom ? (
                                <p className="mb-1 text-[10px] font-bold uppercase text-red-500">
                                    PERFORMA TERENDAH
                                </p>
                            ) : (
                                <div className="h-[15px]"></div>
                            )}
                            <p className="text-xs font-bold text-slate-700">
                                {q.id}: {q.question}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-2 w-32 overflow-hidden rounded-full bg-slate-100 md:w-48">
                                <div
                                    className={`h-full rounded-full ${
                                        q.score >= 4
                                            ? 'bg-green-500'
                                            : 'bg-red-500'
                                    }`}
                                    style={{
                                        width: `${(q.score / 5) * 100}%`,
                                    }}
                                />
                            </div>
                            <span
                                className={`w-6 text-right text-xs font-bold ${
                                    q.score >= 4
                                        ? 'text-green-500'
                                        : 'text-red-500'
                                }`}
                            >
                                {q.score}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
