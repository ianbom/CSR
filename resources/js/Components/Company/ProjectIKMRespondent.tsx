import { ReactNode, useState } from 'react';
import SubmissionDetailModal from './SubmissionDetailModal';

// ─── Types ─────────────────────────────────────────────────

interface QuestionHeader {
    code: string;
    question: string;
}

interface RespondentData {
    id: number;
    name: string;
    address: string | null;
    phone: string | null;
    age: number | null;
    gender: string | null;
    status: string | null;
    educationLevel: string | null;
    occupation: string | null;
    monthlyIncome: number | null;
}

interface RespondentRow {
    submissionId: number;
    submittedAt: string | null;
    status: string;
    enumerator: string;
    latitude: number | null;
    longitude: number | null;
    photoPath: string | null;
    avgScore: number;
    avgKepentingan: number | null;
    avgKinerja: number | null;
    respondent: RespondentData | null;
    answers: Record<
        string,
        { kepentingan: number | null; kinerja: number | null }
    >;
}

interface RespondentsData {
    questions: QuestionHeader[];
    rows: RespondentRow[];
}

interface Props {
    respondents: RespondentsData;
}

export default function ProjectIKMRespondent({
    respondents,
}: Props): ReactNode {
    const { questions, rows } = respondents;
    const [selected, setSelected] = useState<RespondentRow | null>(null);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">
                        Data Responden IKM
                    </h2>
                    <p className="text-sm text-slate-500">
                        Total {rows.length} responden
                    </p>
                    <div className="mt-1 flex items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                            <span className="size-2.5 rounded-full bg-blue-500" />
                            Kepentingan
                        </span>
                        <span>/</span>
                        <span className="flex items-center gap-1">
                            <span className="size-2.5 rounded-full bg-emerald-500" />
                            Kinerja
                        </span>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/80">
                                <th className="sticky left-0 z-10 bg-slate-50/80 px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                    No
                                </th>
                                <th className="sticky left-10 z-10 min-w-[160px] bg-slate-50/80 px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                    Nama
                                </th>
                                <th className="min-w-[130px] px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                    Enumerator
                                </th>
                                <th className="min-w-[130px] px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                    Tgl Kirim
                                </th>
                                <th className="min-w-[70px] px-3 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                    Rerata
                                </th>
                                <th className="min-w-[70px] px-3 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-blue-400">
                                    Rerata Kep.
                                </th>
                                <th className="min-w-[70px] px-3 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-emerald-500">
                                    Rerata Kin.
                                </th>
                                {questions.map((q) => (
                                    <th
                                        key={q.code}
                                        className="min-w-[60px] px-3 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-slate-400"
                                        title={q.question}
                                    >
                                        {q.code}
                                    </th>
                                ))}
                                <th className="min-w-[80px] px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                    Lihat
                                </th>
                                <th className="min-w-[80px] px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {rows.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={10 + questions.length + 1}
                                        className="px-4 py-12 text-center text-sm text-slate-400"
                                    >
                                        Belum ada data responden
                                    </td>
                                </tr>
                            )}
                            {rows.map((row, idx) => (
                                <tr
                                    key={row.submissionId}
                                    className="transition-colors hover:bg-slate-50/50"
                                >
                                    <td className="sticky left-0 z-10 bg-white px-4 py-3 font-medium text-slate-500">
                                        {idx + 1}
                                    </td>
                                    <td className="sticky left-10 z-10 bg-white px-4 py-3">
                                        <div className="font-medium text-slate-900">
                                            {row.respondent?.name ?? '-'}
                                        </div>
                                        {row.respondent?.phone && (
                                            <div className="text-[11px] text-slate-400">
                                                {row.respondent.phone}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-slate-600">
                                        {row.enumerator}
                                    </td>
                                    <td className="px-4 py-3 text-slate-500">
                                        {row.submittedAt ?? '-'}
                                    </td>
                                    {/* Rerata Total */}
                                    <td className="px-3 py-3 text-center">
                                        <span
                                            className={`font-bold ${
                                                row.avgScore >= 3
                                                    ? 'text-green-600'
                                                    : row.avgScore >= 2
                                                      ? 'text-amber-600'
                                                      : 'text-red-500'
                                            }`}
                                        >
                                            {row.avgScore}
                                        </span>
                                    </td>
                                    {/* Rerata Kepentingan */}
                                    <td className="px-3 py-3 text-center">
                                        <span className="font-bold text-blue-600">
                                            {row.avgKepentingan ?? '-'}
                                        </span>
                                    </td>
                                    {/* Rerata Kinerja */}
                                    <td className="px-3 py-3 text-center">
                                        <span className="font-bold text-emerald-600">
                                            {row.avgKinerja ?? '-'}
                                        </span>
                                    </td>
                                    {questions.map((q) => {
                                        const ans = row.answers[q.code];
                                        const kep = ans?.kepentingan;
                                        const kin = ans?.kinerja;
                                        return (
                                            <td
                                                key={q.code}
                                                className="px-3 py-3 text-center"
                                            >
                                                {kep != null || kin != null ? (
                                                    <span className="inline-flex items-center gap-0.5 font-semibold">
                                                        <span className="text-blue-600">
                                                            {kep ?? '-'}
                                                        </span>
                                                        <span className="text-slate-300">
                                                            /
                                                        </span>
                                                        <span className="text-emerald-600">
                                                            {kin ?? '-'}
                                                        </span>
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400">
                                                        -
                                                    </span>
                                                )}
                                            </td>
                                        );
                                    })}
                                    {/* Lihat */}
                                    <td className="px-4 py-3 text-center">
                                        <button
                                            onClick={() => setSelected(row)}
                                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-medium text-slate-600 transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary"
                                        >
                                            <span className="material-symbols-outlined text-sm leading-none">
                                                visibility
                                            </span>
                                            Lihat
                                        </button>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span
                                            className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                                                row.status === 'approved'
                                                    ? 'bg-green-100 text-green-700'
                                                    : row.status === 'submitted'
                                                      ? 'bg-amber-100 text-amber-700'
                                                      : 'bg-red-100 text-red-700'
                                            }`}
                                        >
                                            {row.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── Detail Modal (shared component) ── */}
            {selected && (
                <SubmissionDetailModal
                    data={{
                        submissionId: selected.submissionId,
                        submittedAt: selected.submittedAt,
                        photoPath: selected.photoPath,
                        latitude: selected.latitude,
                        longitude: selected.longitude,
                        enumerator: selected.enumerator,
                        respondent: selected.respondent
                            ? {
                                  name: selected.respondent.name,
                                  gender: selected.respondent.gender,
                                  age: selected.respondent.age,
                                  educationLevel:
                                      selected.respondent.educationLevel,
                                  address: selected.respondent.address,
                                  phone: selected.respondent.phone,
                                  status: selected.respondent.status,
                                  occupation: selected.respondent.occupation,
                                  monthlyIncome:
                                      selected.respondent.monthlyIncome,
                              }
                            : null,
                    }}
                    onClose={() => setSelected(null)}
                />
            )}
        </div>
    );
}
