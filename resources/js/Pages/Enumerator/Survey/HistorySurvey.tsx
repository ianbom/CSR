import { PageHeader } from '@/Components/Enumerator';
import EnumeratorLayout from '@/Layouts/EnumeratorLayout';
import { Head, router } from '@inertiajs/react';
import {
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    ClipboardList,
    MapPin,
    X,
} from 'lucide-react';
import { useMemo, useState } from 'react';

// ─── Types ──────────────────────────────────────────────────

interface ProjectOption {
    id: number;
    name: string;
}

interface RespondentData {
    name: string;
    phone: string | null;
    address: string | null;
    gender: string | null;
    age: number | null;
}

interface SubmissionItem {
    id: number;
    assessmentType: string;
    status: string;
    submittedAt: string | null;
    photoPath: string | null;
    latitude: number;
    longitude: number;
    avgScore: number;
    project: { id: number; name: string };
    respondent: RespondentData | null;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationMeta {
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
    per_page: number;
}

interface Stats {
    total: number;
    approved: number;
    submitted: number;
    rejected: number;
    overallAvg: number;
}

interface Filters {
    project_id: string | null;
    status: string | null;
    sort_by: string;
    sort_order: 'asc' | 'desc';
    per_page: number;
}

interface Props {
    submissions: {
        data: SubmissionItem[];
        links: PaginationLink[];
        meta: PaginationMeta;
    };
    projects: ProjectOption[];
    stats: Stats;
    filters: Filters;
}

// ─── Helpers ────────────────────────────────────────────────

const statusLabel: Record<string, string> = {
    submitted: 'Submitted',
    approved: 'Approved',
    rejected: 'Revisi',
};

function scoreColor(score: number): string {
    if (score >= 4) return 'text-slate-900';
    if (score >= 3) return 'text-slate-700';
    return 'text-slate-500';
}

const formatDate = (dateString: string | null) => {
    if (!dateString) return '—';
    try {
        const date = new Date(dateString.replace(' ', 'T'));
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    } catch {
        return dateString;
    }
};

const formatGender = (gender: string | null) => {
    if (!gender) return '';
    if (gender.toLowerCase() === 'male') return 'Pria';
    if (gender.toLowerCase() === 'female') return 'Wanita';
    return gender;
};

// ─── Component ──────────────────────────────────────────────

export default function HistorySurvey({
    submissions,
    projects,
    stats,
    filters,
}: Props) {
    const [localFilters, setLocalFilters] = useState({
        project_id: filters.project_id || '',
        status: filters.status || '',
        sort_by: filters.sort_by || 'submitted_at',
        sort_order: filters.sort_order || 'desc',
        per_page: filters.per_page || 10,
    });

    const hasActiveFilter = !!localFilters.project_id || !!localFilters.status;

    const navigate = (overrides: Record<string, string | number>) => {
        const params = { ...localFilters, ...overrides, page: 1 };
        const cleaned = Object.fromEntries(
            Object.entries(params).filter(
                ([, v]) => v !== '' && v !== undefined && v !== null && v !== 0,
            ),
        );
        router.get(route('enumerator.survey.history'), cleaned, {
            preserveState: true,
            replace: true,
        });
    };

    const handleFilterChange = (key: string, value: string) => {
        setLocalFilters((prev) => ({ ...prev, [key]: value }));
        navigate({ [key]: value });
    };

    const handleSort = (field: string) => {
        const newOrder =
            localFilters.sort_by === field && localFilters.sort_order === 'desc'
                ? 'asc'
                : 'desc';
        setLocalFilters((prev) => ({
            ...prev,
            sort_by: field,
            sort_order: newOrder,
        }));
        navigate({ sort_by: field, sort_order: newOrder });
    };

    const clearFilters = () => {
        setLocalFilters({
            project_id: '',
            status: '',
            sort_by: 'submitted_at',
            sort_order: 'desc',
            per_page: 10,
        });
        router.get(
            route('enumerator.survey.history'),
            {},
            { preserveState: true, replace: true },
        );
    };

    const handlePageChange = (page: number) => {
        const params = { ...localFilters, page };
        const cleaned = Object.fromEntries(
            Object.entries(params).filter(
                ([, v]) => v !== '' && v !== undefined && v !== null && v !== 0,
            ),
        );
        router.get(route('enumerator.survey.history'), cleaned, {
            preserveState: true,
            replace: true,
        });
    };

    const { meta } = submissions;
    const pageNumbers = useMemo(() => {
        const pages: number[] = [];
        const delta = 2;
        for (
            let i = Math.max(1, meta.current_page - delta);
            i <= Math.min(meta.last_page, meta.current_page + delta);
            i++
        ) {
            pages.push(i);
        }
        return pages;
    }, [meta.current_page, meta.last_page]);

    const SortButton = ({
        field,
        children,
    }: {
        field: string;
        children: React.ReactNode;
    }) => (
        <button
            onClick={() => handleSort(field)}
            className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-[11px] font-medium transition-colors ${
                localFilters.sort_by === field
                    ? 'border-slate-400 bg-slate-800 text-white'
                    : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700'
            }`}
        >
            {children}
            {localFilters.sort_by === field &&
                (localFilters.sort_order === 'asc' ? (
                    <ChevronUp className="size-3" />
                ) : (
                    <ChevronDown className="size-3" />
                ))}
        </button>
    );

    return (
        <EnumeratorLayout activeNav="riwayat">
            <Head title="Riwayat Survei" />

            {/* ── Header ── */}
            <PageHeader
                title="Riwayat Survei"
                description="Semua data survei yang telah kamu kumpulkan."
            />

            {/* ── Stats Row ── */}
            <div className="mb-6 flex flex-wrap items-center gap-6 border-b border-slate-200 pb-6 pt-2">
                <div>
                    <span className="text-4xl font-bold tabular-nums text-slate-900">
                        {stats.total}
                    </span>
                    <span className="ml-2 text-sm text-slate-500">
                        Total Survei
                    </span>
                </div>
                <div className="h-8 w-px bg-slate-200" />
                <div className="flex items-center gap-6 text-sm text-slate-600">
                    <span className="flex flex-col">
                        <span className="text-2xl font-bold tabular-nums text-slate-800">
                            {stats.submitted}
                        </span>
                        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Submitted
                        </span>
                    </span>
                    <span className="flex flex-col">
                        <span className="text-2xl font-bold tabular-nums text-slate-800">
                            {stats.approved}
                        </span>
                        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Approved
                        </span>
                    </span>
                    <span className="flex flex-col">
                        <span className="text-2xl font-bold tabular-nums text-slate-800">
                            {stats.rejected}
                        </span>
                        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Revisi
                        </span>
                    </span>
                </div>
                <div className="h-8 w-px bg-slate-200" />
                <div className="flex flex-col text-sm text-slate-600">
                    <span className="text-2xl font-bold tabular-nums text-slate-800">
                        {stats.overallAvg.toFixed(2)}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Rata-Rata Nilai
                    </span>
                </div>
            </div>

            {/* ── Filters ── */}
            <div className="flex flex-wrap items-end gap-3">
                <select
                    value={localFilters.project_id}
                    onChange={(e) =>
                        handleFilterChange('project_id', e.target.value)
                    }
                    className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 focus:border-slate-400 focus:outline-none focus:ring-0"
                >
                    <option value="">Semua Proyek</option>
                    {projects.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.name}
                        </option>
                    ))}
                </select>

                <select
                    value={localFilters.status}
                    onChange={(e) =>
                        handleFilterChange('status', e.target.value)
                    }
                    className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 focus:border-slate-400 focus:outline-none focus:ring-0"
                >
                    <option value="">Semua Status</option>
                    <option value="submitted">Submitted</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Revisi</option>
                </select>

                <div className="flex gap-1.5">
                    <SortButton field="submitted_at">Tanggal</SortButton>
                    <SortButton field="avg_score">Rerata</SortButton>
                    <SortButton field="assessment_type">Tipe</SortButton>
                </div>

                {hasActiveFilter && (
                    <button
                        onClick={clearFilters}
                        className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-[11px] text-slate-400 transition-colors hover:text-slate-600"
                    >
                        <X className="size-3" />
                        Reset
                    </button>
                )}
            </div>

            {/* ── Submission Grid ── */}
            {submissions.data.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 py-20">
                    <ClipboardList className="mb-2 size-10 text-slate-300" />
                    <p className="text-sm text-slate-400">
                        Belum ada riwayat survei.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-3 pb-4 lg:grid-cols-3">
                    {submissions.data.map((item) => (
                        <div
                            key={item.id}
                            className="border-slate-150 group relative flex flex-col overflow-hidden rounded-lg border bg-white transition-shadow hover:shadow-md"
                            style={{
                                borderColor: 'rgb(226 232 240)',
                            }}
                        >
                            {/* Card top accent */}
                            <div className="absolute left-0 top-0 h-1 w-full bg-primary" />

                            {/* Card top */}
                            <div className="flex-1 p-4 pt-5">
                                {/* Badges row */}
                                <div className="mb-2 flex items-center gap-1.5">
                                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                                        {item.assessmentType}
                                    </span>
                                    <span
                                        className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                                            item.status === 'approved'
                                                ? 'bg-emerald-700 text-white'
                                                : item.status === 'rejected'
                                                  ? 'bg-amber-600 text-white'
                                                  : 'bg-indigo-600 text-white'
                                        }`}
                                    >
                                        {statusLabel[item.status] ??
                                            item.status}
                                    </span>
                                </div>

                                {/* Respondent */}
                                <h3 className="truncate text-sm font-semibold text-slate-900">
                                    {item.respondent?.name ?? '—'}
                                </h3>
                                <p className="mt-0.5 truncate text-[11px] text-slate-400">
                                    {item.project.name}
                                </p>

                                {/* Score */}
                                <div className="mt-3">
                                    <span
                                        className={`text-2xl font-bold tabular-nums leading-none ${scoreColor(item.avgScore)}`}
                                    >
                                        {item.avgScore.toFixed(2)}
                                    </span>
                                    <span className="ml-1 text-[10px] text-slate-400">
                                        Rerata
                                    </span>
                                </div>
                            </div>

                            {/* Card footer */}
                            <div className="flex items-center justify-between border-t border-slate-100 px-4 py-2.5 text-[11px] text-slate-400">
                                <span>{formatDate(item.submittedAt)}</span>
                                <div className="flex items-center gap-2">
                                    {item.respondent?.gender && (
                                        <span>
                                            {formatGender(
                                                item.respondent.gender,
                                            )}
                                            {item.respondent.age
                                                ? `, ${item.respondent.age} Tahun`
                                                : ''}
                                        </span>
                                    )}
                                    {item.latitude !== 0 &&
                                        item.longitude !== 0 && (
                                            <a
                                                href={`https://maps.google.com/?q=${item.latitude},${item.longitude}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-red-500 transition-colors hover:text-red-600"
                                            >
                                                <MapPin className="size-3" />
                                            </a>
                                        )}
                                    {(item.status === 'submitted' ||
                                        item.status === 'rejected') && (
                                        <a
                                            href={route(
                                                'enumerator.survey.edit',
                                                { submissionId: item.id },
                                            )}
                                            className="ml-1 font-medium text-primary transition-colors hover:text-primary/80"
                                        >
                                            Edit
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Pagination ── */}
            {meta.last_page > 1 && (
                <div className="flex items-center justify-between pb-6">
                    <div className="flex items-center gap-3">
                        <span className="text-xs tabular-nums text-slate-400">
                            {meta.from}–{meta.to} / {meta.total}
                        </span>
                        <select
                            value={localFilters.per_page}
                            onChange={(e) => {
                                const val = Number(e.target.value);
                                setLocalFilters((prev) => ({
                                    ...prev,
                                    per_page: val,
                                }));
                                navigate({ per_page: val });
                            }}
                            className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-500 focus:border-slate-400 focus:outline-none focus:ring-0"
                        >
                            {[10, 25, 50].map((n) => (
                                <option key={n} value={n}>
                                    {n}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-0.5">
                        <button
                            onClick={() =>
                                handlePageChange(meta.current_page - 1)
                            }
                            disabled={meta.current_page <= 1}
                            className="rounded-md p-1.5 text-slate-400 transition-colors hover:text-slate-600 disabled:opacity-30"
                        >
                            <ChevronLeft className="size-4" />
                        </button>

                        {pageNumbers[0] > 1 && (
                            <>
                                <button
                                    onClick={() => handlePageChange(1)}
                                    className="min-w-[28px] rounded-md px-1.5 py-1 text-xs tabular-nums text-slate-500 hover:bg-slate-100"
                                >
                                    1
                                </button>
                                {pageNumbers[0] > 2 && (
                                    <span className="px-0.5 text-xs text-slate-300">
                                        ···
                                    </span>
                                )}
                            </>
                        )}

                        {pageNumbers.map((p) => (
                            <button
                                key={p}
                                onClick={() => handlePageChange(p)}
                                className={`min-w-[28px] rounded-md px-1.5 py-1 text-xs tabular-nums transition-colors ${
                                    p === meta.current_page
                                        ? 'bg-slate-800 font-semibold text-white'
                                        : 'text-slate-500 hover:bg-slate-100'
                                }`}
                            >
                                {p}
                            </button>
                        ))}

                        {pageNumbers[pageNumbers.length - 1] <
                            meta.last_page && (
                            <>
                                {pageNumbers[pageNumbers.length - 1] <
                                    meta.last_page - 1 && (
                                    <span className="px-0.5 text-xs text-slate-300">
                                        ···
                                    </span>
                                )}
                                <button
                                    onClick={() =>
                                        handlePageChange(meta.last_page)
                                    }
                                    className="min-w-[28px] rounded-md px-1.5 py-1 text-xs tabular-nums text-slate-500 hover:bg-slate-100"
                                >
                                    {meta.last_page}
                                </button>
                            </>
                        )}

                        <button
                            onClick={() =>
                                handlePageChange(meta.current_page + 1)
                            }
                            disabled={meta.current_page >= meta.last_page}
                            className="rounded-md p-1.5 text-slate-400 transition-colors hover:text-slate-600 disabled:opacity-30"
                        >
                            <ChevronRight className="size-4" />
                        </button>
                    </div>
                </div>
            )}
        </EnumeratorLayout>
    );
}
