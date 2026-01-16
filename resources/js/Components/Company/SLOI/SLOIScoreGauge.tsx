import { ReactNode } from 'react';

interface SLOIScoreGaugeProps {
    sloiScore: number;
    trustLevel: string;
}

export default function SLOIScoreGauge({
    sloiScore,
    trustLevel,
}: SLOIScoreGaugeProps): ReactNode {
    return (
        <div className="lg:col-span-2">
            <div className="flex h-full flex-col items-center justify-center rounded-xl border border-slate-100 bg-white p-8 shadow-sm">
                <h3 className="mb-6 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Total Skor SLOI
                </h3>

                {/* Gauge Chart */}
                <div className="relative mb-4 h-28 w-56">
                    <svg viewBox="0 0 200 100" className="h-full w-full">
                        <defs>
                            <linearGradient
                                id="gaugeGradient"
                                x1="0%"
                                y1="0%"
                                x2="100%"
                                y2="0%"
                            >
                                <stop offset="0%" stopColor="#dc2626" />
                                <stop offset="50%" stopColor="#eab308" />
                                <stop offset="100%" stopColor="#22c55e" />
                            </linearGradient>
                        </defs>
                        {/* Background arc */}
                        <path
                            d="M 20 90 A 80 80 0 0 1 180 90"
                            fill="none"
                            stroke="#e2e8f0"
                            strokeWidth="14"
                            strokeLinecap="round"
                        />
                        {/* Colored arc */}
                        <path
                            d="M 20 90 A 80 80 0 0 1 180 90"
                            fill="none"
                            stroke="url(#gaugeGradient)"
                            strokeWidth="14"
                            strokeLinecap="round"
                            opacity="0.3"
                        />
                        {/* Needle */}
                        <line
                            x1="100"
                            y1="90"
                            x2="100"
                            y2="25"
                            stroke="#1e293b"
                            strokeWidth="3"
                            strokeLinecap="round"
                            transform="rotate(55, 100, 90)"
                        />
                        {/* Center dot */}
                        <circle cx="100" cy="90" r="6" fill="#1e293b" />
                    </svg>
                </div>

                <div className="text-center">
                    <p className="text-5xl font-bold text-green-600">
                        {sloiScore}
                    </p>
                    <p className="mt-1 text-sm font-bold uppercase tracking-wider text-green-600">
                        {trustLevel.toUpperCase()}
                    </p>
                </div>

                <div className="mt-6 flex flex-wrap justify-center gap-4 text-[10px] font-medium">
                    <div className="flex items-center gap-1.5">
                        <div className="size-2.5 rounded-full bg-red-500" />
                        <span className="text-slate-500">1-2.5</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="size-2.5 rounded-full bg-amber-500" />
                        <span className="text-slate-500">2.5-3.5</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="size-2.5 rounded-full bg-green-500" />
                        <span className="text-slate-500">3.5-5.0</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
