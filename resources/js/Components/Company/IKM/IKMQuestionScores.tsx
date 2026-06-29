import { ReactNode, useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

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

interface IKMQuestionScoresProps {
    kepentinganScores?: QuestionScore[];
    kinerjaScores?: QuestionScore[];
}

const DEFAULT_KEP: QuestionScore[] = [
    { id: 'U1', score: 3.8 },
    { id: 'U2', score: 4.1 },
    { id: 'U3', score: 3.5 },
    { id: 'U4', score: 4.0 },
    { id: 'U5', score: 3.9 },
    { id: 'U6', score: 4.2 },
    { id: 'U7', score: 3.7 },
    { id: 'U8', score: 4.3 },
    { id: 'U9', score: 3.6 },
];

const DEFAULT_KIN: QuestionScore[] = [
    { id: 'U1', score: 3.2 },
    { id: 'U2', score: 3.7 },
    { id: 'U3', score: 3.1 },
    { id: 'U4', score: 3.8 },
    { id: 'U5', score: 3.4 },
    { id: 'U6', score: 3.9 },
    { id: 'U7', score: 3.3 },
    { id: 'U8', score: 4.0 },
    { id: 'U9', score: 3.6 },
];

const chartConfig = {
    kepentingan: {
        label: 'Kepentingan ',
        color: '#3b82f6',
    },
    kinerja: {
        label: 'Kinerja ',
        color: '#10b981',
    },
} satisfies ChartConfig;

export default function IKMQuestionScores({
    kepentinganScores = DEFAULT_KEP,
    kinerjaScores = DEFAULT_KIN,
}: IKMQuestionScoresProps): ReactNode {
    const chartData = useMemo(() => {
        const ids = kepentinganScores.map((s) => s.id);
        const kinerjaMap = new Map(kinerjaScores.map((s) => [s.id, s.score]));

        return ids.map((id) => ({
            question: id,
            kepentingan: kepentinganScores.find((s) => s.id === id)?.score ?? 0,
            kinerja: kinerjaMap.get(id) ?? 0,
        }));
    }, [kepentinganScores, kinerjaScores]);

    if (chartData.length === 0) {
        return (
            <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                <p className="py-8 text-center text-sm text-slate-400">
                    Belum ada data.
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
            {/* Header */}
            <div className="mb-5 flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">
                    Rerata Skor Per Pertanyaan IKM
                </h3>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                        <span className="size-3 rounded bg-blue-500" />
                        Kepentingan
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="size-3 rounded bg-emerald-500" />
                        Kinerja
                    </span>
                    <span className="text-slate-400">skala 1–4</span>
                </div>
            </div>

            {/* Combined bar chart */}
            <ChartContainer config={chartConfig} className="h-64 w-full">
                <BarChart accessibilityLayer data={chartData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="question"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                    />
                    <YAxis domain={[0, 4]} tickCount={5} hide />
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="dashed" />}
                    />
                    <Bar
                        dataKey="kepentingan"
                        fill="var(--color-kepentingan)"
                        radius={4}
                    />
                    <Bar
                        dataKey="kinerja"
                        fill="var(--color-kinerja)"
                        radius={4}
                    />
                </BarChart>
            </ChartContainer>

            {/* Scale reference */}
            <div className="mt-4 flex items-center justify-end gap-6 border-t border-slate-100 pt-3 text-[10px] text-slate-400">
                <span>1 = Tidak Penting / Tidak Puas</span>
                <span>2 = Kurang Penting / Kurang Puas</span>
                <span>3 = Penting / Puas</span>
                <span>4 = Sangat Penting / Sangat Puas</span>
            </div>
        </div>
    );
}
