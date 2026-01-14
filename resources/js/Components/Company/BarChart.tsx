import { ReactNode } from 'react';

interface ChartLegendItem {
    label: string;
    color: string;
}

interface ProjectBarProps {
    name: string;
    ikmHeight: string;
    sloiHeight: string;
    sroiHeight: string;
}

interface BarChartProps {
    title: string;
    description: string;
    legend: ChartLegendItem[];
    projects: ProjectBarProps[];
}

function ProjectBar({
    name,
    ikmHeight,
    sloiHeight,
    sroiHeight,
}: ProjectBarProps): ReactNode {
    return (
        <div className="flex flex-1 flex-col items-center gap-1">
            <div className="flex h-full w-full items-end justify-center gap-1">
                <div
                    className="w-3 rounded-t-sm bg-primary"
                    style={{ height: ikmHeight }}
                />
                <div
                    className="w-3 rounded-t-sm bg-primary/50"
                    style={{ height: sloiHeight }}
                />
                <div
                    className="w-3 rounded-t-sm bg-slate-200"
                    style={{ height: sroiHeight }}
                />
            </div>
            <span className="mt-2 max-w-[80px] truncate text-xs font-bold text-slate-500">
                {name}
            </span>
        </div>
    );
}

export default function BarChart({
    title,
    description,
    legend,
    projects,
}: BarChartProps): ReactNode {
    return (
        <div className="rounded-xl border border-slate-200 bg-card-light p-8 shadow-sm lg:col-span-2">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold text-slate-900">
                        {title}
                    </h2>
                    <p className="text-sm text-slate-500">{description}</p>
                </div>
                <div className="flex gap-4">
                    {legend.map((item) => (
                        <div
                            key={item.label}
                            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500"
                        >
                            <div
                                className={`size-2 rounded-full ${item.color}`}
                            />
                            {item.label}
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex h-64 w-full items-end justify-between gap-4 border-b border-slate-100 pb-2">
                {projects.map((project) => (
                    <ProjectBar key={project.name} {...project} />
                ))}
            </div>
        </div>
    );
}
