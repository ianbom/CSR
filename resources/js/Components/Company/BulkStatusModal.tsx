import { ReactNode, useState } from 'react';
import { createPortal } from 'react-dom';
import { router } from '@inertiajs/react';
import {
    X,
    CheckCircle2,
    XCircle,
    RotateCcw,
    AlertTriangle,
    FileText,
    Loader2,
} from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────

type SubmissionStatus = 'approved' | 'rejected' | 'submitted';

interface Props {
    selectedIds: number[];
    onClose: () => void;
    onSuccess?: () => void;
}

const STATUS_OPTIONS: {
    value: SubmissionStatus;
    label: string;
    description: string;
    icon: ReactNode;
    color: string;
    bg: string;
    border: string;
    ring: string;
}[] = [
    {
        value: 'approved',
        label: 'Setujui',
        description: 'Data sudah terverifikasi dan valid',
        icon: <CheckCircle2 className="size-5" />,
        color: 'text-emerald-700',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        ring: 'ring-emerald-500/20',
    },
    {
        value: 'rejected',
        label: 'Tolak',
        description: 'Data tidak memenuhi kriteria',
        icon: <XCircle className="size-5" />,
        color: 'text-red-700',
        bg: 'bg-red-50',
        border: 'border-red-200',
        ring: 'ring-red-500/20',
    },
    {
        value: 'submitted',
        label: 'Kembalikan',
        description: 'Kembalikan ke status submitted',
        icon: <RotateCcw className="size-5" />,
        color: 'text-amber-700',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        ring: 'ring-amber-500/20',
    },
];

export default function BulkStatusModal({
    selectedIds,
    onClose,
    onSuccess,
}: Props): ReactNode {
    const [status, setStatus] = useState<SubmissionStatus | null>(null);
    const [notes, setNotes] = useState('');
    const [processing, setProcessing] = useState(false);

    const handleSubmit = () => {
        if (!status) {
            return;
        }

        setProcessing(true);

        router.patch(
            route('submissions.bulk-status'),
            {
                submission_ids: selectedIds,
                status,
                notes: notes.trim() || null,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    onSuccess?.();
                    onClose();
                },
                onFinish: () => setProcessing(false),
            },
        );
    };

    return createPortal(
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={(e) => {
                if (e.target === e.currentTarget && !processing) {
                    onClose();
                }
            }}
        >
            <div className="relative mx-4 w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
                            <FileText className="size-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">
                                Ubah Status Submission
                            </h3>
                            <p className="text-sm text-slate-500">
                                {selectedIds.length} submission dipilih
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={processing}
                        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="space-y-5 px-6 py-5">
                    {/* Status Selection */}
                    <div>
                        <label className="mb-2.5 block text-sm font-semibold text-slate-700">
                            Pilih Status Baru
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {STATUS_OPTIONS.map((opt) => {
                                const isSelected = status === opt.value;
                                return (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => setStatus(opt.value)}
                                        className={`flex flex-col items-center gap-2 rounded-xl border-2 px-3 py-4 transition-all ${
                                            isSelected
                                                ? `${opt.border} ${opt.bg} ring-2 ${opt.ring}`
                                                : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'
                                        }`}
                                    >
                                        <span
                                            className={
                                                isSelected
                                                    ? opt.color
                                                    : 'text-slate-400'
                                            }
                                        >
                                            {opt.icon}
                                        </span>
                                        <span
                                            className={`text-sm font-semibold ${
                                                isSelected
                                                    ? opt.color
                                                    : 'text-slate-600'
                                            }`}
                                        >
                                            {opt.label}
                                        </span>
                                        <span className="text-center text-[10px] leading-tight text-slate-400">
                                            {opt.description}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <label
                            htmlFor="bulk-notes"
                            className="mb-1.5 block text-sm font-semibold text-slate-700"
                        >
                            Catatan{' '}
                            <span className="font-normal text-slate-400">
                                (opsional)
                            </span>
                        </label>
                        <textarea
                            id="bulk-notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                            maxLength={1000}
                            placeholder="Tambahkan catatan untuk perubahan status ini..."
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 placeholder:text-slate-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                        <div className="mt-1 text-right text-[10px] text-slate-400">
                            {notes.length}/1000
                        </div>
                    </div>

                    {/* Warning */}
                    {status === 'rejected' && (
                        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3">
                            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-500" />
                            <p className="text-xs leading-relaxed text-amber-700">
                                Submission yang ditolak akan ditandai sebagai{' '}
                                <strong>rejected</strong>. Pastikan catatan
                                sudah diisi agar enumerator tahu alasannya.
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
                    <button
                        onClick={onClose}
                        disabled={processing}
                        className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!status || processing}
                        className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                            status === 'approved'
                                ? 'bg-emerald-600 hover:bg-emerald-700'
                                : status === 'rejected'
                                  ? 'bg-red-600 hover:bg-red-700'
                                  : 'bg-amber-600 hover:bg-amber-700'
                        } ${!status ? 'bg-slate-400' : ''}`}
                    >
                        {processing && (
                            <Loader2 className="size-4 animate-spin" />
                        )}
                        {processing ? 'Memproses...' : 'Konfirmasi'}
                    </button>
                </div>
            </div>
        </div>,
        document.body,
    );
}
