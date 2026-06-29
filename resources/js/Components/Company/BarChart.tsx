'use client';

import {
    Bar,
    CartesianGrid,
    BarChart as RechartsBarChart,
    XAxis,
    YAxis,
} from 'recharts';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/Components/ui/card';
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    type ChartConfig,
} from '@/Components/ui/chart';
import { ReactNode, useState } from 'react';

interface ProjectBarData {
    name: string;
    ikmKepentingan: number;
    ikmKinerja: number;
    sloi: number;
}

interface BarChartProps {
    title: string;
    description: string;
    projects: ProjectBarData[];
}

type FilterType = 'IKM' | 'SLOI';

const chartConfig = {
    ikmKepentingan: {
        label: 'IKM Kepentingan',
        color: 'hsl(217, 91%, 60%)', // Blue
    },
    ikmKinerja: {
        label: 'IKM Kinerja',
        color: 'hsl(142, 71%, 45%)', // Green
    },
    sloi: {
        label: 'SLOI',
        color: 'hsl(262, 83%, 58%)', // Purple
    },
} satisfies ChartConfig;

// Custom tooltip component for better spacing
const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) {
        return null;
    }

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
            <p className="mb-2 font-semibold text-gray-900">{label}</p>
            <div className="space-y-1.5">
                {payload.map((entry: any, index: number) => (
                    <div
                        key={index}
                        className="flex items-center justify-between gap-4"
                    >
                        <div className="flex items-center gap-2">
                            <div
                                className="h-3 w-3 rounded-sm"
                                style={{ backgroundColor: entry.color }}
                            />
                            <span className="text-sm text-gray-700">
                                {
                                    chartConfig[
                                        entry.dataKey as keyof typeof chartConfig
                                    ]?.label
                                }
                            </span>
                        </div>
                        <span className="font-semibold text-gray-900">
                            {Number(entry.value).toFixed(2)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default function BarChart({
    title,
    description,
    projects,
}: BarChartProps): ReactNode {
    const [filter, setFilter] = useState<FilterType>('IKM');

    // Truncate long project names for the X-axis
    const chartData = projects.map((p) => ({
        ...p,
        shortName: p.name.length > 16 ? p.name.slice(0, 14) + '…' : p.name,
    }));

    // Calculate max value for dynamic Y-axis domain
    const getMaxValue = () => {
        if (filter === 'IKM') {
            const maxIkm = Math.max(
                ...projects.flatMap((p) => [p.ikmKepentingan, p.ikmKinerja]),
            );
            return Math.min(Math.ceil(maxIkm) + 0.5, 4);
        } else {
            const maxSloi = Math.max(...projects.map((p) => p.sloi));
            return Math.min(Math.ceil(maxSloi) + 0.5, 6);
        }
    };

    const maxValue = getMaxValue();

    return (
        <Card className="lg:col-span-2">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <CardTitle>{title}</CardTitle>
                        <CardDescription>{description}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <select
                            id="score-filter"
                            value={filter}
                            onChange={(e) =>
                                setFilter(e.target.value as FilterType)
                            }
                            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                        >
                            <option value="IKM">IKM</option>
                            <option value="SLOI">SLOI</option>
                        </select>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-80 w-full">
                    <RechartsBarChart
                        accessibilityLayer
                        data={chartData}
                        margin={{ left: -10, right: 8, top: 20, bottom: 0 }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="shortName"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                        />
                        <YAxis
                            domain={[0, maxValue]}
                            tickLine={false}
                            axisLine={false}
                            tickMargin={4}
                        />
                        <ChartTooltip
                            cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                            content={<CustomTooltip />}
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                        {filter === 'IKM' ? (
                            <>
                                <Bar
                                    dataKey="ikmKepentingan"
                                    fill="var(--color-ikmKepentingan)"
                                    radius={[4, 4, 0, 0]}
                                />
                                <Bar
                                    dataKey="ikmKinerja"
                                    fill="var(--color-ikmKinerja)"
                                    radius={[4, 4, 0, 0]}
                                />
                            </>
                        ) : (
                            <Bar
                                dataKey="sloi"
                                fill="var(--color-sloi)"
                                radius={[4, 4, 0, 0]}
                            />
                        )}
                    </RechartsBarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
