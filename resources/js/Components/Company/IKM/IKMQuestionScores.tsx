import { ReactNode } from 'react';

interface QuestionScore {
    id: string;
    score: number;
}

interface IKMQuestionScoresProps {
    kepentinganScores?: QuestionScore[];
    kinerjaScores?: QuestionScore[];
}

// ─── Single Chart ───────────────────────────────────────────

function ScoreChart({
    scores,
    maxScale,
    barColor,
}: {
    scores: QuestionScore[];
    maxScale: number;
    barColor: string;
}) {
    if (scores.length === 0) {
        return (
            <p className="py-8 text-center text-sm text-slate-400">
                Belum ada data.
            </p>
        );
    }

    return (
        <>
            <div className="flex h-48 items-end justify-between gap-1.5 border-b border-l border-slate-200 pb-2 pl-2">
                {scores.map((item) => {
                    const heightPercent = (item.score / maxScale) * 100;
                    return (
                        <div
                            key={item.id}
                            className="group flex flex-1 flex-col items-center"
                        >
                            <div className="relative flex w-full flex-col items-center">
                                <span className="mb-1 text-[9px] font-bold text-slate-600">
                                    {item.score.toFixed(2)}
                                </span>
                                <div
                                    className={`w-full max-w-8 rounded-t ${barColor} transition-all group-hover:opacity-75`}
                                    style={{
                                        height: `${heightPercent * 1.6}px`,
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
            {/* X-axis labels */}
            <div className="mt-1.5 flex justify-between gap-1.5 pl-2">
                {scores.map((item) => (
                    <div
                        key={item.id}
                        className="flex-1 text-center text-[9px] font-bold text-slate-400"
                    >
                        {item.id}
                    </div>
                ))}
            </div>
        </>
    );
}

// ─── Main Component ─────────────────────────────────────────

const DEFAULT_KEP: QuestionScore[] = [
    { id: 'U1', score: 3.8 },
    { id: 'U2', score: 4.1 },
    { id: 'U3', score: 3.5 },
    { id: 'U4', score: 4.0 },
    { id: 'U5', score: 3.9 },
    { id: 'U6', score: 4.2 },
    { id: 'U7', score: 3.7 },
    { id: 'U8', score: 4.3 },
    { id: 'U9', score: 3.6 },
];

const DEFAULT_KIN: QuestionScore[] = [
    { id: 'U1', score: 3.2 },
    { id: 'U2', score: 3.7 },
    { id: 'U3', score: 3.1 },
    { id: 'U4', score: 3.8 },
    { id: 'U5', score: 3.4 },
    { id: 'U6', score: 3.9 },
    { id: 'U7', score: 3.3 },
    { id: 'U8', score: 4.0 },
    { id: 'U9', score: 3.6 },
];

export default function IKMQuestionScores({
    kepentinganScores = DEFAULT_KEP,
    kinerjaScores = DEFAULT_KIN,
}: IKMQuestionScoresProps): ReactNode {
    const maxScale = 4; // IKM uses 1–4 scale

    return (
        <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
            {/* Header */}
            <div className="mb-5 flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">
                    Rerata Skor Per Pertanyaan IKM
                </h3>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                        <span className="size-3 rounded bg-blue-500" />
                        Kepentingan
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="size-3 rounded bg-emerald-500" />
                        Kinerja
                    </span>
                    <span className="text-slate-400">skala 1–4</span>
                </div>
            </div>

            {/* Two charts stacked (top/bottom) */}
            <div className="flex flex-col gap-6">
                {/* Kepentingan */}
                <div>
                    <div className="mb-3 flex items-center gap-2">
                        <span className="size-2.5 rounded-full bg-blue-500" />
                        <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                            Kepentingan
                        </p>
                    </div>
                    <ScoreChart
                        scores={kepentinganScores}
                        maxScale={maxScale}
                        barColor="bg-blue-500"
                    />
                </div>

                {/* Kinerja */}
                <div>
                    <div className="mb-3 flex items-center gap-2">
                        <span className="size-2.5 rounded-full bg-emerald-500" />
                        <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                            Kinerja
                        </p>
                    </div>
                    <ScoreChart
                        scores={kinerjaScores}
                        maxScale={maxScale}
                        barColor="bg-emerald-500"
                    />
                </div>
            </div>

            {/* Scale reference */}
            <div className="mt-4 flex items-center justify-end gap-6 border-t border-slate-100 pt-3 text-[10px] text-slate-400">
                <span>1 = Tidak Penting / Tidak Baik</span>
                <span>2 = Kurang Penting / Kurang Baik</span>
                <span>3 = Penting / Baik</span>
                <span>4 = Sangat Penting / Sangat Baik</span>
            </div>
        </div>
    );
}
