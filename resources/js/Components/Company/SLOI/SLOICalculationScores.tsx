import {
    AlertTriangle,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    Info,
    ShieldCheck,
    XCircle,
} from 'lucide-react';
import { ReactNode, useState } from 'react';

// ─── Types ─────────────────────────────────────────────────

interface SloiReliabilityItem {
    code: string;
    question: string;
    mean: number;
    variance: number;
    pearson: number;
    isValid: boolean;
    validityLabel: string;
}

interface SloiReliabilityData {
    n: number;
    k: number;
    items: SloiReliabilityItem[];
    sumItemVariances: number;
    varTotal: number;
    alpha: number;
    alphaStatus: string;
    insufficientData: boolean;
}

interface SLOICalculationScoresProps {
    data: SloiReliabilityData | null;
}

// ─── Helper ────────────────────────────────────────────────

function getAlphaColor(alpha: number): string {
    if (alpha >= 0.9) return '#16a34a';
    if (alpha >= 0.7) return '#22c55e';
    if (alpha >= 0.6) return '#eab308';
    return '#ef4444';
}

function getAlphaLabel(alpha: number): string {
    if (alpha >= 0.9) return 'Sangat Reliabel';
    if (alpha >= 0.7) return 'Reliabel';
    if (alpha >= 0.6) return 'Cukup Reliabel';
    return 'Tidak Reliabel';
}

function getPearsonBarWidth(pearson: number): number {
    return Math.min(Math.abs(pearson) * 100, 100);
}

// ─── Component ─────────────────────────────────────────────

