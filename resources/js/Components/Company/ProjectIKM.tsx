import { Icon } from '@/Components/Company';
import { ikmData } from '@/data';
import { ReactNode } from 'react';

// Menggunakan data dari JSON
const stats = ikmData.stats;
const answerDistribution = ikmData.answerDistribution;
const scoreTrend = ikmData.scoreTrend;
const questionScores = ikmData.questionScores;
const autoInsights = ikmData.autoInsights;
const auditLog = ikmData.auditLog;

export default function ProjectIKM(): ReactNode {
    const statusStyles = {
        verified: 'bg-green-50 text-green-600',
        pending: 'bg-amber-50 text-amber-600',
    };

    const statusLabels = {
        verified: 'VERIFIED',
        pending: 'PENDING',
    };

    return (
        <div className="space-y-6">
            {/* Stats Cards Row */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Total Responses */}
                <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Total Respons
                    </p>
                    <div className="flex items-end justify-between">
                        <h3 className="text-2xl font-black">
                            {stats.totalResponses.toLocaleString()}
                        </h3>
                        <span className="flex items-center text-[10px] font-bold text-primary">
                            {stats.weeklyTrend} vs minggu lalu
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
                                strokeDasharray={`${stats.targetProgress}, 100`}
                                strokeWidth="3"
                            />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black">
                            {stats.targetProgress}%
                        </span>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Progress Target
                        </p>
                        <p className="text-sm font-bold text-slate-800">
                            {stats.totalResponses.toLocaleString()} /{' '}
                            {stats.targetResponses.toLocaleString()}
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
                            {stats.ikmScore}
                        </h3>
                        <span className="text-sm font-bold text-slate-500">
                            / {stats.ikmScoreMax} ({stats.targetProgress}%)
                        </span>
                    </div>
                </div>

                {/* Last Submission Time */}
                <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Waktu Pengiriman Terakhir
                    </p>
                    <div className="flex items-center gap-2">
                        <Icon
                            name="schedule"
                            className="text-sm text-slate-400"
                        />
                        <h3 className="text-sm font-bold">
                            {stats.lastSubmissionTime}
                        </h3>
                    </div>
                    <p className="mt-1 text-[10px] text-slate-500">
                        Enumerator: {stats.lastEnumerator}
                    </p>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* IKM Score Trend */}
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
                                    className={`w-full rounded-t-md transition-all duration-200 ${bar.isHighlight
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

                {/* Answer Distribution */}
                <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                    <h3 className="mb-6 text-base font-bold">
                        Distribusi Jawaban (1-5)
                    </h3>
                    <div className="space-y-6">
                        {answerDistribution.map((item) => (
                            <div
                                key={item.score}
                                className="flex items-center gap-3"
                            >
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
            </div>

            {/* Question Scores + Auto-Insight */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm lg:col-span-2">
                    <h3 className="mb-8 text-base font-bold">
                        Skor Rata-rata per Pertanyaan
                    </h3>
                    <div className="space-y-8">
                        {questionScores
                            .filter((q) => q.isTop || q.isBottom)
                            .map((q) => (
                                <div
                                    key={q.id}
                                    className="flex items-center gap-4"
                                >
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
                                                className={`h-full rounded-full ${q.score >= 4
                                                        ? 'bg-green-500'
                                                        : 'bg-red-500'
                                                    }`}
                                                style={{
                                                    width: `${(q.score / 5) * 100}%`,
                                                }}
                                            />
                                        </div>
                                        <span
                                            className={`w-6 text-right text-xs font-bold ${q.score >= 4
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

                <div className="flex h-full flex-col rounded-xl border border-green-500/10 bg-green-500/5 p-6">
                    <div className="mb-4 flex items-center gap-2 text-green-600">
                        <Icon name="auto_awesome" />
                        <h3 className="text-base font-bold">Auto-Insight</h3>
                    </div>
                    <div className="flex-1 space-y-4">
                        <div className="rounded-lg border border-green-500/10 bg-white p-4 shadow-sm">
                            <p className="mb-1 text-xs font-bold text-green-600">
                                {autoInsights.positiveTrend.title}
                            </p>
                            <p className="text-xs leading-relaxed text-slate-600">
                                {autoInsights.positiveTrend.description}
                            </p>
                        </div>
                        <div className="rounded-lg border border-red-100 bg-white p-4 shadow-sm">
                            <p className="mb-1 text-xs font-bold text-red-500">
                                {autoInsights.criticalAttention.title}
                            </p>
                            <p className="text-xs leading-relaxed text-slate-600">
                                {autoInsights.criticalAttention.description}
                            </p>
                        </div>
                    </div>
                    <button className="mt-6 flex items-center gap-1 text-xs font-bold text-green-600 hover:underline">
                        Buat Laporan Detail
                        <Icon name="arrow_right_alt" className="text-sm" />
                    </button>
                </div>
            </div>

            {/* Audit Log Table */}
            <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 p-6">
                    <div className="flex items-center gap-3">
                        <Icon name="inventory" className="text-slate-400" />
                        <h3 className="text-lg font-bold">Log Audit Survei</h3>
                    </div>
                    <div className="flex gap-2">
                        <input
                            className="rounded-lg border-slate-200 px-3 py-1.5 text-xs focus:ring-primary"
                            placeholder="Cari responden..."
                            type="text"
                        />
                        <button className="rounded-lg bg-primary/10 px-4 py-1.5 text-sm font-bold text-primary hover:bg-primary/20">
                            Filter
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                    Waktu
                                </th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                    Enumerator
                                </th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                    Nama Responden
                                </th>
                                <th className="px-6 py-4 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                    Skor Rata-rata
                                </th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                    Verifikasi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {auditLog.map((log, i) => (
                                <tr
                                    key={i}
                                    className="transition-colors hover:bg-slate-50"
                                >
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        {log.time}
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-bold">
                                            {log.enumerator}
                                        </p>
                                        <p className="text-[10px] text-slate-400">
                                            ID: {log.enumeratorId}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium">
                                        {log.respondent}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center">
                                            <span
                                                className={`rounded px-2 py-1 text-sm font-black ${log.avgScore >= 4
                                                        ? 'bg-green-50 text-green-600'
                                                        : 'bg-yellow-50 text-yellow-600'
                                                    }`}
                                            >
                                                {log.avgScore}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex items-center rounded px-2 py-1 text-[10px] font-bold ${statusStyles[
                                                log.status as keyof typeof statusStyles
                                                ]
                                                }`}
                                        >
                                            {
                                                statusLabels[
                                                log.status as keyof typeof statusLabels
                                                ]
                                            }
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-4">
                                            <a
                                                className="flex items-center gap-1 text-[10px] font-bold text-primary hover:underline"
                                                href="#"
                                            >
                                                <Icon
                                                    name="photo"
                                                    className="text-sm"
                                                />{' '}
                                                Foto
                                            </a>
                                            <a
                                                className="flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:underline"
                                                href="#"
                                            >
                                                <Icon
                                                    name="location_on"
                                                    className="text-sm"
                                                />{' '}
                                                Maps
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="border-t border-slate-100 bg-slate-50 p-4 text-center">
                    <button className="text-xs font-bold text-slate-500 transition-colors hover:text-primary">
                        Muat Lebih Banyak
                    </button>
                </div>
            </div>
        </div>
    );
}
