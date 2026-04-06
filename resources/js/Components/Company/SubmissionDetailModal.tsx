import { CheckCircle2, Clock, RotateCcw, Send, XCircle } from 'lucide-react';
import { ReactNode } from 'react';
import { createPortal } from 'react-dom';

// ─── Types ─────────────────────────────────────────────────

interface RespondentInfo {
    name: string;
    gender: string | null;
    age: number | null;
    educationLevel: string | null;
    address: string | null;
    phone: string | null;
    status: string | null;
    occupation: string | null;
    monthlyIncome: number | null;
}

interface TimelineEntry {
    id: number;
    action: string;
    decidedAt: string | null;
    decidedBy: string;
    notes: string | null;
}

export interface SubmissionDetailData {
    submissionId: number;
    submittedAt: string | null;
    photoPath: string | null;
    latitude: number | string | null;
    longitude: number | string | null;
    enumerator: string | null;
    respondent: RespondentInfo | null;
    timelines?: TimelineEntry[];
    descriptiveAnswers?: { question: string; answer: string | null }[];
}

interface Props {
    data: SubmissionDetailData;
    onClose: () => void;
}

// ─── Helpers ───────────────────────────────────────────────

function InfoRow({ label, value }: { label: string; value: ReactNode }) {
    return (
        <div className="flex min-w-0 flex-col gap-0.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                {label}
            </span>
            <span className="truncate text-sm font-semibold text-slate-800">
                {value ?? '-'}
            </span>
        </div>
    );
}

const ACTION_CONFIG: Record<
    string,
    {
        label: string;
        icon: ReactNode;
        color: string;
        bg: string;
        border: string;
    }
> = {
    approved: {
        label: 'Disetujui',
        icon: <CheckCircle2 className="size-4" />,
        color: 'text-emerald-600',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
    },
    rejected: {
        label: 'Revisi',
        icon: <XCircle className="size-4" />,
        color: 'text-orange-600',
        bg: 'bg-orange-50',
        border: 'border-orange-200',
    },
    submitted: {
        label: 'Submitted',
        icon: <Send className="size-4" />,
        color: 'text-amber-600',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
    },
    revised: {
        label: 'Direvisi',
        icon: <RotateCcw className="size-4" />,
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        border: 'border-blue-200',
    },
};

// ─── Component ─────────────────────────────────────────────

