import { ReactNode } from 'react';
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from 'recharts';

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from '@/Components/ui/chart';

interface AgeRangeItem {
    range: string;
    count: number;
}

interface IKMAgeRangeChartProps {
    ageRange?: AgeRangeItem[];
}

const DEFAULT_AGE_RANGE: AgeRangeItem[] = [
    { range: '17-25', count: 0 },
    { range: '26-35', count: 0 },
    { range: '36-45', count: 0 },
    { range: '46-55', count: 0 },
    { range: '56-65', count: 0 },
    { range: '>65', count: 0 },
];

const chartConfig = {
    count: {
        label: 'Jumlah',
        color: '#00753D',
    },
} satisfies ChartConfig;

export default function IKMAgeRangeChart({
    ageRange = DEFAULT_AGE_RANGE,
}: IKMAgeRangeChartProps): ReactNode {
    return (
        <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Responden Berdasarkan Usia
            </h3>
            <ChartContainer config={chartConfig} className="h-40 w-full">
                <BarChart
                    accessibilityLayer
                    data={ageRange}
                    margin={{ top: 20 }}
                >
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="range"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                    />
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                    />
                    <Bar
                        dataKey="count"
                        fill="var(--color-count)"
                        radius={8}
                    >
                        <LabelList
                            position="top"
                            offset={12}
                            className="fill-foreground"
                            fontSize={12}
                        />
                    </Bar>
                </BarChart>
            </ChartContainer>
        </div>
    );
}
