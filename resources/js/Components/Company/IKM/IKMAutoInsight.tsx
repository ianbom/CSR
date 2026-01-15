import { Icon } from '@/Components/Company';
import { ReactNode } from 'react';

interface InsightItem {
    title: string;
    description: string;
}

interface IKMAutoInsightProps {
    positiveTrend: InsightItem;
    criticalAttention: InsightItem;
}

export default function IKMAutoInsight({
    positiveTrend,
    criticalAttention,
}: IKMAutoInsightProps): ReactNode {
    return (
        <div className="flex h-full flex-col rounded-xl border border-green-500/10 bg-green-500/5 p-6">
            <div className="mb-4 flex items-center gap-2 text-green-600">
                <Icon name="auto_awesome" />
                <h3 className="text-base font-bold">Auto-Insight</h3>
            </div>
            <div className="flex-1 space-y-4">
                <div className="rounded-lg border border-green-500/10 bg-white p-4 shadow-sm">
                    <p className="mb-1 text-xs font-bold text-green-600">
                        {positiveTrend.title}
                    </p>
                    <p className="text-xs leading-relaxed text-slate-600">
                        {positiveTrend.description}
                    </p>
                </div>
                <div className="rounded-lg border border-red-100 bg-white p-4 shadow-sm">
                    <p className="mb-1 text-xs font-bold text-red-500">
                        {criticalAttention.title}
                    </p>
                    <p className="text-xs leading-relaxed text-slate-600">
                        {criticalAttention.description}
                    </p>
                </div>
            </div>
            <button className="mt-6 flex items-center gap-1 text-xs font-bold text-green-600 hover:underline">
                Buat Laporan Detail
                <Icon name="arrow_right_alt" className="text-sm" />
            </button>
        </div>
    );
}
