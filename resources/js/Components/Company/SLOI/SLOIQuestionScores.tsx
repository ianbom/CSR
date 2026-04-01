import { ReactNode } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    LabelList,
    XAxis,
    YAxis,
} from 'recharts';

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from '@/Components/ui/chart';

interface QuestionScore {
    id: string;
    score: number;
}

interface SLOIQuestionScoresProps {
    scores?: QuestionScore[];
}

const chartConfig = {
    score: {
        label: 'Skor',
    },
    good: {
        color: '#22c55e',
    },
    fair: {
        color: '#eab308', // Yellow-500
    },
    poor: {
        color: '#ef4444', // Red-500
    },
} satisfies ChartConfig;

export default function SLOIQuestionScores({
    scores = [
        { id: 'Q1', score: 4.2 },
        { id: 'Q2', score: 3.8 },
        { id: 'Q3', score: 4.5 },
        { id: 'Q4', score: 3.2 },
        { id: 'Q5', score: 4.1 },
        { id: 'Q6', score: 3.9 },
        { id: 'Q7', score: 4.3 },
        { id: 'Q8', score: 3.5 },
        { id: 'Q9', score: 4.0 },
        { id: 'Q10', score: 4.4 },
        { id: 'Q11', score: 3.7 },
        { id: 'Q12', score: 4.2 },
    ],
}: SLOIQuestionScoresProps): ReactNode {
    const chartData = scores.map((item) => {
        let fill = 'var(--color-poor)';
        if (item.score >= 3) fill = 'var(--color-good)';
        else if (item.score >= 2) fill = 'var(--color-fair)';

        return {
            ...item,
            fill,
        };
    });

    return (
        <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">
                    Rerata Skor Per Pertanyaan SLOI
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="size-3 rounded bg-primary"></span>
                    <span>Skor (skala 1-5)</span>
                </div>
            </div>

            <ChartContainer config={chartConfig} className="h-72 w-full">
                <BarChart
                    accessibilityLayer
                    data={chartData}
                    margin={{
                        top: 20,
                    }}
                >
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="id"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                    />
                    <YAxis
                        domain={[0, 5]}
                        tickLine={false}
                        axisLine={false}
                        tickMargin={10}
                        hide
                    />
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                    />
                    <Bar dataKey="score" radius={8}>
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                        <LabelList
                            position="top"
                            offset={12}
                            className="fill-foreground font-bold"
                            fontSize={12}
                        />
                    </Bar>
                </BarChart>
            </ChartContainer>
        </div>
    );
}
