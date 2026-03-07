import { ReactNode, useMemo } from 'react';
import { Bar, BarChart, LabelList, XAxis, YAxis } from 'recharts';

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from '@/Components/ui/chart';

interface EducationItem {
    label: string;
    value: number;
    percentage: number;
}

interface SLOIEducationChartProps {
    data?: EducationItem[];
}

const ALL_EDUCATION_LEVELS = ['SD', 'SMP', 'SMA', 'D1-D3', 'D4/S1', 'S2', 'S3'];

const chartConfig = {
    value: {
        label: 'Jumlah',
        color: '#00753D',
    },
} satisfies ChartConfig;

export default function SLOIEducationChart({
    data = [],
}: SLOIEducationChartProps): ReactNode {
    const mergedData = useMemo(
        () =>
            ALL_EDUCATION_LEVELS.map((level) => {
                const found = data.find((d) => d.label === level);
                return found ?? { label: level, value: 0, percentage: 0 };
            }),
        [data],
    );

    return (
        <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Tingkat Pendidikan Responden
            </h3>
            <ChartContainer config={chartConfig} className="h-60 w-full">
                <BarChart
                    accessibilityLayer
                    data={mergedData}
                    layout="vertical"
                    margin={{ left: 8, right: 32 }}
                    barCategoryGap="20%"
                >
                    <YAxis
                        dataKey="label"
                        type="category"
                        tickLine={false}
                        axisLine={false}
                        width={50}
                        tick={{ fontSize: 12, fill: '#64748b' }}
                    />
                    <XAxis dataKey="value" type="number" hide />
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                    />
                    <Bar
                        dataKey="value"
                        layout="vertical"
                        fill="var(--color-value)"
                        radius={4}
                        barSize={20}
                    >
                        <LabelList
                            dataKey="value"
                            position="right"
                            offset={8}
                            className="fill-slate-600"
                            fontSize={12}
                            fontWeight={600}
                        />
                    </Bar>
                </BarChart>
            </ChartContainer>
        </div>
    );
}