export default function SubmissionDetailModal({
    data,
    onClose,
}: Props): ReactNode {
    const lat = data.latitude != null ? Number(data.latitude) : null;
    const lng = data.longitude != null ? Number(data.longitude) : null;
    const hasGps = lat != null && lng != null && !isNaN(lat) && !isNaN(lng);

    return createPortal(
        <div
            className="fixed inset-0 z-[9999] overflow-y-auto bg-black/50 p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            {/* Centering wrapper */}
            <div className="flex min-h-full items-center justify-center">
                <div
                    className="w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* ── Header ── */}
                    <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10">
                                <span className="material-symbols-outlined text-lg text-primary">
                                    assignment
                                </span>
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900">
                                    Detail Submission
                                </h3>
                                <p className="text-xs text-slate-400">
                                    #{data.submissionId} &middot;{' '}
                                    {data.submittedAt ?? '-'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="flex size-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700"
                        >
                            <span className="material-symbols-outlined text-xl">
                                close
                            </span>
                        </button>
                    </div>

                    {/* ── Body: two columns ── */}
                    <div className="grid grid-cols-1 divide-y divide-slate-100 md:grid-cols-2 md:divide-x md:divide-y-0">
                        {/* ── LEFT: Foto + GPS ── */}
                        <div className="flex flex-col gap-6 overflow-y-auto p-6">
                            {/* Section label */}
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                Dokumentasi
                            </p>

                            {/* Photo */}
                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                    Foto
                                </span>
                                {data.photoPath ? (
                                    <a
                                        href={`/storage/${data.photoPath}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="block overflow-hidden rounded-xl ring-1 ring-slate-200 transition hover:ring-primary"
                                    >
                                        <img
                                            src={`/storage/${data.photoPath}`}
                                            alt="Foto responden"
                                            className="max-h-56 w-full object-cover"
                                        />
                                    </a>
                                ) : (
                                    <div className="flex h-36 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 text-sm text-slate-400">
                                        <span className="material-symbols-outlined text-3xl">
                                            no_photography
                                        </span>
                                        Tidak ada foto
                                    </div>
                                )}
                            </div>

                            {/* GPS */}
                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                    Lokasi GPS
                                </span>
                                {hasGps ? (
                                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                        <div className="mb-3 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-base text-primary">
                                                location_on
                                            </span>
                                            <span className="font-mono text-sm text-slate-700">
                                                {lat!.toFixed(6)},{' '}
                                                {lng!.toFixed(6)}
                                            </span>
                                        </div>
                                        <a
                                            href={`https://www.google.com/maps?q=${lat},${lng}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
                                        >
                                            <span className="material-symbols-outlined text-sm leading-none">
                                                open_in_new
                                            </span>
                                            Buka di Google Maps
                                        </a>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-400">
                                        <span className="material-symbols-outlined text-base">
                                            location_off
                                        </span>
                                        Koordinat tidak tersedia
                                    </div>
                                )}
                            </div>

                            {/* Enumerator */}
                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                    Enumerator
                                </span>
                                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                        <span className="material-symbols-outlined text-base text-primary">
                                            badge
                                        </span>
                                    </div>
                                    <span className="text-sm font-semibold text-slate-700">
                                        {data.enumerator ?? '-'}
                                    </span>
                                </div>
                            </div>

                            {/* Descriptive Answers */}
                            {data.descriptiveAnswers &&
                                data.descriptiveAnswers.length > 0 && (
                                    <div className="mt-2 flex flex-col gap-3 border-t border-slate-100 pt-6">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                            Pertanyaan Deskriptif
                                        </p>
                                        <div className="flex flex-col gap-4">
                                            {data.descriptiveAnswers.map(
                                                (da, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="flex flex-col gap-1.5"
                                                    >
                                                        <span className="text-[12px] font-semibold leading-tight text-slate-500">
                                                            {da.question}
                                                        </span>
                                                        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-800">
                                                            {da.answer || '-'}
                                                        </div>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                )}
                        </div>

                        {/* ── RIGHT: Respondent info ── */}
                        <div className="flex flex-col gap-4 overflow-y-auto p-6">
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                Data Responden
                            </p>

                            {data.respondent ? (
                                <>
                                    {/* Name — full width */}
                                    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                                        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                            Nama
                                        </span>
                                        <p className="mt-0.5 text-sm font-bold text-slate-900">
                                            {data.respondent.name}
                                        </p>
                                    </div>

                                    {/* 2-column grid */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <InfoRow
                                            label="Gender"
                                            value={data.respondent.gender}
                                        />
                                        <InfoRow
                                            label="Usia"
                                            value={
                                                data.respondent.age != null
                                                    ? `${data.respondent.age} tahun`
                                                    : null
                                            }
                                        />
                                        <InfoRow
                                            label="No. HP"
                                            value={data.respondent.phone}
                                        />
                                        <InfoRow
                                            label="Status"
                                            value={data.respondent.status}
                                        />
                                        <InfoRow
                                            label="Pendidikan"
                                            value={
                                                data.respondent.educationLevel
                                            }
                                        />
                                        <InfoRow
                                            label="Pekerjaan"
                                            value={data.respondent.occupation}
                                        />
                                        <div className="col-span-2">
                                            <InfoRow
                                                label="Penghasilan / Bulan"
                                                value={
                                                    data.respondent
                                                        .monthlyIncome != null
                                                        ? `Rp ${data.respondent.monthlyIncome.toLocaleString('id-ID')}`
                                                        : null
                                                }
                                            />
                                        </div>
                                    </div>

                                    {/* Address — full width */}
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                            Alamat
                                        </span>
                                        <p className="text-sm font-semibold leading-relaxed text-slate-800">
                                            {data.respondent.address ?? '-'}
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 py-12 text-sm text-slate-400">
                                    <span className="material-symbols-outlined text-3xl">
                                        person_off
                                    </span>
                                    Data responden tidak tersedia
                                </div>
                            )}

                            {/* ── Timeline Section ── */}
                            {data.timelines && data.timelines.length > 0 && (
                                <div className="mt-2 flex flex-col gap-3">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                        Riwayat Review
                                    </p>
                                    <div className="relative flex flex-col gap-0">
                                        {data.timelines.map((t, idx) => {
                                            const cfg = ACTION_CONFIG[
                                                t.action
                                            ] ?? {
                                                label: t.action,
                                                icon: (
                                                    <Clock className="size-4" />
                                                ),
                                                color: 'text-slate-600',
                                                bg: 'bg-slate-50',
                                                border: 'border-slate-200',
                                            };
                                            const isLast =
                                                idx ===
                                                data.timelines!.length - 1;

                                            return (
                                                <div
                                                    key={t.id}
                                                    className="relative flex gap-3 pb-4"
                                                >
                                                    {/* Vertical line */}
                                                    {!isLast && (
                                                        <div className="absolute left-[15px] top-8 h-[calc(100%-20px)] w-px bg-slate-200" />
                                                    )}
                                                    {/* Icon dot */}
                                                    <div
                                                        className={`z-10 flex size-8 shrink-0 items-center justify-center rounded-full border ${cfg.border} ${cfg.bg}`}
                                                    >
                                                        <span
                                                            className={
                                                                cfg.color
                                                            }
                                                        >
                                                            {cfg.icon}
                                                        </span>
                                                    </div>
                                                    {/* Content */}
                                                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                                                        <div className="flex items-center gap-2">
                                                            <span
                                                                className={`text-xs font-bold ${cfg.color}`}
                                                            >
                                                                {cfg.label}
                                                            </span>
                                                            <span className="text-[10px] text-slate-400">
                                                                {t.decidedAt ??
                                                                    '-'}
                                                            </span>
                                                        </div>
                                                        <span className="text-xs text-slate-500">
                                                            oleh{' '}
                                                            <span className="font-semibold text-slate-700">
                                                                {t.decidedBy}
                                                            </span>
                                                        </span>
                                                        {t.notes && (
                                                            <p className="mt-1 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs leading-relaxed text-slate-600">
                                                                {t.notes}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body,
    );
}
