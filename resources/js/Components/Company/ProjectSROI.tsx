import { Icon } from '@/Components/Company';
import { sroiData } from '@/data';
import { ReactNode } from 'react';

// Menggunakan data dari JSON
const stats = sroiData.stats;
const impactTimeline = sroiData.impactTimeline;
const stakeholderImpact = sroiData.stakeholderImpact;
const outcomes = sroiData.outcomes;

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(value);
};

export default function ProjectSROI(): ReactNode {
    return (
        <div className="space-y-6">
            {/* Header Stats */}
            <div className="mb-8 flex items-start justify-between">
                <div>
                    <div className="mb-2 flex items-center gap-3">
                        <h2 className="text-2xl font-black tracking-tight">
                            Analisis Social Return on Investment
                        </h2>
                        <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                            BETA
                        </span>
                    </div>
                    <p className="text-slate-500">
                        Evaluasi nilai dampak sosial, ekonomi, dan lingkungan
                        terhadap investasi proyek.
                    </p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold shadow-sm hover:bg-slate-50">
                        <Icon name="download" className="text-sm" /> Unduh
                        Laporan
                    </button>
                    <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-opacity-90">
                        <Icon name="calculate" className="text-sm" /> Kalkulator
                        SROI
                    </button>
                </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <div className="col-span-1 rounded-xl border border-slate-100 bg-white p-6 shadow-sm md:col-span-2">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                                Rasio SROI Total
                            </p>
                            <h3 className="text-4xl font-black text-primary">
                                {stats.ratio}
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

                <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Net Present Value (NPV)
                    </p>
                    <h3 className="text-xl font-black text-slate-800">
                        {formatCurrency(stats.netPresentValue)}
                    </h3>
                    <div className="mt-4 h-1.5 w-full rounded-full bg-slate-100">
                        <div className="h-full w-[75%] rounded-full bg-green-500"></div>
                    </div>
                </div>

                <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Payback Period
                    </p>
                    <h3 className="text-xl font-black text-slate-800">
                        {stats.paybackPeriod}
                    </h3>
                    <p className="mt-1 text-xs font-bold text-green-600">
                        {stats.paybackImprovement}
                    </p>
                </div>
            </div>

            {/* Financial Charts */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Impact vs Investment Chart */}
                <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm lg:col-span-2">
                    <div className="mb-6 flex items-center justify-between">
                        <h3 className="text-base font-bold">
                            Proyeksi Investasi vs Dampak
                        </h3>
                        <div className="flex gap-4 text-xs font-bold">
                            <div className="flex items-center gap-1">
                                <span className="size-2 rounded-full bg-slate-300"></span>{' '}
                                Investasi
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="size-2 rounded-full bg-primary"></span>{' '}
                                Nilai Dampak
                            </div>
                        </div>
                    </div>
                    <div className="flex h-64 items-end gap-8 px-4">
                        {impactTimeline.map((item, i) => (
                            <div
                                key={i}
                                className="group flex flex-1 flex-col justify-end gap-1"
                            >
                                <div className="relative flex w-full justify-center">
                                    <div
                                        className="w-8 rounded-t bg-primary transition-all group-hover:bg-primary/90"
                                        style={{
                                            height: `${item.impact / 5}px`,
                                        }}
                                    ></div>
                                </div>
                                <div className="relative flex w-full justify-center">
                                    <div
                                        className="w-8 rounded-t bg-slate-300 transition-all group-hover:bg-slate-400"
                                        style={{
                                            height: `${item.expenses / 5}px`,
                                        }}
                                    ></div>
                                </div>
                                <p className="mt-2 text-center text-xs font-bold text-slate-400">
                                    {item.year}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stakeholder Breakdown */}
                <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                    <h3 className="mb-6 text-base font-bold">
                        Kontribusi Stakeholder
                    </h3>
                    <div className="mb-8 flex justify-center">
                        <div className="relative size-48 rounded-full border-[12px] border-slate-100">
                            {/* Simple CSS Donut representation */}
                            <svg
                                viewBox="0 0 100 100"
                                className="absolute inset-0 -rotate-90"
                            >
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    fill="transparent"
                                    stroke="#16a249"
                                    strokeWidth="20"
                                    strokeDasharray="45 100"
                                />
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    fill="transparent"
                                    stroke="#3b82f6"
                                    strokeWidth="20"
                                    strokeDasharray="25 100"
                                    strokeDashoffset="-45"
                                />
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    fill="transparent"
                                    stroke="#f59e0b"
                                    strokeWidth="20"
                                    strokeDasharray="20 100"
                                    strokeDashoffset="-70"
                                />
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    fill="transparent"
                                    stroke="#14b8a6"
                                    strokeWidth="20"
                                    strokeDasharray="10 100"
                                    strokeDashoffset="-90"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-xs font-bold uppercase text-slate-400">
                                    Total
                                </span>
                                <span className="text-xl font-black text-slate-800">
                                    100%
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {stakeholderImpact.map((stakeholder) => (
                            <div
                                key={stakeholder.name}
                                className="flex items-center justify-between text-sm"
                            >
                                <div className="flex items-center gap-2">
                                    <div
                                        className={`size-3 rounded-full ${stakeholder.color}`}
                                    ></div>
                                    <span className="text-slate-600">
                                        {stakeholder.name}
                                    </span>
                                </div>
                                <span className="font-bold">
                                    {stakeholder.value}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Detailed Outcomes Table */}
            <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 p-6">
                    <h3 className="text-lg font-bold">
                        Rincian Outcome & Valuasi
                    </h3>
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
                                        className={`rounded px-2 py-1 text-[10px] font-bold uppercase ${outcome.type === 'financial'
                                                ? 'bg-blue-50 text-blue-600'
                                                : outcome.type === 'social'
                                                    ? 'bg-teal-50 text-teal-600'
                                                    : 'bg-green-50 text-green-600'
                                            }`}
                                    >
                                        {outcome.type === 'financial'
                                            ? 'Finansial'
                                            : outcome.type === 'social'
                                                ? 'Sosial'
                                                : 'Lingkungan'}
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
                                {formatCurrency(stats.totalImpactValue)}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
}
