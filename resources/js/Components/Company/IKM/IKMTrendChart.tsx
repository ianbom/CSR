import { ReactNode, useState } from 'react';

interface QuestionScoreItem {
    id: string;
    question: string;
    score: number;
    importance: number;
    performance: number;
}

interface IKMTrendChartProps {
    questionScores: QuestionScoreItem[];
    title?: string;
}

// Dot colors by index (matching reference)
const DOT_COLORS = [
    '#3b82f6',
    '#f97316',
    '#6b7280',
    '#22c55e',
    '#eab308',
    '#ef4444',
    '#8b5cf6',
    '#14b8a6',
    '#ec4899',
    '#06b6d4',
    '#84cc16',
    '#f59e0b',
    '#6366f1',
    '#10b981',
    '#f43f5e',
    '#a855f7',
    '#0ea5e9',
    '#d946ef',
];

function IPAScatterChart({
    questionScores,
    chartTitle,
    compact = false,
}: {
    questionScores: QuestionScoreItem[];
    chartTitle: string;
    compact?: boolean;
}) {
    if (questionScores.length === 0) {
        return (
            <div className="flex h-48 items-center justify-center text-sm text-slate-400">
                Belum ada data pertanyaan
            </div>
        );
    }

    // Calculate averages for quadrant lines
    const avgImportance =
        questionScores.reduce((s, q) => s + q.importance, 0) /
        questionScores.length;
    const avgPerformance =
        questionScores.reduce((s, q) => s + q.performance, 0) /
        questionScores.length;

    // Fixed axis range: 1.00 to 4.00 with 0.25 step
    const xMin = 1;
    const xMax = 4;
    const yMin = 1;
    const yMax = 4;
    const xRange = xMax - xMin;
    const yRange = yMax - yMin;

    // SVG dimensions
    const width = compact ? 520 : 900;
    const height = compact ? 320 : 550;
    const marginLeft = compact ? 55 : 65;
    const marginRight = compact ? 30 : 40;
    const marginTop = compact ? 35 : 50;
    const marginBottom = compact ? 45 : 55;
    const plotW = width - marginLeft - marginRight;
    const plotH = height - marginTop - marginBottom;

    // Map data to SVG
    const toSvgX = (val: number) =>
        marginLeft + ((val - xMin) / xRange) * plotW;
    const toSvgY = (val: number) => marginTop + ((yMax - val) / yRange) * plotH;

    // Generate ticks with fixed 0.25 step
    const step = 0.25;
    const xTicks: number[] = [];
    const yTicks: number[] = [];
    for (let v = xMin; v <= xMax + 0.001; v += step)
        xTicks.push(Math.round(v * 100) / 100);
    for (let v = yMin; v <= yMax + 0.001; v += step)
        yTicks.push(Math.round(v * 100) / 100);

    const fontSize = compact ? 8 : 11;
    const dotR = compact ? 4 : 6;
    const labelFontSize = compact ? 7 : 9;

    return (
        <div className="w-full overflow-x-auto">
            <svg
                viewBox={`0 0 ${width} ${height}`}
                className="w-full"
                style={{ minWidth: compact ? 460 : 700 }}
            >
                {/* Title */}
                <text
                    x={width / 2}
                    y={compact ? 14 : 20}
                    textAnchor="middle"
                    className="fill-slate-800"
                    style={{
                        fontSize: compact ? 11 : 15,
                        fontWeight: 700,
                    }}
                >
                    {chartTitle}
                </text>

                {/* Background */}
                <rect
                    x={marginLeft}
                    y={marginTop}
                    width={plotW}
                    height={plotH}
                    fill="#fafafa"
                    stroke="#e2e8f0"
                    strokeWidth={1}
                />

                {/* Vertical grid lines */}
                {xTicks.map((tick) => (
                    <line
                        key={`xg-${tick}`}
                        x1={toSvgX(tick)}
                        y1={marginTop}
                        x2={toSvgX(tick)}
                        y2={marginTop + plotH}
                        stroke="#e2e8f0"
                        strokeWidth={0.5}
                    />
                ))}

                {/* Horizontal grid lines */}
                {yTicks.map((tick) => (
                    <line
                        key={`yg-${tick}`}
                        x1={marginLeft}
                        y1={toSvgY(tick)}
                        x2={marginLeft + plotW}
                        y2={toSvgY(tick)}
                        stroke="#e2e8f0"
                        strokeWidth={0.5}
                    />
                ))}

                {/* Average lines — quadrant dividers */}
                {/* Horizontal blue line (avg kepentingan / importance) */}
                <line
                    x1={marginLeft}
                    y1={toSvgY(avgImportance)}
                    x2={marginLeft + plotW}
                    y2={toSvgY(avgImportance)}
                    stroke="#3b82f6"
                    strokeWidth={1.5}
                />
                {/* Vertical red line (avg kinerja / performance) */}
                <line
                    x1={toSvgX(avgPerformance)}
                    y1={marginTop}
                    x2={toSvgX(avgPerformance)}
                    y2={marginTop + plotH}
                    stroke="#dc2626"
                    strokeWidth={1.5}
                />

                {/* X-axis tick labels */}
                {xTicks.map((tick) => (
                    <text
                        key={`xl-${tick}`}
                        x={toSvgX(tick)}
                        y={marginTop + plotH + (compact ? 14 : 18)}
                        textAnchor="middle"
                        className="fill-slate-500"
                        style={{ fontSize }}
                    >
                        {tick.toFixed(2).replace('.', ',')}
                    </text>
                ))}

                {/* Y-axis tick labels */}
                {yTicks.map((tick) => (
                    <text
                        key={`yl-${tick}`}
                        x={marginLeft - 6}
                        y={toSvgY(tick) + 3}
                        textAnchor="end"
                        className="fill-slate-500"
                        style={{ fontSize }}
                    >
                        {tick.toFixed(1).replace('.', ',')}
                    </text>
                ))}

                {/* X-axis label */}
                <text
                    x={marginLeft + plotW / 2}
                    y={height - (compact ? 4 : 6)}
                    textAnchor="middle"
                    className="fill-slate-600"
                    style={{
                        fontSize: compact ? 10 : 13,
                        fontWeight: 600,
                    }}
                >
                    Aspek Kinerja (ikm-kinerja)
                </text>

                {/* Y-axis label */}
                <text
                    x={compact ? 12 : 16}
                    y={marginTop + plotH / 2}
                    textAnchor="middle"
                    className="fill-slate-600"
                    style={{
                        fontSize: compact ? 10 : 13,
                        fontWeight: 600,
                    }}
                    transform={`rotate(-90, ${compact ? 12 : 16}, ${marginTop + plotH / 2})`}
                >
                    Aspek Kepentingan (ikm-kepentingan)
                </text>

                {/* Data points + labels */}
                {questionScores.map((q, i) => {
                    // X = kinerja (performance), Y = kepentingan (importance)
                    const baseCx = toSvgX(q.performance);
                    const baseCy = toSvgY(q.importance);
                    const color = DOT_COLORS[i % DOT_COLORS.length];
                    const shortId = q.id.replace(/^(IKM-|SLOI-)/, '');
                    const label = `${shortId}; ${q.performance.toFixed(2).replace('.', ',')}; ${q.importance.toFixed(2).replace('.', ',')}`;

                    // Offset overlapping points: count how many previous points share the same coords
                    const overlapIndex = questionScores
                        .slice(0, i)
                        .filter(
                            (prev) =>
                                prev.performance === q.performance &&
                                prev.importance === q.importance,
                        ).length;
                    const angle =
                        (overlapIndex * (2 * Math.PI)) / 3 - Math.PI / 2;
                    const offsetDist = overlapIndex > 0 ? dotR * 2.5 : 0;
                    const cx = baseCx + Math.cos(angle) * offsetDist;
                    const cy = baseCy + Math.sin(angle) * offsetDist;

                    return (
                        <g key={q.id}>
                            {/* Dot */}
                            <circle
                                cx={cx}
                                cy={cy}
                                r={dotR}
                                fill={color}
                                stroke="white"
                                strokeWidth={1.5}
                            />
                            {/* Label */}
                            <rect
                                x={cx + dotR + 3}
                                y={cy - labelFontSize - 1}
                                width={
                                    label.length * (labelFontSize * 0.52) + 6
                                }
                                height={labelFontSize + 5}
                                fill="white"
                                fillOpacity={0.85}
                                rx={2}
                            />
                            <text
                                x={cx + dotR + 6}
                                y={cy}
                                className="fill-slate-600"
                                style={{
                                    fontSize: labelFontSize,
                                    fontWeight: 500,
                                }}
                            >
                                {label}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}

export default function IKMTrendChart({
    questionScores,
    title,
}: IKMTrendChartProps): ReactNode {
    const [showModal, setShowModal] = useState(false);

    const chartTitle = title || 'Indeks Kepuasan Masyarakat';

    return (
        <>
            <div className="lg:col-span-3">
                <div className="h-full rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Diagram IPA — IKM
                        </h3>
                        <button
                            onClick={() => setShowModal(true)}
                            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-[11px] font-medium text-slate-600 transition-colors hover:bg-slate-50"
                        >
                            <span className="material-symbols-outlined text-sm">
                                open_in_full
                            </span>
                            Perbesar
                        </button>
                    </div>
                    <IPAScatterChart
                        questionScores={questionScores}
                        chartTitle={chartTitle}
                        compact
                    />
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="max-h-[95vh] w-full max-w-6xl overflow-auto rounded-2xl bg-white p-8 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-slate-900">
                                Diagram IPA — IKM
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
                            >
                                <span className="material-symbols-outlined text-base">
                                    close
                                </span>
                                Tutup
                            </button>
                        </div>

                        <IPAScatterChart
                            questionScores={questionScores}
                            chartTitle={chartTitle}
                        />

                        {/* Question Legend */}
                        <div className="mt-6 border-t border-slate-100 pt-4">
                            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                Keterangan Pertanyaan
                            </h4>
                            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                                {questionScores.map((q, i) => (
                                    <div
                                        key={q.id}
                                        className="flex items-start gap-2 text-sm"
                                    >
                                        <span
                                            className="mt-1 inline-block h-3 w-3 flex-shrink-0 rounded-full"
                                            style={{
                                                backgroundColor:
                                                    DOT_COLORS[
                                                        i % DOT_COLORS.length
                                                    ],
                                            }}
                                        />
                                        <span className="font-bold text-slate-500">
                                            {q.id}
                                        </span>
                                        <span className="text-slate-600">
                                            {q.question}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
