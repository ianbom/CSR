import { ReactNode } from 'react';
import Icon from './Icon';

export interface Submission {
    id: string;
    dateTime: string;
    respondentType: string;
    impactScore: number;
    status: 'verified' | 'pending' | 'rejected';
}

interface SubmissionTableProps {
    submissions: Submission[];
    onViewAll?: () => void;
}

export default function SubmissionTable({
    submissions,
    onViewAll,
}: SubmissionTableProps): ReactNode {
    const statusStyles = {
        verified: 'bg-green-50 text-green-600',
        pending: 'bg-amber-50 text-amber-600',
        rejected: 'bg-red-50 text-red-600',
    };

    const statusLabels = {
        verified: 'TERVERIFIKASI',
        pending: 'TERTUNDA',
        rejected: 'DITOLAK',
    };

    return (
        <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 p-6">
                <div className="flex items-center gap-3">
                    <Icon name="history" className="text-slate-400" />
                    <h3 className="text-lg font-bold">
                        Pengiriman Data Terbaru
                    </h3>
                </div>
                {onViewAll && (
                    <button
                        onClick={onViewAll}
                        className="text-sm font-bold text-primary hover:underline"
                    >
                        Lihat Semua
                    </button>
                )}
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50/50">
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                ID Responden
                            </th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                Tanggal &amp; Waktu
                            </th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                Tipe Responden
                            </th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                Skor Dampak
                            </th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {submissions.map((submission) => (
                            <tr
                                key={submission.id}
                                className="transition-colors hover:bg-slate-50"
                            >
                                <td className="px-6 py-4 font-mono text-sm">
                                    {submission.id}
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">
                                    {submission.dateTime}
                                </td>
                                <td className="px-6 py-4 text-sm font-medium">
                                    {submission.respondentType}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="h-1.5 w-12 overflow-hidden rounded-full bg-slate-100">
                                            <div
                                                className="h-full rounded-full bg-primary"
                                                style={{
                                                    width: `${submission.impactScore * 10}%`,
                                                }}
                                            />
                                        </div>
                                        <span className="text-xs font-bold text-primary">
                                            {submission.impactScore}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`inline-flex items-center rounded px-2 py-1 text-[10px] font-bold ${statusStyles[submission.status]}`}
                                    >
                                        {statusLabels[submission.status]}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
