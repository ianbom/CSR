import {
    CheckSquare,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    Filter,
    MinusSquare,
    Square,
    X,
} from 'lucide-react';
import { ReactNode, useMemo, useState } from 'react';
import BulkStatusModal from './BulkStatusModal';
import SubmissionDetailModal from './SubmissionDetailModal';

// ─── Types ─────────────────────────────────────────────────

export interface QuestionHeader {
    code: string;
    question: string;
}

export interface RespondentData {
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

export interface TimelineEntry {
    id: number;
    action: string;
    decidedAt: string | null;
    decidedBy: string;
    notes: string | null;
}

export interface SLOIRespondentRow {
    submissionId: number;
    submittedAt: string | null;
    status: string;
    enumerator: string;
    latitude: number | null;
    longitude: number | null;
    photoPath: string | null;
    avgScore: number;
    respondent: RespondentData | null;
    answers: Record<
        string,
        { kepentingan: number | null; kinerja: number | null }
    >;
    timelines: TimelineEntry[];
}

export interface PaginationData {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
}

export interface FilterOptions {
    enumerators: string[];
    statuses: string[];
    educations: string[];
    genders: string[];
}

export interface SLOIRespondentsData {
    questions: QuestionHeader[];
    rows: SLOIRespondentRow[];
    pagination: PaginationData;
    filterOptions: FilterOptions;
}

export interface RespondentFilters {
    enumerator: string;
    resp_status: string;
    education: string;
    gender: string;
    sort_by: string;
    sort_order: string;
    per_page: number;
}

interface Props {
    respondents: SLOIRespondentsData;
    filters: RespondentFilters;
    onNavigate: (params: Record<string, string | number>) => void;
}

export default function SLOIRespondentTable({
    respondents,
    filters,
    onNavigate,
}: Props): ReactNode {
    const { questions, rows, pagination, filterOptions } = respondents;
    const [selected, setSelected] = useState<SLOIRespondentRow | null>(null);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [showBulkModal, setShowBulkModal] = useState(false);

    const hasActiveFilter =
        filters.enumerator ||
        filters.resp_status ||
        filters.education ||
        filters.gender;

    const navigate = (params: Record<string, string | number>) => {
        const query: Record<string, string | number> = {
            enumerator: filters.enumerator,
            resp_status: filters.resp_status,
            education: filters.education,
            gender: filters.gender,
            sort_by: filters.sort_by,
            sort_order: filters.sort_order,
            per_page: filters.per_page,
            ...params,
        };

        const cleaned = Object.fromEntries(
            Object.entries(query).filter(
                ([, v]) => v !== '' && v !== undefined && v !== null,
            ),
        );

        onNavigate(cleaned);
    };

    const handleFilterChange = (key: string, value: string) => {
        navigate({ [key]: value, page: 1 });
    };

    const clearFilters = () => {
        navigate({
            enumerator: '',
            resp_status: '',
            education: '',
            gender: '',
            page: 1,
        });
    };

    const handleSort = (field: string) => {
        const sortKey = field === 'submittedAt' ? 'submitted_at' : 'avg_score';
        const newOrder =
            filters.sort_by === sortKey && filters.sort_order === 'desc'
                ? 'asc'
                : 'desc';
        navigate({ sort_by: sortKey, sort_order: newOrder, page: 1 });
    };

    const handlePageChange = (page: number) => {
        navigate({ page });
    };

    const SortIcon = ({ field }: { field: string }) => {
        const sortKey = field === 'submittedAt' ? 'submitted_at' : 'avg_score';
        if (filters.sort_by !== sortKey) {
            return <ChevronDown className="size-3 text-slate-300" />;
        }
        return filters.sort_order === 'asc' ? (
            <ChevronUp className="size-3 text-primary" />
        ) : (
            <ChevronDown className="size-3 text-primary" />
        );
    };

    const allIds = useMemo(() => rows.map((r) => r.submissionId), [rows]);
    const isAllSelected = rows.length > 0 && selectedIds.length === rows.length;
    const isPartialSelected =
        selectedIds.length > 0 && selectedIds.length < rows.length;

    const toggleSelect = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
        );
    };

    const toggleSelectAll = () => {
        setSelectedIds(isAllSelected ? [] : allIds);
    };

    const pageNumbers = useMemo(() => {
        const pages: number[] = [];
        const { currentPage, lastPage } = pagination;
        const delta = 2;
        for (
            let i = Math.max(1, currentPage - delta);
            i <= Math.min(lastPage, currentPage + delta);
            i++
        ) {
            pages.push(i);
        }
        return pages;
    }, [pagination]);

    const startItem = (pagination.currentPage - 1) * pagination.perPage + 1;
    const endItem = Math.min(
        pagination.currentPage * pagination.perPage,
        pagination.total,
    );

    return (
        <div className="space-y-6">
            {/* ── Filter Section ── */}
            <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <Filter className="size-4" />
                        Filter
                    </div>
                    {hasActiveFilter && (
                        <button
                            onClick={clearFilters}
                            className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
                        >
                            <X className="size-3" />
                            Reset Filter
                        </button>
                    )}
                </div>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    <div>
                        <label className="mb-1 block text-[11px] font-medium text-slate-500">
                            Enumerator
                        </label>
                        <select
                            value={filters.enumerator}
                            onChange={(e) =>
                                handleFilterChange('enumerator', e.target.value)
                            }
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                            <option value="">Semua</option>
                            {filterOptions.enumerators.map((e) => (
                                <option key={e} value={e}>
                                    {e}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="mb-1 block text-[11px] font-medium text-slate-500">
                            Status Submission
                        </label>
                        <select
                            value={filters.resp_status}
                            onChange={(e) =>
                                handleFilterChange(
                                    'resp_status',
                                    e.target.value,
                                )
                            }
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                            <option value="">Semua</option>
                            {filterOptions.statuses.map((s) => (
                                <option key={s} value={s}>
                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="mb-1 block text-[11px] font-medium text-slate-500">
                            Pendidikan
                        </label>
                        <select
                            value={filters.education}
                            onChange={(e) =>
                                handleFilterChange('education', e.target.value)
                            }
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                            <option value="">Semua</option>
                            {filterOptions.educations.map((ed) => (
                                <option key={ed} value={ed}>
                                    {ed}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="mb-1 block text-[11px] font-medium text-slate-500">
                            Gender
                        </label>
                        <select
                            value={filters.gender}
                            onChange={(e) =>
                                handleFilterChange('gender', e.target.value)
                            }
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                            <option value="">Semua</option>
                            {filterOptions.genders.map((g) => (
                                <option key={g} value={g}>
                                    {g}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Bulk Action Bar */}
            {selectedIds.length > 0 && (
                <div className="flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 px-5 py-3">
                    <div className="flex items-center gap-3">
                        <CheckSquare className="size-5 text-primary" />
                        <span className="text-sm font-semibold text-primary">
                            {selectedIds.length} submission dipilih
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setSelectedIds([])}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50"
                        >
                            Batal Pilih
                        </button>
                        <button
                            onClick={() => setShowBulkModal(true)}
                            className="rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-primary/90"
                        >
                            Ubah Status
                        </button>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/80">
                                <th className="sticky left-0 z-10 bg-slate-50/80 px-3 py-3 text-center">
                                    <button
                                        onClick={toggleSelectAll}
                                        className="text-slate-400 transition-colors hover:text-primary"
                                    >
                                        {isAllSelected ? (
                                            <CheckSquare className="size-4 text-primary" />
                                        ) : isPartialSelected ? (
                                            <MinusSquare className="size-4 text-primary" />
                                        ) : (
                                            <Square className="size-4" />
                                        )}
                                    </button>
                                </th>
                                <th className="bg-slate-50/80 px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                    No
                                </th>
                                <th className="sticky left-10 z-10 min-w-[160px] bg-slate-50/80 px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                    Nama
                                </th>
                                <th className="min-w-[130px] px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                    Enumerator
                                </th>
                                <th
                                    className="min-w-[130px] cursor-pointer select-none px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400 transition-colors hover:text-slate-600"
                                    onClick={() => handleSort('submittedAt')}
                                >
                                    <span className="inline-flex items-center gap-1">
                                        Tgl Kirim
                                        <SortIcon field="submittedAt" />
                                    </span>
                                </th>
                                <th
                                    className="min-w-[70px] cursor-pointer select-none px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-slate-400 transition-colors hover:text-slate-600"
                                    onClick={() => handleSort('avgScore')}
                                >
                                    <span className="inline-flex items-center gap-1">
                                        Rerata
                                        <SortIcon field="avgScore" />
                                    </span>
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
                                        colSpan={11 + questions.length + 1}
                                        className="px-4 py-12 text-center text-sm text-slate-400"
                                    >
                                        Belum ada data responden
                                    </td>
                                </tr>
                            )}
                            {rows.map((row, idx) => (
                                <tr
                                    key={row.submissionId}
                                    className={`transition-colors hover:bg-slate-50/50 ${selectedIds.includes(row.submissionId) ? 'bg-primary/5' : ''}`}
                                >
                                    <td className="sticky left-0 z-10 bg-white px-3 py-3 text-center">
                                        <button
                                            onClick={() =>
                                                toggleSelect(row.submissionId)
                                            }
                                            className="text-slate-400 transition-colors hover:text-primary"
                                        >
                                            {selectedIds.includes(
                                                row.submissionId,
                                            ) ? (
                                                <CheckSquare className="size-4 text-primary" />
                                            ) : (
                                                <Square className="size-4" />
                                            )}
                                        </button>
                                    </td>
                                    <td className="bg-white px-4 py-3 font-medium text-slate-500">
                                        {startItem + idx}
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
                                    <td className="px-4 py-3 text-center">
                                        <span
                                            className={`font-bold ${
                                                row.avgScore >= 4
                                                    ? 'text-green-600'
                                                    : row.avgScore >= 3
                                                      ? 'text-amber-600'
                                                      : 'text-red-500'
                                            }`}
                                        >
                                            {row.avgScore}
                                        </span>
                                    </td>
                                    {questions.map((q) => {
                                        const ans = row.answers[q.code];
                                        const val =
                                            ans?.kepentingan ?? ans?.kinerja;
                                        return (
                                            <td
                                                key={q.code}
                                                className="px-3 py-3 text-center text-slate-600"
                                            >
                                                {val ?? '-'}
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
                                                      : 'bg-orange-100 text-orange-700'
                                            }`}
                                        >
                                            {row.status === 'rejected'
                                                ? 'Revisi'
                                                : row.status === 'approved'
                                                  ? 'Approved'
                                                  : 'Submitted'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── Pagination ── */}
            <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-white px-5 py-3 shadow-sm">
                <div className="flex items-center gap-3">
                    <p className="text-xs text-slate-500">
                        Menampilkan {startItem}-{endItem} dari{' '}
                        {pagination.total} data
                    </p>
                    <select
                        value={filters.per_page}
                        onChange={(e) =>
                            navigate({
                                per_page: Number(e.target.value),
                                page: 1,
                            })
                        }
                        className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                        {[10, 50, 100].map((n) => (
                            <option key={n} value={n}>
                                {n} / halaman
                            </option>
                        ))}
                    </select>
                </div>
                {pagination.lastPage > 1 && (
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() =>
                                handlePageChange(pagination.currentPage - 1)
                            }
                            disabled={pagination.currentPage <= 1}
                            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 disabled:opacity-40 disabled:hover:bg-transparent"
                        >
                            <ChevronLeft className="size-4" />
                        </button>
                        {pageNumbers[0] > 1 && (
                            <>
                                <button
                                    onClick={() => handlePageChange(1)}
                                    className="min-w-[32px] rounded-lg px-2 py-1 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100"
                                >
                                    1
                                </button>
                                {pageNumbers[0] > 2 && (
                                    <span className="px-1 text-xs text-slate-400">
                                        ...
                                    </span>
                                )}
                            </>
                        )}
                        {pageNumbers.map((p) => (
                            <button
                                key={p}
                                onClick={() => handlePageChange(p)}
                                className={`min-w-[32px] rounded-lg px-2 py-1 text-xs font-medium transition-colors ${
                                    p === pagination.currentPage
                                        ? 'bg-primary text-white'
                                        : 'text-slate-600 hover:bg-slate-100'
                                }`}
                            >
                                {p}
                            </button>
                        ))}
                        {pageNumbers[pageNumbers.length - 1] <
                            pagination.lastPage && (
                            <>
                                {pageNumbers[pageNumbers.length - 1] <
                                    pagination.lastPage - 1 && (
                                    <span className="px-1 text-xs text-slate-400">
                                        ...
                                    </span>
                                )}
                                <button
                                    onClick={() =>
                                        handlePageChange(pagination.lastPage)
                                    }
                                    className="min-w-[32px] rounded-lg px-2 py-1 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100"
                                >
                                    {pagination.lastPage}
                                </button>
                            </>
                        )}
                        <button
                            onClick={() =>
                                handlePageChange(pagination.currentPage + 1)
                            }
                            disabled={
                                pagination.currentPage >= pagination.lastPage
                            }
                            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 disabled:opacity-40 disabled:hover:bg-transparent"
                        >
                            <ChevronRight className="size-4" />
                        </button>
                    </div>
                )}
            </div>

            {/* ── Detail Modal ── */}
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
                        timelines: selected.timelines,
                    }}
                    onClose={() => setSelected(null)}
                />
            )}

            {/* ── Bulk Status Modal ── */}
            {showBulkModal && (
                <BulkStatusModal
                    selectedIds={selectedIds}
                    onClose={() => setShowBulkModal(false)}
                    onSuccess={() => setSelectedIds([])}
                />
            )}
        </div>
    );
}
