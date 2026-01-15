import { ReactNode } from 'react';

interface OutcomeItem {
    id: string;
    name: string;
    value: number;
    valueFormatted: string;
    type: string;
    description: string;
    beneficiaries: number;
}

interface SROIOutcomesTableProps {
    outcomes: OutcomeItem[];
    totalImpactValue: number;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(value);
};

const getTypeStyle = (type: string) => {
    switch (type) {
        case 'financial':
            return 'bg-blue-50 text-blue-600';
        case 'social':
            return 'bg-teal-50 text-teal-600';
        case 'environmental':
            return 'bg-green-50 text-green-600';
        default:
            return 'bg-slate-50 text-slate-600';
    }
};

const getTypeLabel = (type: string) => {
    switch (type) {
        case 'financial':
            return 'Finansial';
        case 'social':
            return 'Sosial';
        case 'environmental':
            return 'Lingkungan';
        default:
            return type;
    }
};

export default function SROIOutcomesTable({
    outcomes,
    totalImpactValue,
}: SROIOutcomesTableProps): ReactNode {
    return (
        <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 p-6">
                <h3 className="text-lg font-bold">Rincian Outcome & Valuasi</h3>
            </div>
            <table className="w-full text-left">
                <thead className="bg-slate-50">
                    <tr>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            Outcome
                        </th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            Jenis Dampak
                        </th>
                        <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            Nilai Moneter
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {outcomes.map((outcome) => (
                        <tr key={outcome.id} className="hover:bg-slate-50">
                            <td className="px-6 py-4 font-medium text-slate-800">
                                {outcome.name}
                            </td>
                            <td className="px-6 py-4">
                                <span
                                    className={`rounded px-2 py-1 text-[10px] font-bold uppercase ${getTypeStyle(outcome.type)}`}
                                >
                                    {getTypeLabel(outcome.type)}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right font-mono font-bold text-slate-700">
                                {outcome.valueFormatted}
                            </td>
                        </tr>
                    ))}
                </tbody>
                <tfoot className="bg-slate-50">
                    <tr>
                        <td
                            colSpan={2}
                            className="px-6 py-4 text-right font-bold text-slate-600"
                        >
                            Total Impact Value
                        </td>
                        <td className="px-6 py-4 text-right font-mono text-lg font-black text-primary">
                            {formatCurrency(totalImpactValue)}
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
}
