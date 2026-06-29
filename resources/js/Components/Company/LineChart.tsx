import { ReactNode } from 'react';

interface TrendDataPoint {
    date: string;
    count: number;
}

interface LineChartProps {
    title: string;
    description: string;
    dateLabels: string[];
    trendData: TrendDataPoint[];
    projectList: { id: number; name: string }[];
    selectedProjectId: number | null;
    onProjectChange?: (projectId: number | null) => void;
}

export default function LineChart({
    title,
    description,
    dateLabels,
    trendData,
    projectList,
    selectedProjectId,
    onProjectChange,
}: LineChartProps): ReactNode {
    // Calculate max value for scaling
    const maxCount = Math.max(...trendData.map((d) => d.count), 10);
    const chartHeight = 180;
    const chartWidth = 1000;
    const pointSpacing = chartWidth / (trendData.length - 1);

    // Generate path for line chart
    const generatePath = () => {
        return trendData
            .map((point, index) => {
                const x = index * pointSpacing;
                const y = chartHeight - (point.count / maxCount) * chartHeight;
                return index === 0 ? `M${x},${y}` : `L${x},${y}`;
            })
            .join(' ');
    };

    // Generate path for area fill
    const generateAreaPath = () => {
        const linePath = generatePath();
        return `${linePath} L${chartWidth},${chartHeight} L0,${chartHeight} Z`;
    };

    const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (onProjectChange) {
            onProjectChange(value === '' ? null : parseInt(value));
        }
    };

    return (
        <div className="rounded-xl border border-slate-200 bg-card-light p-8 shadow-sm lg:col-span-2">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold text-slate-900">
                        {title}
                    </h2>
                    <p className="text-sm text-slate-500">{description}</p>
                </div>
                <select
                    className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    value={selectedProjectId || ''}
                    onChange={handleProjectChange}
                >
                    <option value="">Semua Proyek</option>
                    {projectList.map((project) => (
                        <option key={project.id} value={project.id}>
                            {project.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="group relative h-48 w-full">
                <svg
                    className="h-full w-full overflow-visible"
                    viewBox={`0 0 ${chartWidth} ${chartHeight + 40}`}
                >
                    <defs>
                        <linearGradient
                            id="lineGradient"
                            x1="0%"
                            y1="0%"
                            x2="0%"
                            y2="100%"
                        >
                            <stop
                                offset="0%"
                                style={{ stopColor: '#16a249', stopOpacity: 1 }}
                            />
                            <stop
                                offset="100%"
                                style={{ stopColor: '#16a249', stopOpacity: 0 }}
                            />
                        </linearGradient>
                    </defs>

                    {/* Area fill */}
                    <path
                        d={generateAreaPath()}
                        fill="url(#lineGradient)"
                        fillOpacity="0.15"
                    />

                    {/* Line */}
                    <path
                        d={generatePath()}
                        fill="none"
                        stroke="#16a249"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                    />

                    {/* Data points and labels */}
                    {trendData.map((point, index) => {
                        const x = index * pointSpacing;
                        const y =
                            chartHeight -
                            (point.count / maxCount) * chartHeight;

                        return (
                            <g key={index}>
                                {/* Point circle */}
                                <circle
                                    cx={x}
                                    cy={y}
                                    r="5"
                                    fill="#16a249"
                                    className="hover:r-7 transition-all"
                                />
                                {/* Count label above point */}
                                <text
                                    x={x}
                                    y={y - 12}
                                    textAnchor="middle"
                                    className="fill-slate-700 text-xs font-bold"
                                >
                                    {point.count}
                                </text>
                            </g>
                        );
                    })}
                </svg>

                {/* Date labels */}
                <div className="mt-4 flex justify-between px-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    {dateLabels.map((label) => (
                        <span key={label}>{label}</span>
                    ))}
                </div>
            </div>
        </div>
    );
}
