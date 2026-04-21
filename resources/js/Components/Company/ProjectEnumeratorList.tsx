import { router } from '@inertiajs/react';
import { ReactNode, useEffect, useState } from 'react';
import AssignEnumeratorModal from './AssignEnumeratorModal';

// ─── Types ─────────────────────────────────────────────────

interface EnumeratorItem {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    isActive: boolean;
    totalSubmissions: number;
    ikmSubmissions: number;
    sloiSubmissions: number;
    lastSubmittedAt: string | null;
}

interface AllEnumeratorItem {
    id: number;
    name: string;
    email: string;
    phone?: string;
}

interface ProjectInfo {
    id: number;
    name: string;
    code: string;
}

interface Props {
    enumeratorList: EnumeratorItem[];
    project: ProjectInfo;
    canEdit?: boolean;
}

export default function ProjectEnumeratorList({
    enumeratorList,
    project,
    canEdit = true,
}: Props): ReactNode {
    const [showAssign, setShowAssign] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [allEnumerators, setAllEnumerators] = useState<AllEnumeratorItem[]>(
        [],
    );
    const [isFetching, setIsFetching] = useState(false);

    // Fetch all company enumerators from API when modal opens
    useEffect(() => {
        if (!showAssign) return;
        setIsFetching(true);
        fetch(route('api.projects.enumerators', { id: project.id }))
            .then((res) => res.json())
            .then((data: AllEnumeratorItem[]) => setAllEnumerators(data))
            .catch(() => setAllEnumerators([]))
            .finally(() => setIsFetching(false));
    }, [showAssign, project.id]);

    const assignedIds = enumeratorList.map((e) => e.id);

    const handleAssign = (
        projectId: number | string,
        enumeratorIds: number[],
    ) => {
        setIsLoading(true);
        router.post(
            route('projects.assign-enumerators', { id: projectId }),
            { enumerator_ids: enumeratorIds },
            {
                preserveScroll: true,
                onFinish: () => {
                    setIsLoading(false);
                    setShowAssign(false);
                },
            },
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">
                        Daftar Enumerator
                    </h2>
                    <p className="text-sm text-slate-500">
                        Total {enumeratorList.length} enumerator ditugaskan
                    </p>
                </div>
                {canEdit && (
                    <button
                        onClick={() => setShowAssign(true)}
                        className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
                    >
                        <span className="material-symbols-outlined text-base leading-none">
                            person_add
                        </span>
                        Assign Enumerator
                    </button>
                )}
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/80">
                                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                    No
                                </th>
                                <th className="min-w-[180px] px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                    Nama
                                </th>
                                <th className="min-w-[200px] px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                    Email
                                </th>
                                <th className="min-w-[130px] px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                    Telepon
                                </th>
                                <th className="min-w-[80px] px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                    Status
                                </th>
                                <th className="min-w-[100px] px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                    Survey IKM
                                </th>
                                <th className="min-w-[100px] px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                    Survey SLOI
                                </th>
                                <th className="min-w-[130px] px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                    Terakhir Kirim
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {enumeratorList.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="px-4 py-12 text-center text-sm text-slate-400"
                                    >
                                        Belum ada enumerator ditugaskan
                                    </td>
                                </tr>
                            )}
                            {enumeratorList.map((e, idx) => (
                                <tr key={e.id}>
                                    <td className="px-4 py-3 font-medium text-slate-500">
                                        {idx + 1}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="font-medium text-slate-900">
                                            {e.name}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-slate-600">
                                        {e.email}
                                    </td>
                                    <td className="px-4 py-3 text-slate-600">
                                        {e.phone ?? '-'}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span
                                            className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                                                e.isActive
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                            }`}
                                        >
                                            {e.isActive ? 'Aktif' : 'Nonaktif'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center font-bold text-slate-700">
                                        <span className="inline-flex min-w-10 justify-center rounded-full px-2.5 py-1 text-xs font-bold">
                                            {e.ikmSubmissions}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center font-bold text-slate-700">
                                        <span className="inline-flex min-w-10 justify-center rounded-full px-2.5 py-1 text-xs font-bold">
                                            {e.sloiSubmissions}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-slate-500">
                                        {e.lastSubmittedAt ?? '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Assign Enumerator Modal */}
            {canEdit && (
                <AssignEnumeratorModal
                    isOpen={showAssign}
                    onClose={() => setShowAssign(false)}
                    project={project}
                    enumerators={allEnumerators}
                    assignedEnumeratorIds={assignedIds}
                    onSubmit={handleAssign}
                    isLoading={isFetching || isLoading}
                />
            )}
        </div>
    );
}
