import { ReactNode } from 'react';

interface StakeholderItem {
    name: string;
    value: number;
    color: string;
    amount: number;
}

interface SROIStakeholderDonutProps {
    stakeholderImpact: StakeholderItem[];
}

export default function SROIStakeholderDonut({
    stakeholderImpact,
}: SROIStakeholderDonutProps): ReactNode {
    return (
        <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="mb-6 text-base font-bold">Kontribusi Stakeholder</h3>
            <div className="mb-8 flex justify-center">
                <div className="relative size-48 rounded-full border-[12px] border-slate-100">
                    {/* Donut Chart SVG */}
                    <svg
                        viewBox="0 0 100 100"
                        className="absolute inset-0 -rotate-90"
                    >
                        <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="transparent"
                            stroke="#16a249"
                            strokeWidth="20"
                            strokeDasharray="45 100"
                        />
                        <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="transparent"
                            stroke="#3b82f6"
                            strokeWidth="20"
                            strokeDasharray="25 100"
                            strokeDashoffset="-45"
                        />
                        <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="transparent"
                            stroke="#f59e0b"
                            strokeWidth="20"
                            strokeDasharray="20 100"
                            strokeDashoffset="-70"
                        />
                        <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="transparent"
                            stroke="#14b8a6"
                            strokeWidth="20"
                            strokeDasharray="10 100"
                            strokeDashoffset="-90"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xs font-bold uppercase text-slate-400">
                            Total
                        </span>
                        <span className="text-xl font-black text-slate-800">
                            100%
                        </span>
                    </div>
                </div>
            </div>
            <div className="space-y-3">
                {stakeholderImpact.map((stakeholder) => (
                    <div
                        key={stakeholder.name}
                        className="flex items-center justify-between text-sm"
                    >
                        <div className="flex items-center gap-2">
                            <div
                                className={`size-3 rounded-full ${stakeholder.color}`}
                            ></div>
                            <span className="text-slate-600">
                                {stakeholder.name}
                            </span>
                        </div>
                        <span className="font-bold">{stakeholder.value}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
