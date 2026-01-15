import { Icon } from '@/Components/Company';
import { ReactNode } from 'react';

const mockSloiData = {
    totalResponses: 1842,
    targetResponses: 3000,
    progress: 61.4,
    sloiScore: 4.08,
    trustLevel: 'High Trust',
    questionComposition: [
        { id: 'Q1', scores: [5, 10, 20, 45, 20] },
        { id: 'Q2', scores: [2, 8, 15, 50, 25] },
        { id: 'Q3', scores: [8, 12, 25, 40, 15] },
        { id: 'Q4', scores: [3, 7, 18, 42, 30] },
    ],
    csrComparison: [
        { label: 'CSR Recipients', score: 4.42, progress: 88 },
        { label: 'General Community', score: 3.75, progress: 75 },
    ],
    ageRange: [
        { range: '18-25', height: 70 },
        { range: '26-40', height: 85 },
        { range: '41-60', height: 100 },
        { range: '60+', height: 78 },
    ],
    trendData: [
        { month: 'MAY', height: 35 },
        { month: 'JUN', height: 50 },
        { month: 'JUL', height: 60 },
        { month: 'AUG', height: 55 },
        { month: 'SEP', height: 75 },
        { month: 'OCT', height: 95 },
    ],
    auditLog: [
        {
            id: '#SLOI-2026-901',
            group: 'csr',
            date: 'Oct 26, 2026 • 10:45',
            score: 4.8,
            status: 'verified',
        },
        {
            id: '#SLOI-2026-902',
            group: 'general',
            date: 'Oct 26, 2026 • 09:12',
            score: 3.2,
            status: 'verified',
        },
        {
            id: '#SLOI-2026-903',
            group: 'csr',
            date: 'Oct 25, 2026 • 16:55',
            score: 4.2,
            status: 'pending',
        },
    ],
};

const scoreColors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-400',
    'bg-lime-400',
    'bg-green-500',
];

