import { Icon } from '@/Components/Company';
import { ReactNode } from 'react';

interface IKMStatsCardsProps {
    totalResponses: number;
    targetResponses: number;
    targetProgress: number;
    ikmScore: number;
    ikmScoreMax: number;
    lastSubmissionTime: string;
    lastEnumerator: string;
    weeklyTrend: string;
}

export default function IKMStatsCards({
    totalResponses,
    targetResponses,
    targetProgress,
    ikmScore,
    ikmScoreMax,
    lastSubmissionTime,
    lastEnumerator,
    weeklyTrend,
}: IKMStatsCardsProps): ReactNode {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Total Responses */}
            <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Total Respons
                </p>
                <div className="flex items-end justify-between">
                    <h3 className="text-2xl font-black">
                        {totalResponses.toLocaleString()}
                    </h3>
                    <span className="flex items-center text-[10px] font-bold text-primary">
                        {weeklyTrend} vs minggu lalu
                    </span>
                </div>
            </div>

            {/* Target Progress */}
            <div className="flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                <div className="relative size-12 shrink-0">
                    <svg className="size-full" viewBox="0 0 36 36">
                        <path
                            className="text-slate-200"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeDasharray="100, 100"
                            strokeWidth="3"
                        />
                        <path
                            className="text-primary"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeDasharray={`${targetProgress}, 100`}
                            strokeWidth="3"
                        />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black">
                        {targetProgress}%
                    </span>
                </div>
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Progress Target
                    </p>
                    <p className="text-sm font-bold text-slate-800">
                        {totalResponses.toLocaleString()} /{' '}
                        {targetResponses.toLocaleString()}
                    </p>
                </div>
            </div>

            {/* Total IKM Score */}
            <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Total Skor IKM
                </p>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-black text-primary">
                        {ikmScore}
                    </h3>
                    <span className="text-sm font-bold text-slate-500">
                        / {ikmScoreMax} ({targetProgress}%)
                    </span>
                </div>
            </div>

            {/* Last Submission Time */}
            <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Waktu Pengiriman Terakhir
                </p>
                <div className="flex items-center gap-2">
                    <Icon name="schedule" className="text-sm text-slate-400" />
                    <h3 className="text-sm font-bold">{lastSubmissionTime}</h3>
                </div>
                <p className="mt-1 text-[10px] text-slate-500">
                    Enumerator: {lastEnumerator}
                </p>
            </div>
        </div>
    );
}
