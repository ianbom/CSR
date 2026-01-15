import { Link } from '@inertiajs/react';
import { ReactNode } from 'react';
import Icon from './Icon';
import ProgressBar from './ProgressBar';
import StatusBadge from './StatusBadge';

export interface Project {
    id: string;
    code: string;
    name: string;
    type: 'IKM' | 'SLOI' | 'SROI';
    typeLabel: string;
    location: string;
    status: 'active' | 'draft' | 'closed';
    currentResponses: number;
    targetResponses: number;
}

interface ProjectTableProps {
    projects: Project[];
    onEdit?: (project: Project) => void;
    onDelete?: (project: Project) => void;
}

const typeColors = {
    IKM: 'text-primary',
    SLOI: 'text-primary',
    SROI: 'text-primary',
};

export default function ProjectTable({
    projects,
    onEdit,
    onDelete,
}: ProjectTableProps): ReactNode {
    return (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 border-b border-slate-100 bg-slate-50 px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <div className="col-span-2">Code</div>
                <div className="col-span-4">Project Details</div>
                <div className="col-span-1 text-center">Status</div>
                <div className="col-span-4">Completion Progress</div>
                <div className="col-span-1 text-center">Actions</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-slate-100">
                {projects.map((project) => (
                    <div
                        key={project.id}
                        className="grid grid-cols-12 items-center gap-4 px-6 py-5 transition-colors hover:bg-slate-50"
                    >
                        {/* Code */}
                        <div className="col-span-2">
                            <span className="rounded border border-slate-200 bg-slate-50 px-2 py-1 font-mono text-sm font-medium text-slate-700">
                                {project.code}
                            </span>
                        </div>

                        {/* Project Details */}
                        <div className="col-span-4">
                            <Link
                                href={`/company/projects/${project.id}`}
                                className="font-semibold text-slate-900 hover:text-primary"
                            >
                                {project.name}
                            </Link>
                            <p className="mt-1 text-sm text-slate-500">
                                <span className={typeColors[project.type]}>
                                    {project.typeLabel}
                                </span>
                                <span className="mx-2">•</span>
                                {project.location}
                            </p>
                        </div>

                        {/* Status */}
                        <div className="col-span-1 text-center">
                            <StatusBadge status={project.status} />
                        </div>

                        {/* Completion Progress */}
                        <div className="col-span-4">
                            <ProgressBar
                                current={project.currentResponses}
                                total={project.targetResponses}
                            />
                        </div>

                        {/* Actions */}
                        <div className="col-span-1 flex items-center justify-center gap-2">
                            <Link
                                href={`/company/projects/${project.id}`}
                                className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-primary"
                                title="View"
                            >
                                <Icon name="visibility" className="text-lg" />
                            </Link>
                            {onEdit && (
                                <button
                                    onClick={() => onEdit(project)}
                                    className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-primary"
                                    title="Edit"
                                >
                                    <Icon name="edit" className="text-lg" />
                                </button>
                            )}
                            {onDelete && (
                                <button
                                    onClick={() => onDelete(project)}
                                    className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-red-500"
                                    title="Delete"
                                >
                                    <Icon name="delete" className="text-lg" />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
