import { ChartContainer, type ChartConfig } from '@/Components/ui/chart';
import { ReactNode } from 'react';
import {
    Label,
    PolarGrid,
    PolarRadiusAxis,
    RadialBar,
    RadialBarChart,
} from 'recharts';

interface IKMScoreGaugeProps {
    avgKepentingan: number; // 1–4
    avgKinerja: number; // 1–4
    IKMScore?: number; // kept for backward compat but not rendered
    trustLevel?: string;
}

// Map score 1-4 to an endAngle so the arc fills proportionally.
function scoreToAngle(score: number, max = 4): number {
    return Math.round((score / max) * 360);
}

// Color bands: <2.5 red, 2.5-3.5 amber, >3.5 green
function scoreColor(score: number): string {
    if (score >= 3.5) return 'hsl(142, 71%, 45%)'; // green-500
    if (score >= 2.5) return 'hsl(38, 92%, 50%)'; // amber-500
    return 'hsl(0, 72%, 51%)'; // red-500
}

function scoreLabel(score: number): string {
    if (score >= 3.5) return 'Sangat Baik';
    if (score >= 2.5) return 'Baik';
    return 'Perlu Perbaikan';
}

interface RadialGaugeProps {
    value: number;
    label: string;
    max?: number;
}

function RadialGauge({ value, label, max = 4 }: RadialGaugeProps): ReactNode {
    const color = scoreColor(value);
    const endAngle = scoreToAngle(value, max);

    const config: ChartConfig = {
        value: { label, color },
    };

    const data = [{ value, fill: color }];

    return (
        <div className="flex flex-col items-center">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-black">
                {label}
            </p>
            <ChartContainer
                config={config}
                className="mx-auto aspect-square w-full max-w-[160px]"
            >
                <RadialBarChart
                    data={data}
                    startAngle={0}
                    endAngle={endAngle}
                    innerRadius={52}
                    outerRadius={72}
                >
                    <PolarGrid
                        gridType="circle"
                        radialLines={false}
                        stroke="none"
                        className="first:fill-muted last:fill-background"
                        polarRadius={[62, 52]}
                    />
                    <RadialBar dataKey="value" background cornerRadius={6} />
                    <PolarRadiusAxis
                        tick={false}
                        tickLine={false}
                        axisLine={false}
                    >
                        <Label
                            content={({ viewBox }) => {
                                if (
                                    viewBox &&
                                    'cx' in viewBox &&
                                    'cy' in viewBox
                                ) {
                                    return (
                                        <text
                                            x={viewBox.cx}
                                            y={viewBox.cy}
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                        >
                                            <tspan
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                style={{
                                                    fill: '#0f172a',
                                                    fontSize: 22,
                                                    fontWeight: 700,
                                                }}
                                            >
                                                {value.toFixed(2)}
                                            </tspan>
                                            <tspan
                                                x={viewBox.cx}
                                                y={(viewBox.cy ?? 0) + 18}
                                                style={{
                                                    fill: '#94a3b8',
                                                    fontSize: 9,
                                                    fontWeight: 500,
                                                }}
                                            >
                                                {scoreLabel(value)}
                                            </tspan>
                                        </text>
                                    );
                                }
                            }}
                        />
                    </PolarRadiusAxis>
                </RadialBarChart>
            </ChartContainer>
        </div>
    );
}

export default function IKMScoreGauge({
    avgKepentingan,
    avgKinerja,
}: IKMScoreGaugeProps): ReactNode {
    return (
        <div className="lg:col-span-2">
            <div className="flex h-full flex-col rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Rerata Skor IKM
                </h3>

                <div className="flex flex-1 flex-col justify-center gap-2">
                    {/* Chart 1 — Kepentingan */}
                    <RadialGauge
                        value={avgKepentingan}
                        label="IKM Kepentingan"
                    />

                    {/* Divider */}
                    <div className="mx-auto h-px w-3/4 bg-slate-100" />

                    {/* Chart 2 — Kinerja */}
                    <RadialGauge value={avgKinerja} label="IKM Kinerja" />
                </div>

                {/* Legend */}
                <div className="font-lg mt-4 flex justify-center gap-4 text-[14px]">
                    <div className="flex items-center gap-1.5">
                        <div className="size-2 rounded-full bg-red-500" />
                        <span className="text-slate-400">&lt;2.5</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="size-2 rounded-full bg-amber-500" />
                        <span className="text-slate-400">2.5–3.5</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="size-2 rounded-full bg-green-500" />
                        <span className="text-slate-400">3.5–4.0</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
