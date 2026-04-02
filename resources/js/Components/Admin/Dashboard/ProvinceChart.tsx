import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/Components/ui/card';
import { MapPin } from 'lucide-react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ResponsiveContainer,
    XAxis,
    YAxis,
} from 'recharts';
import type { ProvinceData } from './types';

interface ProvinceChartProps {
    data: ProvinceData[];
}

const pieColors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

export function ProvinceChart({ data }: ProvinceChartProps) {
    return (
        <Card className="border-0 shadow-lg">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <MapPin className="h-5 w-5 text-primary" />
                    Distribusi Responden per Provinsi
                </CardTitle>
                <CardDescription>
                    Top 5 provinsi dengan responden terbanyak
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} layout="vertical">
                            <CartesianGrid
                                strokeDasharray="3 3"
                                horizontal={true}
                                vertical={false}
                                className="stroke-slate-200 dark:stroke-slate-700"
                            />
                            <XAxis type="number" tick={{ fontSize: 11 }} />
                            <YAxis
                                type="category"
                                dataKey="name"
                                width={120}
                                tick={{ fontSize: 11 }}
                            />
                            <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                                {data.map((_, index) => (
                                    <Cell
                                        key={'cell-'+{index}}
                                        fill={
                                            pieColors[index % pieColors.length]
                                        }
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
