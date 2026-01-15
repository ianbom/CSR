import { ReactNode } from 'react';

interface ScoreTrendItem {
    date: string;
    height: number;
    score: number;
    isHighlight?: boolean;
}

interface IKMScoreTrendProps {
    scoreTrend: ScoreTrendItem[];
}

export default function IKMScoreTrend({
    scoreTrend,
}: IKMScoreTrendProps): ReactNode {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">
                    Tren Skor IKM
                </h3>
                <select className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200">
                    <option>30 Hari Terakhir</option>
                    <option>7 Hari Terakhir</option>
                </select>
            </div>
            <div className="relative flex h-48 items-end gap-3 px-2">
                {/* Background Wave SVG */}
                <svg
                    className="absolute inset-0 h-full w-full"
                    preserveAspectRatio="none"
                    viewBox="0 0 100 100"
                >
                    <defs>
                        <linearGradient
                            id="waveGradient"
                            x1="0%"
                            y1="0%"
                            x2="0%"
                            y2="100%"
                        >
                            <stop
                                offset="0%"
                                stopColor="#22c55e"
                                stopOpacity="0.2"
                            />
                            <stop
                                offset="100%"
                                stopColor="#22c55e"
                                stopOpacity="0.02"
                            />
                        </linearGradient>
                    </defs>
                    <path
                        d="M0 100 L0 75 C 15 55, 25 40, 35 50 C 45 60, 55 35, 65 25 C 75 15, 85 20, 100 30 L 100 100 Z"
                        fill="url(#waveGradient)"
                    />
                    <path
                        d="M0 75 C 15 55, 25 40, 35 50 C 45 60, 55 35, 65 25 C 75 15, 85 20, 100 30"
                        fill="none"
                        stroke="#22c55e"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                </svg>
                {/* Bars */}
                {scoreTrend.map((bar, i) => (
                    <div
                        key={i}
                        className="group relative z-10 flex flex-1 flex-col items-center"
                    >
                        {bar.isHighlight && (
                            <div className="absolute -top-6 rounded bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-white shadow-lg">
                                {bar.score}
                            </div>
                        )}
                        <div
                            className={`w-full rounded-t-md transition-all duration-200 ${
                                bar.isHighlight
                                    ? 'bg-green-500 shadow-md'
                                    : 'bg-green-100 hover:bg-green-200'
                            }`}
                            style={{ height: `${bar.height}%` }}
                        />
                    </div>
                ))}
            </div>
            <div className="mt-4 flex justify-between px-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                <span>{scoreTrend[0]?.date}</span>
                <span>
                    {scoreTrend[Math.floor(scoreTrend.length / 2)]?.date}
                </span>
                <span>{scoreTrend[scoreTrend.length - 1]?.date}</span>
            </div>
        </div>
    );
}