export default function SLOICalculationScores({
    data,
}: SLOICalculationScoresProps): ReactNode {
    const [showFormulas, setShowFormulas] = useState(false);

    if (!data) {
        return (
            <div className="rounded-xl border border-slate-100 bg-white p-8 shadow-sm">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-slate-50">
                        <Info className="size-7 text-slate-300" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">
                        Analisis Reliabilitas & Validitas
                    </h3>
                    <p className="mt-2 max-w-sm text-sm text-slate-400">
                        Belum tersedia. Data akan ditampilkan setelah responden
                        menyelesaikan survei SLOI.
                    </p>
                </div>
            </div>
        );
    }

    if (data.insufficientData) {
        return (
            <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-8 shadow-sm">
                <div className="flex items-start gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-100">
                        <AlertTriangle className="size-5 text-amber-600" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-slate-900">
                            Data Belum Mencukupi
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                            Dibutuhkan minimal 2 responden dengan jawaban
                            lengkap untuk menghitung analisis reliabilitas dan
                            validitas. Saat ini:{' '}
                            <strong>{data.n} responden</strong>,{' '}
                            <strong>{data.k} pertanyaan</strong>.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const validCount = data.items.filter((i) => i.isValid).length;
    const invalidCount = data.items.length - validCount;
    const alphaColor = getAlphaColor(data.alpha);

    return (
        <div className="space-y-6">
            {/* ─── Header ───────────────────────────────────── */}
            <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h3 className="text-base font-bold text-slate-900">
                            Analisis Reliabilitas & Validitas
                        </h3>
                        <p className="mt-1 text-xs text-slate-400">
                            n = {data.n} responden · k = {data.k} pertanyaan · r
                            <sub>tabel</sub> = 0,254
                        </p>
                    </div>
                    <button
                        onClick={() => setShowFormulas(!showFormulas)}
                        className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-500 transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700"
                    >
                        <Info className="size-3.5" />
                        Rumus
                        {showFormulas ? (
                            <ChevronUp className="size-3" />
                        ) : (
                            <ChevronDown className="size-3" />
                        )}
                    </button>
                </div>

                {/* Formula panel */}
                {showFormulas && (
                    <div className="mb-6 rounded-lg border border-slate-100 bg-slate-50/80 p-5">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    Cronbach&apos;s Alpha
                                </p>
                                <p className="font-mono text-xs text-slate-600">
                                    α = (k / (k-1)) × (1 - Σσ²ᵢ / σ²
                                    <sub>total</sub>)
                                </p>
                                <p className="mt-1 text-[10px] text-slate-400">
                                    Reliabel jika α ≥ 0,60
                                </p>
                            </div>
                            <div>
                                <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    Pearson Correlation
                                </p>
                                <p className="font-mono text-xs text-slate-600">
                                    r = (nΣXY - ΣXΣY) / √[(nΣX² - (ΣX)²)(nΣY² -
                                    (ΣY)²)]
                                </p>
                                <p className="mt-1 text-[10px] text-slate-400">
                                    Valid jika r<sub>hitung</sub> &gt; 0,254
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* ─── Summary Cards ────────────────────────── */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Cronbach's Alpha */}
                    <div className="rounded-xl border border-slate-100 bg-gradient-to-br from-white to-slate-50/50 p-4">
                        <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Cronbach&apos;s Alpha
                        </p>
                        <div className="flex items-end gap-2">
                            <span
                                className="text-3xl font-black tabular-nums"
                                style={{ color: alphaColor }}
                            >
                                {data.alpha.toFixed(4)}
                            </span>
                        </div>
                        <div className="mt-2 flex items-center gap-1.5">
                            {data.alpha >= 0.6 ? (
                                <ShieldCheck className="size-3.5 text-green-500" />
                            ) : (
                                <XCircle className="size-3.5 text-red-500" />
                            )}
                            <span
                                className="text-xs font-semibold"
                                style={{ color: alphaColor }}
                            >
                                {getAlphaLabel(data.alpha)}
                            </span>
                        </div>
                    </div>

                    {/* VAR Total */}
                    <div className="rounded-xl border border-slate-100 bg-gradient-to-br from-white to-slate-50/50 p-4">
                        <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Varians Total (σ²<sub>total</sub>)
                        </p>
                        <span className="text-3xl font-black tabular-nums text-slate-900">
                            {data.varTotal.toFixed(4)}
                        </span>
                        <p className="mt-2 text-[10px] text-slate-400">
                            Sebaran skor total responden
                        </p>
                    </div>

                    {/* Sum Item Variances */}
                    <div className="rounded-xl border border-slate-100 bg-gradient-to-br from-white to-slate-50/50 p-4">
                        <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Σ Varians Butir (Σσ²ᵢ)
                        </p>
                        <span className="text-3xl font-black tabular-nums text-slate-900">
                            {data.sumItemVariances.toFixed(4)}
                        </span>
                        <p className="mt-2 text-[10px] text-slate-400">
                            Total varians seluruh item
                        </p>
                    </div>

                    {/* Validity Summary */}
                    <div className="rounded-xl border border-slate-100 bg-gradient-to-br from-white to-slate-50/50 p-4">
                        <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Validitas Item
                        </p>
                        <div className="flex items-end gap-3">
                            <div className="flex items-center gap-1.5">
                                <CheckCircle2 className="size-4 text-green-500" />
                                <span className="text-2xl font-black text-green-600">
                                    {validCount}
                                </span>
                            </div>
                            {invalidCount > 0 && (
                                <div className="flex items-center gap-1.5">
                                    <XCircle className="size-4 text-red-400" />
                                    <span className="text-2xl font-black text-red-500">
                                        {invalidCount}
                                    </span>
                                </div>
                            )}
                        </div>
                        <p className="mt-2 text-[10px] text-slate-400">
                            dari {data.k} pertanyaan
                        </p>
                    </div>
                </div>
            </div>

            {/* ─── Detail Table ──────────────────────────────── */}
            <div className="rounded-xl border border-slate-100 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-6 py-4">
                    <h4 className="text-sm font-bold text-slate-900">
                        Detail Per Pertanyaan
                    </h4>
                    <p className="mt-0.5 text-xs text-slate-400">
                        Varians butir, korelasi Pearson, dan status validitas
                        untuk setiap pertanyaan
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/50">
                                <th className="whitespace-nowrap px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    Kode
                                </th>
                                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    Pertanyaan
                                </th>
                                <th className="whitespace-nowrap px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    Rerata
                                </th>
                                <th className="whitespace-nowrap px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    Varians (σ²)
                                </th>
                                <th className="whitespace-nowrap px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    Pearson (r)
                                </th>
                                <th className="whitespace-nowrap px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    Korelasi
                                </th>
                                <th className="whitespace-nowrap px-6 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    Validitas
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {data.items.map((item, idx) => (
                                <tr
                                    key={item.code}
                                    className={`transition-colors hover:bg-slate-50/50 ${
                                        idx % 2 === 0
                                            ? 'bg-white'
                                            : 'bg-slate-25'
                                    }`}
                                >
                                    <td className="whitespace-nowrap px-6 py-3.5">
                                        <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs font-bold text-slate-600">
                                            {item.code}
                                        </span>
                                    </td>
                                    <td className="max-w-xs px-4 py-3.5 text-xs text-slate-600">
                                        <span
                                            className="line-clamp-2"
                                            title={item.question}
                                        >
                                            {item.question}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3.5 text-center font-mono text-xs font-semibold text-slate-700">
                                        {item.mean.toFixed(2)}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3.5 text-center font-mono text-xs font-semibold text-slate-700">
                                        {item.variance.toFixed(4)}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3.5 text-center">
                                        <span
                                            className={`font-mono text-xs font-bold ${
                                                item.isValid
                                                    ? 'text-green-600'
                                                    : 'text-red-500'
                                            }`}
                                        >
                                            {item.pearson.toFixed(4)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
                                                <div
                                                    className="h-full rounded-full transition-all"
                                                    style={{
                                                        width: `${getPearsonBarWidth(item.pearson)}%`,
                                                        backgroundColor:
                                                            item.isValid
                                                                ? '#22c55e'
                                                                : '#ef4444',
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-3.5 text-center">
                                        {item.isValid ? (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-[11px] font-bold text-green-700">
                                                <CheckCircle2 className="size-3" />
                                                VALID
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-[11px] font-bold text-red-600">
                                                <XCircle className="size-3" />
                                                TIDAK VALID
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="border-t-2 border-slate-200 bg-slate-50/80">
                                <td className="px-6 py-3" />
                                <td className="px-4 py-3 text-xs font-bold text-slate-700">
                                    Σ Varians Butir
                                </td>
                                <td className="px-4 py-3" />
                                <td className="px-4 py-3 text-center font-mono text-xs font-bold text-slate-900">
                                    {data.sumItemVariances.toFixed(4)}
                                </td>
                                <td colSpan={3} />
                            </tr>
                            <tr className="bg-slate-50/80">
                                <td className="px-6 py-3" />
                                <td className="px-4 py-3 text-xs font-bold text-slate-700">
                                    Varians Total
                                </td>
                                <td className="px-4 py-3" />
                                <td className="px-4 py-3 text-center font-mono text-xs font-bold text-slate-900">
                                    {data.varTotal.toFixed(4)}
                                </td>
                                <td colSpan={3} />
                            </tr>
                            <tr className="bg-slate-50/80">
                                <td className="px-6 py-3" />
                                <td className="px-4 py-3 text-xs font-bold text-slate-700">
                                    Cronbach&apos;s Alpha
                                </td>
                                <td className="px-4 py-3" />
                                <td
                                    className="px-4 py-3 text-center font-mono text-xs font-bold"
                                    style={{ color: alphaColor }}
                                >
                                    {data.alpha.toFixed(4)}
                                </td>
                                <td
                                    colSpan={3}
                                    className="px-4 py-3 text-center"
                                >
                                    {data.alpha >= 0.6 ? (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                                            <ShieldCheck className="size-3.5" />
                                            {data.alphaStatus}
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600">
                                            <XCircle className="size-3.5" />
                                            {data.alphaStatus}
                                        </span>
                                    )}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            {/* ─── Interpretation Guide ─────────────────────── */}
            <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                <h4 className="mb-4 text-sm font-bold text-slate-900">
                    Panduan Interpretasi
                </h4>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-4">
                        <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Reliabilitas (Cronbach&apos;s Alpha)
                        </p>
                        <div className="space-y-1.5">
                            {[
                                {
                                    range: 'α ≥ 0,90',
                                    label: 'Sangat Reliabel',
                                    color: '#16a34a',
                                },
                                {
                                    range: '0,70 ≤ α < 0,90',
                                    label: 'Reliabel',
                                    color: '#22c55e',
                                },
                                {
                                    range: '0,60 ≤ α < 0,70',
                                    label: 'Cukup Reliabel',
                                    color: '#eab308',
                                },
                                {
                                    range: 'α < 0,60',
                                    label: 'Tidak Reliabel',
                                    color: '#ef4444',
                                },
                            ].map((item) => (
                                <div
                                    key={item.range}
                                    className="flex items-center gap-2"
                                >
                                    <span
                                        className="size-2 rounded-full"
                                        style={{
                                            backgroundColor: item.color,
                                        }}
                                    />
                                    <span className="font-mono text-[11px] text-slate-500">
                                        {item.range}
                                    </span>
                                    <span className="text-[11px] font-semibold text-slate-600">
                                        — {item.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-4">
                        <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Validitas (Pearson r)
                        </p>
                        <div className="space-y-1.5">
                            {[
                                {
                                    range: 'r > 0,254',
                                    label: 'VALID — pertanyaan relevan dan dipahami',
                                    color: '#22c55e',
                                },
                                {
                                    range: 'r ≤ 0,254',
                                    label: 'TIDAK VALID — pertayaan membingungkan / perlu revisi',
                                    color: '#ef4444',
                                },
                            ].map((item) => (
                                <div
                                    key={item.range}
                                    className="flex items-start gap-2"
                                >
                                    <span
                                        className="mt-1 size-2 shrink-0 rounded-full"
                                        style={{
                                            backgroundColor: item.color,
                                        }}
                                    />
                                    <div>
                                        <span className="font-mono text-[11px] text-slate-500">
                                            {item.range}
                                        </span>
                                        <span className="text-[11px] font-semibold text-slate-600">
                                            {' '}
                                            — {item.label}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
