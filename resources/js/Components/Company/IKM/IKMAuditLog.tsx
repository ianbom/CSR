import { Icon } from '@/Components/Company';
import { ReactNode } from 'react';

interface AuditLogItem {
    time: string;
    enumerator: string;
    enumeratorId: string;
    respondent: string;
    avgScore: number;
    status: string;
    photoUrl: string;
    location: { lat: number; lng: number };
}

interface IKMAuditLogProps {
    auditLog: AuditLogItem[];
    onLoadMore?: () => void;
}

const statusStyles: Record<string, string> = {
    verified: 'bg-green-50 text-green-600',
    pending: 'bg-amber-50 text-amber-600',
};

const statusLabels: Record<string, string> = {
    verified: 'TERVERIFIKASI',
    pending: 'TERTUNDA',
};

export default function IKMAuditLog({
    auditLog,
    onLoadMore,
}: IKMAuditLogProps): ReactNode {
    return (
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
                                            className={`rounded px-2 py-1 text-sm font-black ${
                                                log.avgScore >= 4
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
                                        className={`inline-flex items-center rounded px-2 py-1 text-[10px] font-bold ${statusStyles[log.status]}`}
                                    >
                                        {statusLabels[log.status]}
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
                <button
                    onClick={onLoadMore}
                    className="text-xs font-bold text-slate-500 transition-colors hover:text-primary"
                >
                    Muat Lebih Banyak
                </button>
            </div>
        </div>
    );
}
