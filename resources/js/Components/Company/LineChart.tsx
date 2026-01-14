import { ReactNode } from 'react';

interface LineChartProps {
    title: string;
    description: string;
    dateLabels: string[];
}

export default function LineChart({
    title,
    description,
    dateLabels,
}: LineChartProps): ReactNode {
    return (
        <div className="rounded-xl border border-slate-200 bg-card-light p-8 shadow-sm lg:col-span-2">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold text-slate-900">
                        {title}
                    </h2>
                    <p className="text-sm text-slate-500">{description}</p>
                </div>
                <select className="rounded-lg border-none bg-slate-100 px-3 py-1.5 text-xs font-bold focus:ring-0">
                    <option>Last 30 Days</option>
                    <option>Last 3 Months</option>
                </select>
            </div>
            <div className="group relative h-48 w-full">
                <svg
                    className="h-full w-full overflow-visible"
                    viewBox="0 0 1000 200"
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
                    <path
                        d="M0,180 L100,160 L200,175 L300,120 L400,130 L500,60 L600,80 L700,40 L800,50 L900,20 L1000,30"
                        fill="none"
                        stroke="#16a249"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="4"
                    />
                    <path
                        d="M0,180 L100,160 L200,175 L300,120 L400,130 L500,60 L600,80 L700,40 L800,50 L900,20 L1000,30 V200 H0 Z"
                        fill="url(#lineGradient)"
                        fillOpacity="0.1"
                    />
                </svg>
                <div className="mt-6 flex justify-between px-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    {dateLabels.map((label) => (
                        <span key={label}>{label}</span>
                    ))}
                </div>
            </div>
        </div>
    );
}
