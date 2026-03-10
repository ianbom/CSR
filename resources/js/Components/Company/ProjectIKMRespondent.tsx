import { ReactNode } from 'react';
import IKMRespondentTable from './IKMRespondentTable';
import type { IKMRespondentsData, RespondentFilters } from './IKMRespondentTable';
import { Download } from 'lucide-react';
import { router } from '@inertiajs/react';

interface Props {
    respondents: IKMRespondentsData;
    projectId: number;
    filters: RespondentFilters;
}

export default function ProjectIKMRespondent({
    respondents,
    projectId,
    filters,
}: Props): ReactNode {
    const handleNavigate = (params: Record<string, string | number>) => {
        router.get(
            route('projects.show', { id: projectId }),
            { detailType: 'ikm_respondent', ...params },
            { preserveState: true, preserveScroll: true },
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">
                        Data Responden IKM
                    </h2>
                    <p className="text-sm text-slate-500">
                        Total {respondents.pagination.total} responden
                    </p>
                    <div className="mt-1 flex items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                            <span className="size-2.5 rounded-full bg-blue-500" />
                            Kepentingan
                        </span>
                        <span>/</span>
                        <span className="flex items-center gap-1">
                            <span className="size-2.5 rounded-full bg-emerald-500" />
                            Kinerja
                        </span>
                    </div>
                </div>
                <a
                    href={route('projects.export-respondents', { id: projectId }) + '?type=IKM'}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
                >
                    <Download className="size-4" />
                    Export Excel
                </a>
            </div>

            <IKMRespondentTable
                respondents={respondents}
                filters={filters}
                onNavigate={handleNavigate}
            />
        </div>
    );
}
