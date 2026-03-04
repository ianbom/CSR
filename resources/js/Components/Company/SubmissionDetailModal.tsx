import { ReactNode } from 'react';
import { createPortal } from 'react-dom';

// ─── Types ─────────────────────────────────────────────────

interface RespondentInfo {
    name: string;
    gender: string | null;
    age: number | null;
    educationLevel: string | null;
    address: string | null;
}

export interface SubmissionDetailData {
    submissionId: number;
    submittedAt: string | null;
    photoPath: string | null;
    latitude: number | string | null;
    longitude: number | string | null;
    respondent: RespondentInfo | null;
}

interface Props {
    data: SubmissionDetailData;
    onClose: () => void;
}

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
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                    <div>
                        <h3 className="text-base font-bold text-slate-900">
                            Detail Submission
                        </h3>
                        <p className="text-xs text-slate-400">
                            #{data.submissionId} · {data.submittedAt ?? '-'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex size-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                    >
                        <span className="material-symbols-outlined text-xl">
                            close
                        </span>
                    </button>
                </div>

                <div className="space-y-5 p-6">
                    {/* Photo */}
                    <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Foto
                        </p>
                        {data.photoPath ? (
                            <a
                                href={`/storage/${data.photoPath}`}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <img
                                    src={`/storage/${data.photoPath}`}
                                    alt="Foto responden"
                                    className="max-h-64 w-full rounded-xl object-cover shadow-sm ring-1 ring-slate-200"
                                />
                            </a>
                        ) : (
                            <div className="flex h-32 items-center justify-center rounded-xl bg-slate-100 text-sm text-slate-400">
                                <span className="material-symbols-outlined mr-2 text-2xl">
                                    no_photography
                                </span>
                                Tidak ada foto
                            </div>
                        )}
                    </div>

                    {/* GPS */}
                    <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Lokasi GPS
                        </p>
                        {hasGps ? (
                            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                                <div className="mb-2 flex items-center gap-2 text-sm">
                                    <span className="material-symbols-outlined text-base text-primary">
                                        location_on
                                    </span>
                                    <span className="font-mono text-slate-700">
                                        {lat!.toFixed(6)}, {lng!.toFixed(6)}
                                    </span>
                                </div>
                                <a
                                    href={`https://www.google.com/maps?q=${lat},${lng}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-opacity hover:opacity-90"
                                >
                                    <span className="material-symbols-outlined text-sm leading-none">
                                        open_in_new
                                    </span>
                                    Buka di Google Maps
                                </a>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-400">
                                <span className="material-symbols-outlined text-base">
                                    location_off
                                </span>
                                Koordinat tidak tersedia
                            </div>
                        )}
                    </div>

                    {/* Respondent info */}
                    {data.respondent && (
                        <div>
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                Responden
                            </p>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
                                <div>
                                    <span className="text-slate-400">
                                        Nama:{' '}
                                    </span>
                                    <span className="font-medium text-slate-700">
                                        {data.respondent.name}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-slate-400">
                                        Gender:{' '}
                                    </span>
                                    <span className="font-medium text-slate-700">
                                        {data.respondent.gender ?? '-'}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-slate-400">
                                        Usia:{' '}
                                    </span>
                                    <span className="font-medium text-slate-700">
                                        {data.respondent.age ?? '-'}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-slate-400">
                                        Pendidikan:{' '}
                                    </span>
                                    <span className="font-medium text-slate-700">
                                        {data.respondent.educationLevel ?? '-'}
                                    </span>
                                </div>
                                <div className="col-span-2">
                                    <span className="text-slate-400">
                                        Alamat:{' '}
                                    </span>
                                    <span className="font-medium text-slate-700">
                                        {data.respondent.address ?? '-'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body,
    );
}
