import { Icon } from '@/Components/Company';
import { ReactNode } from 'react';

interface AuditLogItem {
    id: string;
    group: string;
    date: string;
    score: number;
    status: string;
}

interface SLOIAuditLogProps {
    auditLog: AuditLogItem[];
    totalResponses: number;
    onViewAll?: () => void;
}

export default function SLOIAuditLog({
    auditLog,
    totalResponses,
    onViewAll,
}: SLOIAuditLogProps): ReactNode {
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
        <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 p-6">
                <div className="flex items-center gap-3">
                    <Icon name="history" className="text-slate-400" />
                    <h3 className="text-base font-bold text-slate-900">
                        Audit Pengiriman Data Kepercayaan
                    </h3>
                </div>
                <div className="flex gap-2">
                    <button className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
                        Filter
                    </button>
                    <button className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
                        Ekspor CSV
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/50">
                            <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                ID Responden
                            </th>
                            <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                Grup
                            </th>
                            <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                Tanggal Pengiriman
                            </th>
                            <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                Skor SLOI
                            </th>
                            <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                Validasi
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {auditLog.map((log) => (
                            <tr
                                key={log.id}
                                className="transition-colors hover:bg-slate-50"
                            >
                                <td className="px-6 py-4 font-mono text-sm text-slate-900">
                                    {log.id}
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase ${
                                            log.group === 'csr'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-slate-100 text-slate-600'
                                        }`}
                                    >
                                        {log.group === 'csr'
                                            ? 'Penerima CSR'
                                            : 'Umum'}
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
                                        className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                                            log.status === 'verified'
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
                                        {log.status === 'verified'
                                            ? 'Terverifikasi'
                                            : 'Tertunda'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="border-t border-slate-100 bg-slate-50 p-4 text-center">
                <button
                    onClick={onViewAll}
                    className="text-sm font-semibold text-primary hover:underline"
                >
                    Lihat Semua {totalResponses.toLocaleString()} Pengiriman
                </button>
            </div>
        </div>
    );
}
