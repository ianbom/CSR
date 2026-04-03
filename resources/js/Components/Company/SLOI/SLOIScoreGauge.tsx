import { ReactNode } from 'react';

interface SLOIScoreGaugeProps {
    sloiScore: number;
    trustLevel: string;
}

const STEPS = [
    { min: 0, max: 1, step: 1, label: 'Sangat Rendah', color: '#ef4444' },
    { min: 1, max: 2, step: 2, label: 'Rendah',        color: '#f97316' },
    { min: 2, max: 3, step: 3, label: 'Cukup',         color: '#eab308' },
    { min: 3, max: 4, step: 4, label: 'Baik',          color: '#84cc16' },
    { min: 4, max: 5, step: 5, label: 'Sangat Baik',   color: '#22c55e' },
    { min: 5, max: 6, step: 6, label: 'Luar Biasa',    color: '#166534' },
];

// Heights in px — stair steps from short to tall (l→r)
const BAR_HEIGHTS = [64, 96, 128, 160, 192, 240];

function getActiveStep(score: number): number {
    if (score <= 0) return -1;
    for (let i = 0; i < STEPS.length; i++) {
        if (score > STEPS[i].min && score <= STEPS[i].max) return i;
    }
    return STEPS.length - 1;
}

export default function SLOIScoreGauge({
    sloiScore,
    trustLevel,
}: SLOIScoreGaugeProps): ReactNode {
    const activeIdx = getActiveStep(sloiScore);
    const activeStep = activeIdx >= 0 ? STEPS[activeIdx] : null;

    return (
        <div className="w-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

            {/* ── Header ─────────────────────────────────────────── */}
            <div className="mb-8 flex items-start justify-between">
                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                        Total Skor SLOI
                    </p>
                    <p className="mt-0.5 text-[11px] text-slate-300">Skala 0 – 6</p>
                </div>

                <div className="text-right">
                    <p className="text-4xl font-bold tracking-tight text-slate-900 leading-none">
                        {sloiScore > 0 ? sloiScore.toFixed(1) : '–'}
                        <span className="ml-1 text-base font-normal text-slate-400">/6</span>
                    </p>
                    {activeStep && (
                        <p
                            className="mt-1 text-sm font-semibold"
                            style={{ color: activeStep.color }}
                        >
                            {trustLevel || activeStep.label}
                        </p>
                    )}
                </div>
            </div>

            {/* ── Staircase ──────────────────────────────────────── */}
            <div className="flex items-end gap-2" style={{ height: 240 }}>
                {STEPS.map((step, idx) => {
                    const isActive  = idx === activeIdx;
                    const isPast    = activeIdx >= 0 && idx < activeIdx;
                    const isFuture  = activeIdx >= 0 && idx > activeIdx;

                    // Flat color logic — no gradients
                    let barColor: string;
                    if (isActive)       barColor = step.color;
                    else if (isPast)    barColor = step.color + '60'; // 38% opacity hex
                    else if (isFuture)  barColor = '#e2e8f0';          // slate-200
                    else                barColor = '#e2e8f0';

                    return (
                        <div
                            key={idx}
                            className="relative flex flex-1 flex-col items-center justify-end"
                            style={{ height: '100%' }}
                        >
                            {/* Pin marker on active */}
                            {isActive && (
                                <div className="absolute bottom-full mb-2 flex flex-col items-center">
                                    <span
                                        className="rounded px-1.5 py-0.5 text-[10px] font-bold text-white"
                                        style={{ backgroundColor: step.color }}
                                    >
                                        {sloiScore.toFixed(1)}
                                    </span>
                                    <div
                                        className="mt-0.5 h-3 w-px"
                                        style={{ backgroundColor: step.color }}
                                    />
                                </div>
                            )}

                            {/* Bar — flat, no gradient */}
                            <div
                                className="w-full rounded-t"
                                style={{
                                    height: BAR_HEIGHTS[idx],
                                    backgroundColor: barColor,
                                }}
                            />
                        </div>
                    );
                })}
            </div>

            {/* ── X-axis labels ──────────────────────────────────── */}
            <div className="mt-2 flex gap-2">
                {STEPS.map((step, idx) => (
                    <div
                        key={idx}
                        className="flex-1 text-center text-[11px] font-medium"
                        style={{
                            color: idx === activeIdx ? step.color : '#cbd5e1',
                        }}
                    >
                        {step.step}
                    </div>
                ))}
            </div>

            {/* ── Legend ─────────────────────────────────────────── */}
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-slate-100 pt-4">
                {STEPS.map((step, idx) => {
                    const isActive = idx === activeIdx;
                    return (
                        <div key={idx} className="flex items-center gap-1.5">
                            <div
                                className="h-2 w-2 rounded-sm"
                                style={{ backgroundColor: step.color, opacity: isActive ? 1 : 0.3 }}
                            />
                            <span
                                className="text-[11px]"
                                style={{
                                    color: isActive ? step.color : '#94a3b8',
                                    fontWeight: isActive ? 600 : 400,
                                }}
                            >
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
