import { ReactNode, useState } from 'react';

interface QuestionScoreItem {
    id: string;
    question: string;
    score: number;
    importance: number;
    performance: number;
}

interface AllQuestionItem {
    id: string;
    code: string;
    category: string;
    question: string;
    order_no: number;
}

interface IKMTrendChartProps {
    questionScores: QuestionScoreItem[];
    allQuestions?: AllQuestionItem[];
    avgKepentingan?: number;
    avgKinerja?: number;
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

const SCORE_MIN = 1;
const SCORE_MAX = 4.25;
const DEFAULT_AVERAGE = 2.5;

function clampScore(value: number | null | undefined): number {
    if (!Number.isFinite(value) || !value || value <= 0) {
        return DEFAULT_AVERAGE;
    }

    return Math.min(SCORE_MAX, Math.max(SCORE_MIN, value));
}

function formatScore(value: number): string {
    return value.toFixed(2).replace('.', ',');
}

function IPAScatterChart({
    questionScores,
    chartTitle,
    avgKepentingan,
    avgKinerja,
    compact = false,
}: {
    questionScores: QuestionScoreItem[];
    chartTitle: string;
    avgKepentingan: number;
    avgKinerja: number;
    compact?: boolean;
}) {
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    if (questionScores.length === 0) {
        return (
            <div className="flex h-48 items-center justify-center text-sm text-slate-400">
                Belum ada data pertanyaan
            </div>
        );
    }

    const safeAvgKepentingan = clampScore(avgKepentingan);
    const safeAvgKinerja = clampScore(avgKinerja);

    // IKM uses a 1-5 scale on both axes.
    const xMin = SCORE_MIN;
    const xMax = SCORE_MAX;
    const yMin = SCORE_MIN;
    const yMax = SCORE_MAX;
    const xRange = xMax - xMin;
    const yRange = yMax - yMin;

    // SVG dimensions - make plot area horizontally elongated
    const marginLeft = compact ? 55 : 65;
    const marginRight = compact ? 30 : 40;
    const marginTop = compact ? 35 : 50;
    const marginBottom = compact ? 45 : 55;

    // Horizontally elongated plot area
    const plotW = compact ? 600 : 1000;
    const plotH = compact ? 300 : 500;

    const width = plotW + marginLeft + marginRight;
    const height = plotH + marginTop + marginBottom;

    // Map data to SVG
    const toSvgX = (val: number) =>
        marginLeft + ((val - xMin) / xRange) * plotW;
    const toSvgY = (val: number) => marginTop + ((yMax - val) / yRange) * plotH;

    // Generate ticks
    const xStep = 0.5;
    const yStep = 0.5;
    const xTicks: number[] = [];
    const yTicks: number[] = [];
    for (let v = xMin; v <= xMax + 0.001; v += xStep)
        xTicks.push(Math.round(v * 100) / 100);
    for (let v = yMin; v <= yMax + 0.001; v += yStep)
        yTicks.push(Math.round(v * 100) / 100);

    const fontSize = compact ? 10 : 12;
    const dotR = compact ? 6 : 8;
    const labelFontSize = compact ? 11 : 13;
    const quadrantFontSize = compact ? 10 : 14;
    const quadrantLabelStyle = {
        fontSize: quadrantFontSize,
        fontWeight: 800,
        fontStyle: 'italic',
    };
    const verticalLineX = toSvgX(safeAvgKepentingan);
    const horizontalLineY = toSvgY(safeAvgKinerja);
    const quadrantLabels = [
        {
            label: 'Kuadran I',
            description: 'Prioritas Utama',
            x: verticalLineX + (marginLeft + plotW - verticalLineX) / 2,
            y: horizontalLineY + (marginTop + plotH - horizontalLineY) / 2,
        },
        {
            label: 'Kuadran II',
            description: 'Pertahankan Kinerja',
            x: verticalLineX + (marginLeft + plotW - verticalLineX) / 2,
            y: marginTop + (horizontalLineY - marginTop) / 2,
        },
        {
            label: 'Kuadran III',
            description: 'Prioritas Rendah',
            x: marginLeft + (verticalLineX - marginLeft) / 2,
            y: horizontalLineY + (marginTop + plotH - horizontalLineY) / 2,
        },
        {
            label: 'Kuadran IV',
            description: 'Berlebihan',
            x: marginLeft + (verticalLineX - marginLeft) / 2,
            y: marginTop + (horizontalLineY - marginTop) / 2,
        },
    ];

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

                {/* Quadrant labels */}
                {quadrantLabels.map((quadrant) => (
                    <text
                        key={quadrant.label}
                        x={quadrant.x}
                        y={quadrant.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="fill-slate-400"
                        opacity={0.65}
                        style={quadrantLabelStyle}
                    >
                        <tspan x={quadrant.x} dy="-0.35em">
                            {quadrant.label}
                        </tspan>
                        <tspan x={quadrant.x} dy="1.2em">
                            {quadrant.description}
                        </tspan>
                    </text>
                ))}

                {/* Average lines — quadrant dividers */}
                {/* Vertical blue line (avg kepentingan / importance) */}
                <line
                    x1={verticalLineX}
                    y1={marginTop}
                    x2={verticalLineX}
                    y2={marginTop + plotH}
                    stroke="#3b82f6"
                    strokeWidth={2}
                    strokeDasharray="6 4"
                />
                {/* Horizontal green line (avg kinerja / performance) */}
                <line
                    x1={marginLeft}
                    y1={horizontalLineY}
                    x2={marginLeft + plotW}
                    y2={horizontalLineY}
                    stroke="#22c55e"
                    strokeWidth={2}
                    strokeDasharray="6 4"
                />

                {/* Average line labels */}
                <text
                    x={Math.min(verticalLineX + 6, marginLeft + plotW - 118)}
                    y={marginTop + 14}
                    className="fill-blue-600"
                    style={{
                        fontSize: compact ? 9 : 11,
                        fontWeight: 700,
                    }}
                >
                    Rerata Kepentingan: {formatScore(safeAvgKepentingan)}
                </text>
                <text
                    x={marginLeft + 8}
                    y={Math.max(horizontalLineY - 8, marginTop + 24)}
                    className="fill-green-600"
                    style={{
                        fontSize: compact ? 9 : 11,
                        fontWeight: 700,
                    }}
                >
                    Rerata Kinerja: {formatScore(safeAvgKinerja)}
                </text>

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
                        {formatScore(tick)}
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
                        {formatScore(tick)}
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
                    IKM Kepentingan
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
                    IKM Kinerja
                </text>

                {/* Data points + labels */}
                {questionScores.map((q, i) => {
                    // X = kepentingan (importance), Y = kinerja (performance)
                    const kepentingan = clampScore(q.importance);
                    const kinerja = clampScore(q.performance);
                    const baseCx = toSvgX(kepentingan);
                    const baseCy = toSvgY(kinerja);
                    const color = DOT_COLORS[i % DOT_COLORS.length];
                    const shortId = q.id.replace(/^(IKM-|SLOI-)/, '');
                    const label = `${shortId}; Kpt ${formatScore(kepentingan)}; Kin ${formatScore(kinerja)}`;
                    const isHovered = hoveredId === q.id;

                    // Offset overlapping points: count how many previous points share the same coords
                    const overlapIndex = questionScores
                        .slice(0, i)
                        .filter(
                            (prev) =>
                                prev.importance === q.importance &&
                                prev.performance === q.performance,
                        ).length;
                    const angle =
                        (overlapIndex * (2 * Math.PI)) / 3 - Math.PI / 2;
                    const offsetDist = overlapIndex > 0 ? dotR * 2.5 : 0;
                    const cx = baseCx + Math.cos(angle) * offsetDist;
                    const cy = baseCy + Math.sin(angle) * offsetDist;

                    return (
                        <g
                            key={q.id}
                            onMouseEnter={() => setHoveredId(q.id)}
                            onMouseLeave={() => setHoveredId(null)}
                            style={{ cursor: 'pointer' }}
                        >
                            {/* Dot */}
                            <circle
                                cx={cx}
                                cy={cy}
                                r={isHovered ? dotR * 1.5 : dotR}
                                fill={color}
                                stroke="white"
                                strokeWidth={isHovered ? 2.5 : 1.5}
                                style={{ transition: 'all 0.2s ease' }}
                            />
                            {/* Label - only visible on hover */}
                            {isHovered && (
                                <>
                                    <rect
                                        x={cx + dotR * 1.5 + 4}
                                        y={cy - labelFontSize - 4}
                                        width={
                                            label.length *
                                                (labelFontSize * 0.55) +
                                            12
                                        }
                                        height={labelFontSize + 10}
                                        fill="white"
                                        fillOpacity={0.95}
                                        rx={4}
                                        stroke={color}
                                        strokeWidth={1.5}
                                    />
                                    <text
                                        x={cx + dotR * 1.5 + 10}
                                        y={cy + 3}
                                        className="fill-slate-700"
                                        style={{
                                            fontSize: labelFontSize,
                                            fontWeight: 700,
                                        }}
                                    >
                                        {label}
                                    </text>
                                </>
                            )}
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}

export default function IKMTrendChart({
    questionScores,
    allQuestions = [],
    avgKepentingan = DEFAULT_AVERAGE,
    avgKinerja = DEFAULT_AVERAGE,
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
                        avgKepentingan={avgKepentingan}
                        avgKinerja={avgKinerja}
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
                            avgKepentingan={avgKepentingan}
                            avgKinerja={avgKinerja}
                        />

                        {/* Question Legend */}
                        <div className="mt-6 border-t border-slate-100 pt-4">
                            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                Semua Pertanyaan IKM
                            </h4>
                            <div className="grid grid-cols-1 gap-4">
                                {allQuestions.length > 0 ? (
                                    <>
                                        {/* IKM Kepentingan Section */}
                                        <div>
                                            <h5 className="mb-2 text-xs font-semibold text-blue-600">
                                                IKM Kepentingan
                                            </h5>
                                            <div className="grid grid-cols-1 gap-2">
                                                {allQuestions
                                                    .filter(
                                                        (q) =>
                                                            q.category ===
                                                            'ikm-kepentingan',
                                                    )
                                                    .map((q, i) => {
                                                        // Find matching score data if available
                                                        const scoreData =
                                                            questionScores.find(
                                                                (sq) =>
                                                                    sq.id ===
                                                                    q.code,
                                                            );
                                                        const colorIndex =
                                                            questionScores.findIndex(
                                                                (sq) =>
                                                                    sq.id ===
                                                                    q.code,
                                                            );

                                                        return (
                                                            <div
                                                                key={q.id}
                                                                className="flex items-start gap-2 text-sm"
                                                            >
                                                                {scoreData &&
                                                                colorIndex >=
                                                                    0 ? (
                                                                    <span
                                                                        className="mt-1 inline-block h-3 w-3 flex-shrink-0 rounded-full"
                                                                        style={{
                                                                            backgroundColor:
                                                                                DOT_COLORS[
                                                                                    colorIndex %
                                                                                        DOT_COLORS.length
                                                                                ],
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    <span className="mt-1 inline-block h-3 w-3 flex-shrink-0 rounded-full bg-slate-300" />
                                                                )}
                                                                <span className="font-bold text-slate-500">
                                                                    {q.code}
                                                                </span>
                                                                <span
                                                                    className="text-slate-600"
                                                                    dangerouslySetInnerHTML={{
                                                                        __html: q.question,
                                                                    }}
                                                                />
                                                            </div>
                                                        );
                                                    })}
                                            </div>
                                        </div>

                                        {/* IKM Kinerja Section */}
                                        <div>
                                            <h5 className="mb-2 text-xs font-semibold text-emerald-600">
                                                IKM Kinerja
                                            </h5>
                                            <div className="grid grid-cols-1 gap-2">
                                                {allQuestions
                                                    .filter(
                                                        (q) =>
                                                            q.category ===
                                                            'ikm-kinerja',
                                                    )
                                                    .map((q, i) => {
                                                        // Find matching score data if available
                                                        const scoreData =
                                                            questionScores.find(
                                                                (sq) =>
                                                                    sq.id ===
                                                                    q.code,
                                                            );
                                                        const colorIndex =
                                                            questionScores.findIndex(
                                                                (sq) =>
                                                                    sq.id ===
                                                                    q.code,
                                                            );

                                                        return (
                                                            <div
                                                                key={q.id}
                                                                className="flex items-start gap-2 text-sm"
                                                            >
                                                                {scoreData &&
                                                                colorIndex >=
                                                                    0 ? (
                                                                    <span
                                                                        className="mt-1 inline-block h-3 w-3 flex-shrink-0 rounded-full"
                                                                        style={{
                                                                            backgroundColor:
                                                                                DOT_COLORS[
                                                                                    colorIndex %
                                                                                        DOT_COLORS.length
                                                                                ],
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    <span className="mt-1 inline-block h-3 w-3 flex-shrink-0 rounded-full bg-slate-300" />
                                                                )}
                                                                <span className="font-bold text-slate-500">
                                                                    {q.code}
                                                                </span>
                                                                <span
                                                                    className="text-slate-600"
                                                                    dangerouslySetInnerHTML={{
                                                                        __html: q.question,
                                                                    }}
                                                                />
                                                            </div>
                                                        );
                                                    })}
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    questionScores.map((q, i) => (
                                        <div
                                            key={q.id}
                                            className="flex items-start gap-2 text-sm"
                                        >
                                            <span
                                                className="mt-1 inline-block h-3 w-3 flex-shrink-0 rounded-full"
                                                style={{
                                                    backgroundColor:
                                                        DOT_COLORS[
                                                            i %
                                                                DOT_COLORS.length
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
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
