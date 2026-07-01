import { router } from '@inertiajs/react';
import { ReactNode } from 'react';
import type {
    RespondentFilters,
    SROIRespondentsData,
} from './SROIRespondentTable';
import SROIRespondentTable from './SROIRespondentTable';

interface Props {
    respondents: SROIRespondentsData;
    projectId: number;
    filters: RespondentFilters;
}

export default function ProjectSROIRespondent({
    respondents,
    projectId,
    filters,
}: Props): ReactNode {
    const handleNavigate = (params: Record<string, string | number>) => {
        router.get(
            route('projects.show', { id: projectId }),
            { detailType: 'sroi_respondent', ...params },
            { preserveState: true, preserveScroll: true },
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">
                        Data Responden SROI
                    </h2>
                    <p className="text-sm text-slate-500">
                        Total {respondents.pagination.total} responden
                    </p>
                </div>
            </div>

            <SROIRespondentTable
                respondents={respondents}
                projectId={projectId}
                filters={filters}
                onNavigate={handleNavigate}
            />
        </div>
    );
}
