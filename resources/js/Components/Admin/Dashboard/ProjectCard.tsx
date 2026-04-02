import { Activity, CheckCircle2, Clock, FileText } from 'lucide-react';
import type { Project } from './types';

interface ProjectCardProps {
    project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
    const statusConfig = {
        draft: {
            color: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
            icon: FileText,
        },
        active: {
            color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
            icon: Activity,
        },
        closed: {
            color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
            icon: CheckCircle2,
        },
        archived: {
            color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
            icon: Clock,
        },
    };

    const config = statusConfig[project.status];
    const StatusIcon = config.icon;
    const totalTarget = project.target_ikm_count + project.target_sloi_count;
    const progress =
        totalTarget > 0
            ? Math.min((project.submissions_count / totalTarget) * 100, 100)
            : 0;

    return (
        <div className="group rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-primary/30 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-slate-900 dark:text-white">
                        {project.name}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        {project.company.name}
                    </p>
                </div>
                <span
                    className={'flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ' + config.color}
                >
                    <StatusIcon className="h-3 w-3" />
                    {project.status}
                </span>
            </div>

            <div className="mt-4">
                <div className="mb-1.5 flex justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">
                        Progress
                    </span>
                    <span className="font-medium text-slate-700 dark:text-slate-200">
                        {project.submissions_count}/{totalTarget}
                    </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-400 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
                <code className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                    {project.project_code}
                </code>
            </div>
        </div>
    );
}
