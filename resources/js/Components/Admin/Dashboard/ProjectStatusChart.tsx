import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/Components/ui/card';
import { LayoutGrid } from 'lucide-react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import type { ChartDataItem } from './types';

interface ProjectStatusChartProps {
    data: ChartDataItem[];
}

const pieColors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

export function ProjectStatusChart({ data }: ProjectStatusChartProps) {
    return (
        <Card className="border-0 shadow-lg">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                    <LayoutGrid className="h-4 w-4 text-primary" />
                    Status Proyek
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-4">
                    <div className="h-[120px] w-[120px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={35}
                                    outerRadius={55}
                                    paddingAngle={3}
                                    dataKey="count"
                                >
                                    {data.map((_, index) => (
                                        <Cell
                                            key={'cell-'+{index}}
                                            fill={
                                                pieColors[
                                                    index % pieColors.length
                                                ]
                                            }
                                        />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex-1 space-y-2">
                        {data.map((item, index) => (
                            <div
                                key={item.status}
                                className="flex items-center justify-between text-sm"
                            >
                                <span className="flex items-center gap-2">
                                    <span
                                        className="h-2.5 w-2.5 rounded-full"
                                        style={{
                                            backgroundColor:
                                                pieColors[
                                                    index % pieColors.length
                                                ],
                                        }}
                                    />
                                    {item.status}
                                </span>
                                <span className="font-medium">{item.count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
