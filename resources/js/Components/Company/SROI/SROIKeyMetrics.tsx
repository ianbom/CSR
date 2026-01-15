import { Icon } from '@/Components/Company';
import { ReactNode } from 'react';

interface SROIKeyMetricsProps {
    ratio: string;
    netPresentValue: number;
    paybackPeriod: string;
    paybackImprovement: string;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(value);
};

export default function SROIKeyMetrics({
    ratio,
    netPresentValue,
    paybackPeriod,
    paybackImprovement,
}: SROIKeyMetricsProps): ReactNode {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {/* Rasio SROI Total */}
            <div className="col-span-1 rounded-xl border border-slate-100 bg-white p-6 shadow-sm md:col-span-2">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                            Rasio SROI Total
                        </p>
                        <h3 className="text-4xl font-black text-primary">
                            {ratio}
                        </h3>
                        <p className="mt-2 text-sm text-slate-500">
                            Setiap{' '}
                            <span className="font-bold text-slate-900">
                                Rp 1
                            </span>{' '}
                            investasi menghasilkan dampak senilai{' '}
                            <span className="font-bold text-primary">
                                Rp 3,20
                            </span>
                        </p>
                    </div>
                    <div className="rounded-full bg-primary/5 p-4">
                        <Icon
                            name="currency_exchange"
                            className="text-4xl text-primary"
                        />
                    </div>
                </div>
            </div>

            {/* Net Present Value */}
            <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Net Present Value (NPV)
                </p>
                <h3 className="text-xl font-black text-slate-800">
                    {formatCurrency(netPresentValue)}
                </h3>
                <div className="mt-4 h-1.5 w-full rounded-full bg-slate-100">
                    <div className="h-full w-[75%] rounded-full bg-green-500"></div>
                </div>
            </div>

            {/* Payback Period */}
            <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Payback Period
                </p>
                <h3 className="text-xl font-black text-slate-800">
                    {paybackPeriod}
                </h3>
                <p className="mt-1 text-xs font-bold text-green-600">
                    {paybackImprovement}
                </p>
            </div>
        </div>
    );
}