export default function ProjectSLOI(): ReactNode {
    const getScoreColor = (score: number) => {
        if (score >= 3.5) return 'text-green-600';
        if (score >= 2.5) return 'text-amber-600';
        return 'text-red-600';
    };

    const getScoreBarColor = (score: number) => {
        if (score >= 3.5) return 'bg-green-500';
        if (score >= 2.5) return 'bg-amber-500';
        return 'bg-red-500';
    };

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-3">
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                            Project SLOI Trust Dashboard
                        </h1>
                        <span className="inline-flex items-center rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white">
                            ACTIVE
                        </span>
                    </div>
                    <p className="text-sm text-slate-500">
                        Community trust analytics and Social License to Operate assessment for
                        Surabaya 2026.
                    </p>
                </div>

                <div className="flex flex-wrap gap-6">
                    <div className="text-center">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                            Total Responses
                        </p>
                        <p className="text-2xl font-bold text-slate-900">
                            {mockSloiData.totalResponses.toLocaleString()}
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                            Progress
                        </p>
                        <p className="text-2xl font-bold text-primary">
                            {mockSloiData.progress}%
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                            Target N-Size
                        </p>
                        <p className="text-2xl font-bold text-slate-900">
                            {mockSloiData.targetResponses.toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Score & Trend Row */}
            <div className="grid gap-6 lg:grid-cols-5">
                {/* SLOI Total Score Card */}
                <div className="lg:col-span-2">
                    <div className="flex h-full flex-col items-center justify-center rounded-xl border border-slate-100 bg-white p-8 shadow-sm">
                        <h3 className="mb-6 text-xs font-semibold uppercase tracking-wider text-slate-400">
                            SLOI Total Score
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
                                {mockSloiData.sloiScore}
                            </p>
                            <p className="mt-1 text-sm font-bold uppercase tracking-wider text-green-600">
                                {mockSloiData.trustLevel.toUpperCase()}
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

                {/* Trust Trend Over Time */}
                <div className="lg:col-span-3">
                    <div className="h-full rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                        <div className="mb-6 flex items-center justify-between">
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                Trust Trend Over Time
                            </h3>
                            <select className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
                                <option>Last 6 Months</option>
                                <option>Last 12 Months</option>
                            </select>
                        </div>

                        <div className="flex h-48 items-end justify-between gap-4 px-2">
                            {mockSloiData.trendData.map((item, i) => (
                                <div
                                    key={i}
                                    className="flex flex-1 flex-col items-center gap-2"
                                >
                                    <div
                                        className="w-full rounded-t-lg bg-primary transition-all hover:opacity-80"
                                        style={{
                                            height: `${item.height}%`,
                                            opacity: 0.3 + (i * 0.14),
                                        }}
                                    />
                                    <span className="text-[10px] font-semibold uppercase text-slate-400">
                                        {item.month}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Question Composition & Details Row */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Question Score Composition */}
                <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                    <h3 className="mb-6 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Question Score Composition (Q1 - Q12)
                    </h3>
                    <div className="space-y-4">
                        {mockSloiData.questionComposition.map((q) => (
                            <div key={q.id} className="flex items-center gap-3">
                                <span className="w-8 text-sm font-bold text-slate-700">
                                    {q.id}
                                </span>
                                <div className="flex h-6 flex-1 overflow-hidden rounded">
                                    {q.scores.map((score, i) => (
                                        <div
                                            key={i}
                                            className={`${scoreColors[i]}`}
                                            style={{ width: `${score}%` }}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 flex flex-wrap justify-center gap-4 text-[10px] font-medium">
                        {['SCORE 1', 'SCORE 2', 'SCORE 3', 'SCORE 4', 'SCORE 5'].map(
                            (label, i) => (
                                <span key={label} className="flex items-center gap-1.5">
                                    <div className={`size-2.5 rounded-sm ${scoreColors[i]}`} />
                                    <span className="text-slate-500">{label}</span>
                                </span>
                            )
                        )}
                    </div>
                </div>

                {/* CSR Impact & Age Range */}
                <div className="space-y-6">
                    {/* CSR Impact Comparison */}
                    <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                        <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                            CSR Impact Comparison
                        </h3>
                        <div className="space-y-4">
                            {mockSloiData.csrComparison.map((item) => (
                                <div key={item.label}>
                                    <div className="mb-2 flex justify-between text-sm">
                                        <span className="font-medium text-slate-700">
                                            {item.label}
                                        </span>
                                        <span className={`font-bold ${getScoreColor(item.score)}`}>
                                            {item.score}
                                        </span>
                                    </div>
                                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                                        <div
                                            className={`h-full rounded-full ${getScoreBarColor(item.score)}`}
                                            style={{ width: `${item.progress}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Trust by Age Range */}
                    <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                        <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Trust by Age Range
                        </h3>
                        <div className="flex h-28 items-end justify-between gap-4">
                            {mockSloiData.ageRange.map((item) => (
                                <div
                                    key={item.range}
                                    className="flex flex-1 flex-col items-center gap-2"
                                >
                                    <div
                                        className="w-full rounded-t bg-primary"
                                        style={{
                                            height: `${item.height}%`,
                                            opacity: 0.4 + (item.height / 250),
                                        }}
                                    />
                                    <span className="text-[10px] font-semibold text-slate-400">
                                        {item.range}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Trust Data Submission Audit */}
            <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 p-6">
                    <div className="flex items-center gap-3">
                        <Icon name="history" className="text-slate-400" />
                        <h3 className="text-base font-bold text-slate-900">
                            Trust Data Submission Audit
                        </h3>
                    </div>
                    <div className="flex gap-2">
                        <button className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
                            Filter
                        </button>
                        <button className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
                            Export CSV
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/50">
                                <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                    Respondent ID
                                </th>
                                <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                    Group
                                </th>
                                <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                    Submission Date
                                </th>
                                <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                    SLOI Score
                                </th>
                                <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                    Validation
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {mockSloiData.auditLog.map((log) => (
                                <tr
                                    key={log.id}
                                    className="transition-colors hover:bg-slate-50"
                                >
                                    <td className="px-6 py-4 font-mono text-sm text-slate-900">
                                        {log.id}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase ${log.group === 'csr'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-slate-100 text-slate-600'
                                                }`}
                                        >
                                            {log.group === 'csr' ? 'CSR Recipient' : 'General'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        {log.date}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <span
                                                className={`text-sm font-bold ${getScoreColor(log.score)}`}
                                            >
                                                {log.score}
                                            </span>
                                            <div className="h-2 w-16 overflow-hidden rounded-full bg-slate-100">
                                                <div
                                                    className={`h-full rounded-full ${getScoreBarColor(log.score)}`}
                                                    style={{
                                                        width: `${(log.score / 5) * 100}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex items-center gap-1.5 text-xs font-semibold ${log.status === 'verified'
                                                    ? 'text-green-600'
                                                    : 'text-amber-600'
                                                }`}
                                        >
                                            <Icon
                                                name={
                                                    log.status === 'verified'
                                                        ? 'check_circle'
                                                        : 'pending'
                                                }
                                                className="text-sm"
                                            />
                                            {log.status === 'verified' ? 'Verified' : 'Pending'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="border-t border-slate-100 bg-slate-50 p-4 text-center">
                    <button className="text-sm font-semibold text-primary hover:underline">
                        View All {mockSloiData.totalResponses.toLocaleString()} Submissions
                    </button>
                </div>
            </div>
        </div>
    );
}
