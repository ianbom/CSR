import { MetricCard } from '@/Components/Company';
import { ReactNode } from 'react';

// ─── Types ─────────────────────────────────────────────────

interface ProjectData {
    enableIkm: boolean;
    enableSloi: boolean;
    enableSroi: boolean;
}

interface StatsData {
    totalResponses: number;
    targetResponses: number;
    progress: number;
    score: number;
    scoreLabel: string;
}

interface AuditLogItem {
    id: string;
    respondentName: string;
    enumerator: string;
    date: string;
    score: number;
    status: string;
    group: string;
}

interface ProjectOverviewProps {
    project: ProjectData;
    stats: StatsData;
    auditLog: AuditLogItem[];
}

export default function ProjectOverview({
    project,
    stats,
    auditLog,
}: ProjectOverviewProps): ReactNode {
    return (
        <>
            {/* Metric Cards */}
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* IKM Card */}
                {project.enableIkm && (
                    <MetricCard
                        icon="sentiment_satisfied"
                        iconBgColor="bg-blue-50"
                        iconColor="text-blue-600"
                        label="IKM Score"
                        value={stats.score}
                        unit="/ 5.0"
                        badge={{
                            text: stats.scoreLabel,
                            type: stats.score >= 4 ? 'positive' : 'stable',
                        }}
                        footer={
                            <p className="text-xs text-slate-500">
                                Kualitas layanan dinilai{' '}
                                <span className="font-bold text-blue-600">
                                    {stats.scoreLabel}
                                </span>
                            </p>
                        }
                    />
                )}

                {/* SLOI Card */}
                {project.enableSloi && (
                    <MetricCard
                        icon="handshake"
                        iconBgColor="bg-amber-50"
                        iconColor="text-amber-600"
                        label="SLOI Level"
                        value={stats.scoreLabel}
                        badge={{ text: 'STABIL', type: 'stable' }}
                        footer={
                            <div className="flex gap-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <div
                                        key={i}
                                        className={`h-1.5 flex-1 rounded-full ${
                                            i <= Math.ceil(stats.score)
                                                ? 'bg-primary'
                                                : 'bg-slate-200'
                                        }`}
                                    />
                                ))}
                            </div>
                        }
                    />
                )}

                {/* SROI Card */}
                {project.enableSroi && (
                    <MetricCard
                        icon="payments"
                        iconBgColor="bg-primary/10"
                        iconColor="text-primary"
                        label="SROI Ratio"
                        value="-"
                        footer={
                            <p className="text-xs text-slate-500">
                                Data SROI belum tersedia
                            </p>
                        }
                    />
                )}
            </div>

            {/* Recent Submissions */}
            <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
                <div className="border-b border-slate-100 p-6">
                    <h3 className="text-base font-bold text-slate-900">
                        Pengiriman Terbaru
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/50">
                                <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                    ID
                                </th>
                                <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                    Responden
                                </th>
                                <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                    Enumerator
                                </th>
                                <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                    Tanggal
                                </th>
                                <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                    Skor
                                </th>
                                <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {auditLog.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-6 py-8 text-center text-sm text-slate-400"
                                    >
                                        Belum ada pengiriman data
                                    </td>
                                </tr>
                            )}
                            {auditLog.map((log) => (
                                <tr
                                    key={log.id}
                                    className="transition-colors hover:bg-slate-50"
                                >
                                    <td className="px-6 py-4 font-mono text-sm text-slate-900">
                                        {log.id}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-slate-700">
                                        {log.respondentName}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        {log.enumerator}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        {log.date}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`text-sm font-bold ${
                                                log.score >= 4
                                                    ? 'text-green-600'
                                                    : log.score >= 3
                                                      ? 'text-amber-600'
                                                      : 'text-red-600'
                                            }`}
                                        >
                                            {log.score}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase ${
                                                log.status === 'approved'
                                                    ? 'bg-green-100 text-green-700'
                                                    : log.status === 'submitted'
                                                      ? 'bg-amber-100 text-amber-700'
                                                      : 'bg-red-100 text-red-700'
                                            }`}
                                        >
                                            {log.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
