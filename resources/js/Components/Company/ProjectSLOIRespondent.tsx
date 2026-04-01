import { router } from '@inertiajs/react';
import { Download } from 'lucide-react';
import { ReactNode } from 'react';
import type {
    RespondentFilters,
    SLOIRespondentsData,
} from './SLOIRespondentTable';
import SLOIRespondentTable from './SLOIRespondentTable';

interface Props {
    respondents: SLOIRespondentsData;
    projectId: number;
    filters: RespondentFilters;
}

export default function ProjectSLOIRespondent({
    respondents,
    projectId,
    filters,
}: Props): ReactNode {
    const handleNavigate = (params: Record<string, string | number>) => {
        router.get(
            route('projects.show', { id: projectId }),
            { detailType: 'sloi_respondent', ...params },
            { preserveState: true, preserveScroll: true },
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">
                        Data Responden SLOI
                    </h2>
                    <p className="text-sm text-slate-500">
                        Total {respondents.pagination.total} responden
                    </p>
                </div>
                <a
                    href={
                        route('projects.export-respondents', {
                            id: projectId,
                        }) + '?type=SLOI'
                    }
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
                >
                    <Download className="size-4" />
                    Export Excel
                </a>
            </div>

            <SLOIRespondentTable
                respondents={respondents}
                filters={filters}
                onNavigate={handleNavigate}
            />
        </div>
    );
}
